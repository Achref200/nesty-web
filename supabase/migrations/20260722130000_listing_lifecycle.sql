-- ============================================================================
-- Nesty listings: full host-listing lifecycle + wizard fields
-- ----------------------------------------------------------------------------
-- Widens listings.status from the legacy ('active','hidden') pair to the full
-- lifecycle used by the Host Listing Management wizard, and adds the fields the
-- 6-step wizard collects (property type, capacity, house rules, pricing model,
-- booking conditions, resume step). All changes are ADDITIVE and backward
-- compatible so the mobile app keeps reading existing columns.
--
-- Apply once to the shared Nesty Supabase project (SQL editor or `supabase db`).
-- Safe to re-run (idempotent).
-- ============================================================================

-- 1) Lifecycle status --------------------------------------------------------
-- The column is currently a text/enum limited to 'active'|'hidden'. Convert it
-- to a plain text column with a CHECK covering both the new lifecycle and the
-- legacy values (so pre-migration rows stay valid), then backfill.

do $$
begin
  -- Drop an old enum-style constraint if one exists (name may vary).
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings' and column_name = 'status'
  ) then
    alter table public.listings alter column status type text using status::text;
  else
    alter table public.listings add column status text not null default 'draft';
  end if;
end $$;

alter table public.listings alter column status set default 'draft';

-- Backfill legacy values to lifecycle vocabulary.
update public.listings set status = 'published' where status = 'active';
update public.listings set status = 'disabled'  where status = 'hidden';

-- Re-assert the allowed set (keep legacy values accepted for safety).
alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings
  add constraint listings_status_check check (
    status in (
      'draft','completed','submitted','pending_moderation',
      'published','disabled','deleted',
      'active','hidden'
    )
  );

-- 2) Wizard fields (additive) ------------------------------------------------
alter table public.listings
  add column if not exists property_type      text,
  add column if not exists max_guests         integer not null default 1,
  add column if not exists district           text,
  add column if not exists contact_phone      text,
  add column if not exists house_rules        jsonb   not null default '{}'::jsonb,
  add column if not exists pricing            jsonb   not null default '{}'::jsonb,
  add column if not exists booking_conditions jsonb   not null default '{}'::jsonb,
  add column if not exists wizard_step        integer not null default 0;

-- `amenities text[]` already exists on the table; the wizard starts using it.

-- 3) Helpful index for dashboard filtering by status -------------------------
create index if not exists listings_host_status_idx
  on public.listings (host_id, status);
