-- ============================================================================
-- Nesty reservations: availability engine, soft-lock, lifecycle, audit,
-- incidents and notifications.
-- ----------------------------------------------------------------------------
-- Makes the Reservation module the single source of truth for availability and
-- pushes ALL business rules into Postgres (EXCLUDE constraint + triggers +
-- RLS) so the web dashboard and the future mobile app enforce identical
-- behavior. TypeScript guards are only a UX mirror.
--
-- Everything here is ADDITIVE and idempotent — safe to re-run and backward
-- compatible with rows the mobile app already wrote.
--
-- Apply once to the shared Nesty Supabase project (SQL editor or `supabase db`).
-- ============================================================================

create extension if not exists btree_gist;

-- ────────────────────────────────────────────────────────────────────────────
-- 1) Reservation lifecycle: widen status + add tracking columns
-- ────────────────────────────────────────────────────────────────────────────
-- Legacy status set was ('pending','confirmed','cancelled','completed'). Add
-- 'rejected' (agency declines a pending request) and 'expired' (soft-lock timed
-- out). Convert to plain text + CHECK so pre-migration rows stay valid.

alter table public.reservations alter column status type text using status::text;
alter table public.reservations alter column status set default 'pending';

alter table public.reservations drop constraint if exists reservations_status_check;
alter table public.reservations
  add constraint reservations_status_check check (
    status in (
      'pending','confirmed','rejected','cancelled','expired','completed'
    )
  );

alter table public.reservations
  add column if not exists reference           text,
  add column if not exists expires_at          timestamptz,
  add column if not exists confirmed_at         timestamptz,
  add column if not exists cancellation_reason  text,
  add column if not exists cancelled_by         uuid,
  add column if not exists updated_at           timestamptz not null default now(),
  -- Maintained by trigger (immutable-expression rules forbid a generated col here).
  add column if not exists active_range         tstzrange;

-- Human-friendly reference (e.g. NBK-1A2B3C) for existing rows.
update public.reservations
   set reference = 'NBK-' || upper(substr(md5(id::text), 1, 6))
 where reference is null;

-- Give any legacy pending row a 48h soft-lock window from its creation.
update public.reservations
   set expires_at = created_at + interval '48 hours'
 where status = 'pending' and expires_at is null;

create index if not exists reservations_host_status_idx
  on public.reservations (host_id, status);
create index if not exists reservations_listing_status_idx
  on public.reservations (listing_id, status);
create index if not exists reservations_expires_idx
  on public.reservations (expires_at) where status = 'pending';

-- ────────────────────────────────────────────────────────────────────────────
-- 2) Manual availability blocks (agency-blocked periods)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.availability_blocks (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings (id) on delete cascade,
  host_id     uuid not null references auth.users (id),
  start_date  date not null,
  end_date    date not null,           -- exclusive checkout-style end
  reason      text,
  created_at  timestamptz not null default now(),
  -- daterange over plain dates IS immutable, so a generated column is fine here.
  block_range daterange generated always as (daterange(start_date, end_date, '[)')) stored,
  constraint availability_blocks_range_chk check (end_date > start_date)
);

create index if not exists availability_blocks_listing_idx
  on public.availability_blocks (listing_id);

-- No two blocks for the same listing may overlap.
alter table public.availability_blocks
  drop constraint if exists availability_blocks_no_overlap;
alter table public.availability_blocks
  add constraint availability_blocks_no_overlap
  exclude using gist (listing_id with =, block_range with &&);

-- ────────────────────────────────────────────────────────────────────────────
-- 3) Immutable reservation timeline / audit trail
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.reservation_events (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations (id) on delete cascade,
  actor_id       uuid,
  actor_role     text,
  event_type     text not null,       -- created | confirmed | rejected | cancelled | expired | completed | modified
  from_status    text,
  to_status      text,
  reason         text,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index if not exists reservation_events_res_idx
  on public.reservation_events (reservation_id, created_at);

-- ────────────────────────────────────────────────────────────────────────────
-- 4) In-app notifications
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  type           text not null,
  reservation_id uuid references public.reservations (id) on delete cascade,
  payload        jsonb not null default '{}'::jsonb,
  read_at        timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- 5) Reservation incidents (agency reports, Nesty Support resolves)
-- ────────────────────────────────────────────────────────────────────────────
create table if not exists public.reservation_incidents (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations (id) on delete cascade,
  reporter_id    uuid not null references auth.users (id),
  type           text not null default 'other',
    -- conflict | double_booking | unavailable | access | payment | damage | cleaning | other
  description    text not null,
  occurred_on    date not null default current_date,
  status         text not null default 'created',
    -- created | under_review | resolved | closed
  estimated_cost numeric,
  attachments    text[] not null default '{}',
  resolution     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint reservation_incidents_type_chk check (
    type in ('conflict','double_booking','unavailable','access','payment','damage','cleaning','other')
  ),
  constraint reservation_incidents_status_chk check (
    status in ('created','under_review','resolved','closed')
  )
);

create index if not exists reservation_incidents_reservation_idx
  on public.reservation_incidents (reservation_id);
create index if not exists reservation_incidents_reporter_idx
  on public.reservation_incidents (reporter_id, updated_at desc);

-- ────────────────────────────────────────────────────────────────────────────
-- 6) Derived-field + block-guard triggers on reservations
-- ────────────────────────────────────────────────────────────────────────────
-- Keeps active_range, host_id, reference, expires_at, confirmed_at, updated_at
-- in sync and blocks any reservation that lands on a manually blocked period.
create or replace function public.reservations_set_derived()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_start timestamptz := new.start_at;
  v_end   timestamptz;
begin
  -- Fill host_id from the listing when the caller didn't provide it.
  if new.host_id is null then
    select host_id into new.host_id from public.listings where id = new.listing_id;
  end if;

  if new.reference is null then
    new.reference := 'NBK-' || upper(substr(md5(coalesce(new.id::text, gen_random_uuid()::text)), 1, 6));
  end if;

  -- Occupancy window: stays hold [check-in day, check-out day); visits a 1h slot.
  if new.type = 'stay' then
    v_start := date_trunc('day', new.start_at);
    v_end   := coalesce(date_trunc('day', new.end_at), v_start + interval '1 day');
    if v_end <= v_start then v_end := v_start + interval '1 day'; end if;
  else
    v_end := new.start_at + interval '1 hour';
  end if;
  new.active_range := tstzrange(v_start, v_end, '[)');

  -- 48h soft-lock window for a fresh pending request.
  if new.status = 'pending' and new.expires_at is null then
    new.expires_at := now() + interval '48 hours';
  end if;
  if new.status = 'confirmed' and new.confirmed_at is null then
    new.confirmed_at := now();
  end if;

  new.updated_at := now();

  -- Guard: an active reservation may not overlap a manual block.
  if new.status in ('pending','confirmed') then
    if exists (
      select 1 from public.availability_blocks b
       where b.listing_id = new.listing_id
         and b.block_range && daterange(
               (new.active_range).lower::date,
               greatest((new.active_range).upper::date, (new.active_range).lower::date + 1),
               '[)')
    ) then
      raise exception 'These dates are blocked for this listing.'
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_reservations_set_derived on public.reservations;
create trigger trg_reservations_set_derived
  before insert or update on public.reservations
  for each row execute function public.reservations_set_derived();

-- Participant RLS scopes rows; this trigger also scopes reservation fields and
-- allowed state changes so direct Data API updates follow the same rules.
create or replace function public.reservations_enforce_actor()
returns trigger language plpgsql set search_path = '' as $$
declare
  caller_id uuid := auth.uid();
begin
  -- Trusted server jobs (such as the expiry sweep) have no end-user id.
  if caller_id is null then
    return new;
  end if;

  if caller_id = old.guest_id then
    if new.status is distinct from old.status
       and not (old.status in ('pending', 'confirmed') and new.status = 'cancelled') then
      raise exception 'Travellers may only cancel an active reservation.';
    end if;
    if (new.start_at, new.end_at, new.guests, new.note)
       is distinct from (old.start_at, old.end_at, old.guests, old.note)
       or (to_jsonb(new) - array['status', 'cancellation_reason', 'cancelled_by'])
          is distinct from
          (to_jsonb(old) - array['status', 'cancellation_reason', 'cancelled_by']) then
      raise exception 'Travellers may not change reservation details.';
    end if;
    if new.status = 'cancelled' then
      new.cancelled_by := caller_id;
    end if;
    return new;
  end if;

  if caller_id = old.host_id then
    if new.status is distinct from old.status
       and not (
         (old.status = 'pending' and new.status in ('confirmed', 'rejected', 'cancelled'))
         or (old.status = 'confirmed' and new.status in ('cancelled', 'completed'))
       ) then
      raise exception 'This reservation status transition is not allowed.';
    end if;
    if (new.start_at, new.end_at, new.guests)
       is distinct from (old.start_at, old.end_at, old.guests)
       and (old.status not in ('pending', 'confirmed') or new.status is distinct from old.status) then
      raise exception 'Only an active reservation can be rescheduled.';
    end if;
    if (to_jsonb(new) - array[
          'status', 'cancellation_reason', 'cancelled_by',
          'start_at', 'end_at', 'guests', 'note'
        ]) is distinct from
        (to_jsonb(old) - array[
          'status', 'cancellation_reason', 'cancelled_by',
          'start_at', 'end_at', 'guests', 'note'
        ]) then
      raise exception 'Agencies may not change protected reservation fields.';
    end if;
    if new.status = 'cancelled' then
      new.cancelled_by := caller_id;
    end if;
    return new;
  end if;

  raise exception 'Only a reservation participant may update this reservation.';
end;
$$;

drop trigger if exists reservations_enforce_actor on public.reservations;
create trigger reservations_enforce_actor
  before update on public.reservations
  for each row execute function public.reservations_enforce_actor();

-- Backfill active_range on existing rows (a no-op update fires the trigger) so
-- the exclusion constraint below also protects pre-migration reservations.
update public.reservations set status = status where active_range is null;

-- The hard guarantee: no two active (pending/confirmed) reservations for the
-- same listing may ever overlap — enforced atomically even under concurrency.
alter table public.reservations
  drop constraint if exists reservations_no_active_overlap;
alter table public.reservations
  add constraint reservations_no_active_overlap
  exclude using gist (listing_id with =, active_range with &&)
  where (status in ('pending','confirmed'));

-- ────────────────────────────────────────────────────────────────────────────
-- 7) Automatic immutable audit-log on every status change
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.reservations_log_event()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_type text;
begin
  if tg_op = 'INSERT' then
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type, from_status, to_status)
    values (new.id, auth.uid(), 'system', 'created', null, new.status);
    -- Notify the host of a new request.
    if new.status = 'pending' and new.host_id is not null then
      insert into public.notifications (user_id, type, reservation_id, payload)
      values (new.host_id, 'reservation_requested', new.id,
              jsonb_build_object('reference', new.reference));
    end if;
    return new;
  end if;

  if new.status is distinct from old.status then
    v_type := new.status; -- confirmed | rejected | cancelled | expired | completed
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type, from_status, to_status, reason)
    values (new.id, auth.uid(), 'agency', v_type, old.status, new.status, new.cancellation_reason);
    -- Notify the seeker of the outcome.
    insert into public.notifications (user_id, type, reservation_id, payload)
    values (new.guest_id, 'reservation_' || v_type, new.id,
            jsonb_build_object('reference', new.reference, 'reason', new.cancellation_reason));
  elsif (new.start_at, new.end_at, new.guests) is distinct from (old.start_at, old.end_at, old.guests) then
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type, from_status, to_status, metadata)
    values (new.id, auth.uid(), 'agency', 'modified', old.status, new.status,
            jsonb_build_object(
              'start_at', new.start_at, 'end_at', new.end_at, 'guests', new.guests));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reservations_log_event on public.reservations;
create trigger trg_reservations_log_event
  after insert or update on public.reservations
  for each row execute function public.reservations_log_event();

-- ────────────────────────────────────────────────────────────────────────────
-- 8) Soft-lock expiry (cron + callable). Flips timed-out pending → expired.
-- ────────────────────────────────────────────────────────────────────────────
create or replace function public.expire_stale_reservations()
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
begin
  update public.reservations
     set status = 'expired'
   where status = 'pending'
     and expires_at is not null
     and expires_at < now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Schedule every 15 minutes when pg_cron is available; never block the migration.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule(
      'expire-stale-reservations', '*/15 * * * *',
      $cron$ select public.expire_stale_reservations(); $cron$);
  end if;
exception when others then null;
end $$;

create or replace function public.touch_incident_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_incident on public.reservation_incidents;
create trigger trg_touch_incident
  before update on public.reservation_incidents
  for each row execute function public.touch_incident_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 9) Row-level security
-- ────────────────────────────────────────────────────────────────────────────
alter table public.availability_blocks   enable row level security;
alter table public.reservation_events     enable row level security;
alter table public.reservation_incidents  enable row level security;
alter table public.notifications          enable row level security;

-- Replace the legacy broad participant policies with authenticated policies;
-- the update trigger above limits each participant's permitted changes.
drop policy if exists "Guest can update their own reservation" on public.reservations;
drop policy if exists "Host can manage reservations on their listings" on public.reservations;
drop policy if exists "Guest or host can view a reservation" on public.reservations;
drop policy if exists "Guests can create their own reservations" on public.reservations;
drop policy if exists res_insert on public.reservations;
drop policy if exists res_select on public.reservations;
drop policy if exists res_update_guest on public.reservations;
drop policy if exists res_update_host on public.reservations;
create policy reservations_select_participant on public.reservations
  for select to authenticated
  using (auth.uid() = guest_id or auth.uid() = host_id);
create policy reservations_insert_guest on public.reservations
  for insert to authenticated
  with check (
    auth.uid() = guest_id
    and exists (
      select 1 from public.listings l
      where l.id = reservations.listing_id
        and l.status in ('published', 'active')
        and l.is_demo = false
    )
  );
create policy reservations_update_participant on public.reservations
  for update to authenticated
  using (auth.uid() = guest_id or auth.uid() = host_id)
  with check (auth.uid() = guest_id or auth.uid() = host_id);

-- Manual blocks: hosts manage their own rows. Travellers use the sanitized
-- view below, which intentionally omits internal host ids and block reasons.
drop policy if exists availability_blocks_select on public.availability_blocks;

drop policy if exists availability_blocks_write on public.availability_blocks;
create policy availability_blocks_write on public.availability_blocks
  for all to authenticated
  using (
    host_id = auth.uid()
    and exists (
      select 1 from public.listings l
      where l.id = availability_blocks.listing_id and l.host_id = auth.uid()
    )
  )
  with check (
    host_id = auth.uid()
    and exists (
      select 1 from public.listings l
      where l.id = availability_blocks.listing_id and l.host_id = auth.uid()
    )
  );

-- Travellers need busy dates, not internal host ids or the agency's reason.
-- This owner-executed view exposes only the public listing id and date range.
create or replace view public.public_listing_availability
  with (security_barrier = true) as
select b.listing_id, b.start_date, b.end_date, b.id
  from public.availability_blocks b
  join public.listings l on l.id = b.listing_id
 where l.status in ('published', 'active')
   and l.is_demo = false;
grant select on public.public_listing_availability to anon, authenticated;

-- Timeline: the reservation's host or seeker can read; inserts come from the
-- trigger (security definer context of the writing statement), never the client.
drop policy if exists reservation_events_select on public.reservation_events;
create policy reservation_events_select on public.reservation_events
  for select to authenticated using (
    exists (
      select 1 from public.reservations r
      where r.id = reservation_events.reservation_id
        and (r.host_id = auth.uid() or r.guest_id = auth.uid())
    )
  );

-- Notifications: users only see their own.
drop policy if exists notifications_select on public.notifications;
drop policy if exists "Users read own notifications" on public.notifications;
create policy notifications_select on public.notifications
  for select to authenticated using (user_id = auth.uid());

drop policy if exists notifications_update on public.notifications;
drop policy if exists "Users update own notifications" on public.notifications;
create policy notifications_update on public.notifications
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists notifications_insert on public.notifications;
create policy notifications_insert on public.notifications
  for insert to authenticated with check (user_id = auth.uid());

-- Incidents: the reporting agency creates and monitors its own; Nesty Support
-- (super admin) sees everything and controls the lifecycle (status column).
drop policy if exists reservation_incidents_insert on public.reservation_incidents;
create policy reservation_incidents_insert on public.reservation_incidents
  for insert to authenticated with check (
    reporter_id = auth.uid()
    and exists (
      select 1 from public.reservations r
      where r.id = reservation_incidents.reservation_id
        and r.host_id = auth.uid()
    )
  );

drop policy if exists reservation_incidents_select on public.reservation_incidents;
create policy reservation_incidents_select on public.reservation_incidents
  for select to authenticated using (
    reporter_id = auth.uid()
    or coalesce(public.is_super_admin(), false)
  );

-- Only Support may change an incident (status/resolution). Agencies are read-only
-- once an incident is filed.
drop policy if exists reservation_incidents_update on public.reservation_incidents;
create policy reservation_incidents_update on public.reservation_incidents
  for update to authenticated using (coalesce(public.is_super_admin(), false))
  with check (coalesce(public.is_super_admin(), false));

revoke all on function public.reservations_set_derived() from public, anon, authenticated;
revoke all on function public.reservations_enforce_actor() from public, anon, authenticated;
revoke all on function public.reservations_log_event() from public, anon, authenticated;
revoke all on function public.expire_stale_reservations() from public, anon, authenticated;
grant execute on function public.expire_stale_reservations() to service_role;

-- ────────────────────────────────────────────────────────────────────────────
-- 10) Realtime (optional) — live inbox/timeline updates.
-- ────────────────────────────────────────────────────────────────────────────
do $$
begin
  alter publication supabase_realtime add table public.notifications;
  alter publication supabase_realtime add table public.reservation_events;
exception when others then null;
end $$;
