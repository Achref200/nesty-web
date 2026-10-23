-- Mark the existing Sousse seed inventory as demo content so it can be shown
-- as a public, non-bookable preview without treating it as verified supply.

alter table public.listings
  add column if not exists is_demo boolean not null default false;

update public.listings
set is_demo = true
where id::text like '90000000-0000-4000-8000-%'
  and title like 'DEMO %'
  and description like 'Synthetic Nesty demo listing %'
  and status = 'draft';
