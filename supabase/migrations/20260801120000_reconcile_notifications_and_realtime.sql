-- ============================================================================
-- Reconcile `public.notifications` between the mobile app and the dashboard,
-- and put the reservation tables on the realtime publication.
-- ----------------------------------------------------------------------------
-- WHY THIS EXISTS
--
-- Two repos migrated the same table and neither knew about the other:
--
--   * nesty (mobile)  20260716240000_notifications.sql  created it first, with
--     `title text not null`, `body`, `read boolean`, `listing_id`.
--   * nesty-web       20260723120000_reservation_module.sql  then declared it
--     with `create table if not exists` — a NO-OP, because the table already
--     existed. So `payload` and `read_at` were never added.
--
-- The reservation module's `reservations_log_event()` trigger inserts
-- (user_id, type, reservation_id, payload) and never sets `title`. Against the
-- table as it actually exists that fails twice over: `payload` does not exist,
-- and `title` is NOT NULL with no default. Because the trigger is AFTER INSERT
-- OR UPDATE ... FOR EACH ROW on `reservations`, the exception propagates and
-- rolls back the whole statement — every booking request and every accept /
-- decline dies with it.
--
-- On top of that, mobile installed its own two notification triggers on the
-- same table, so once the column problem is fixed each event would notify
-- twice.
--
-- This migration makes the table a superset both apps can read, consolidates
-- onto ONE trigger that populates both shapes, and keeps `read` and `read_at`
-- agreeing with each other.
--
-- Additive and idempotent — safe to re-run.
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1) Widen the table so both readers are satisfied
-- ────────────────────────────────────────────────────────────────────────────
alter table public.notifications
  add column if not exists payload    jsonb not null default '{}'::jsonb,
  add column if not exists read_at    timestamptz,
  add column if not exists body       text,
  add column if not exists listing_id uuid references public.listings (id) on delete set null;

-- `read` is what the mobile app filters on; keep it even if this DB started
-- from the web side instead.
alter table public.notifications
  add column if not exists read boolean not null default false;

-- The dashboard's trigger legitimately has no title to give, so the column
-- can't stay mandatory. Existing rows keep theirs.
alter table public.notifications alter column title drop not null;

-- ────────────────────────────────────────────────────────────────────────────
-- 2) Keep `read` and `read_at` in step
-- ────────────────────────────────────────────────────────────────────────────
-- Mobile writes `read = true`; the dashboard writes `read_at = now()`. Whichever
-- one a client sets, the other follows, so neither app sees a stale unread badge.
create or replace function public.notifications_sync_read()
returns trigger language plpgsql as $$
begin
  if new.read and new.read_at is null then
    new.read_at := now();
  elsif new.read_at is not null and not new.read then
    new.read := true;
  elsif not new.read and new.read_at is not null
        and (tg_op = 'UPDATE' and old.read) then
    -- Explicitly marked unread again.
    new.read_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_notifications_sync_read on public.notifications;
create trigger trg_notifications_sync_read
  before insert or update on public.notifications
  for each row execute function public.notifications_sync_read();

-- Backfill both directions for rows written before this ran.
update public.notifications set read_at = created_at
 where read and read_at is null;
update public.notifications set read = true
 where read_at is not null and not read;

-- ────────────────────────────────────────────────────────────────────────────
-- 3) One trigger, both shapes
-- ────────────────────────────────────────────────────────────────────────────
-- Replaces the reservation module's version. Same events and same audit rows,
-- but every notification now carries a human title/body (what mobile renders)
-- alongside the structured payload (what the dashboard renders).
create or replace function public.reservations_log_event()
returns trigger language plpgsql as $$
declare
  v_type    text;
  v_listing text;
begin
  select title into v_listing from public.listings where id = new.listing_id;
  v_listing := coalesce(v_listing, 'your place');

  if tg_op = 'INSERT' then
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type, from_status, to_status)
    values (new.id, auth.uid(), 'system', 'created', null, new.status);

    if new.status = 'pending' and new.host_id is not null then
      insert into public.notifications
        (user_id, type, title, body, listing_id, reservation_id, payload)
      values (
        new.host_id,
        'reservation_requested',
        'New booking request',
        coalesce(new.guest_name, 'A traveller') || ' requested ' || v_listing,
        new.listing_id,
        new.id,
        jsonb_build_object('reference', new.reference)
      );
    end if;
    return new;
  end if;

  if new.status is distinct from old.status then
    v_type := new.status;
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type,
       from_status, to_status, reason)
    values (new.id, auth.uid(), 'agency', v_type, old.status, new.status,
            new.cancellation_reason);

    insert into public.notifications
      (user_id, type, title, body, listing_id, reservation_id, payload)
    values (
      new.guest_id,
      'reservation_' || v_type,
      case new.status
        when 'confirmed' then 'Booking confirmed'
        when 'rejected'  then 'Booking declined'
        when 'cancelled' then 'Booking cancelled'
        when 'expired'   then 'Request expired'
        when 'completed' then 'Stay completed'
        else 'Booking updated'
      end,
      v_listing
        || case
             when new.cancellation_reason is not null
               then ' — ' || new.cancellation_reason
             else ''
           end,
      new.listing_id,
      new.id,
      jsonb_build_object(
        'reference', new.reference,
        'reason', new.cancellation_reason)
    );
  elsif (new.start_at, new.end_at, new.guests)
        is distinct from (old.start_at, old.end_at, old.guests) then
    insert into public.reservation_events
      (reservation_id, actor_id, actor_role, event_type,
       from_status, to_status, metadata)
    values (new.id, auth.uid(), 'agency', 'modified', old.status, new.status,
            jsonb_build_object(
              'start_at', new.start_at, 'end_at', new.end_at,
              'guests', new.guests));
  end if;
  return new;
end;
$$;

-- Retire mobile's pair — the function above now covers both of their cases.
-- Dropping the triggers (not the functions) keeps this reversible.
drop trigger if exists trg_notify_host_new_reservation    on public.reservations;
drop trigger if exists trg_notify_guest_reservation_status on public.reservations;

-- ────────────────────────────────────────────────────────────────────────────
-- 4) Realtime
-- ────────────────────────────────────────────────────────────────────────────
-- `notifications` and `reservation_events` were already published. Adding the
-- rows the dashboard actually renders means an accept on one device repaints
-- the other without a refresh. Wrapped individually so a table that is already
-- published doesn't abort the rest.
do $$
declare
  t text;
begin
  foreach t in array array['reservations', 'availability_blocks',
                           'reservation_incidents', 'listings']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when others then
      null; -- already published, or the publication doesn't exist locally
    end;
  end loop;
end $$;

-- Realtime only delivers the changed columns unless the row is fully replicated.
-- The dashboard re-queries on any event, but the seeker's phone patches its list
-- in place, so it needs the whole row.
alter table public.reservations replica identity full;
