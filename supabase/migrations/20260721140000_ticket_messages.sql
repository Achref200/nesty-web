-- ============================================================================
-- Nesty support tickets: conversation + screenshot attachments
-- ----------------------------------------------------------------------------
-- Builds on 20260721120000_super_admin.sql (which created support_tickets,
-- super_admins, is_super_admin() and activity_events). Turns the single-message
-- ticket into a two-way thread between the reporting agency and the Nesty admin,
-- and lets both sides attach screenshots.
--
-- Apply once to the shared Nesty Supabase project (SQL editor or `supabase db`).
-- Safe to re-run (idempotent).
-- ============================================================================

-- 1) Screenshots on the opening report -------------------------------------
alter table public.support_tickets
  add column if not exists attachments text[] not null default '{}';

-- 2) Conversation messages --------------------------------------------------
create table if not exists public.ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_tickets (id) on delete cascade,
  author_id   uuid not null references auth.users (id),
  author_role text not null default 'agency', -- 'agency' | 'admin'
  body        text not null,
  attachments text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists ticket_messages_ticket_idx
  on public.ticket_messages (ticket_id, created_at);

-- Keep the parent ticket's updated_at fresh whenever a reply lands, so both
-- inboxes sort by "last activity".
create or replace function public.touch_ticket_on_message()
returns trigger language plpgsql as $$
begin
  update public.support_tickets
     set updated_at = now()
   where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists trg_touch_ticket_on_message on public.ticket_messages;
create trigger trg_touch_ticket_on_message
  after insert on public.ticket_messages
  for each row execute function public.touch_ticket_on_message();

-- 3) Row-level security -----------------------------------------------------
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- Agencies create and read their own tickets; admins already have full access
-- from the super_admin migration (these policies are additive / OR-ed).
drop policy if exists support_tickets_insert_own on public.support_tickets;
create policy support_tickets_insert_own on public.support_tickets
  for insert with check (reporter_id = auth.uid());

drop policy if exists support_tickets_select_own on public.support_tickets;
create policy support_tickets_select_own on public.support_tickets
  for select using (reporter_id = auth.uid() or public.is_super_admin());

-- Thread visibility: the reporter or any admin can read a ticket's messages.
drop policy if exists ticket_messages_select on public.ticket_messages;
create policy ticket_messages_select on public.ticket_messages
  for select using (
    public.is_super_admin()
    or exists (
      select 1 from public.support_tickets t
      where t.id = ticket_messages.ticket_id
        and t.reporter_id = auth.uid()
    )
  );

-- Posting: reporter or admin, and you can only post as yourself.
drop policy if exists ticket_messages_insert on public.ticket_messages;
create policy ticket_messages_insert on public.ticket_messages
  for insert with check (
    author_id = auth.uid()
    and (
      public.is_super_admin()
      or exists (
        select 1 from public.support_tickets t
        where t.id = ticket_messages.ticket_id
          and t.reporter_id = auth.uid()
      )
    )
  );

-- 4) Realtime (optional) ----------------------------------------------------
-- Lets both consoles live-update a thread. Never let this optional step block
-- the migration (publication may be absent / table already added).
do $$
begin
  alter publication supabase_realtime add table public.ticket_messages;
exception when others then null;
end $$;
