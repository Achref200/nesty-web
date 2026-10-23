-- The mobile availability parser uses the block id; it is safe to expose with
-- the listing id and date range, while host ids and private reasons stay hidden.
create or replace view public.public_listing_availability
  with (security_barrier = true) as
select b.listing_id, b.start_date, b.end_date, b.id
  from public.availability_blocks b
  join public.listings l on l.id = b.listing_id
 where l.status in ('published', 'active')
   and l.is_demo = false;
grant select on public.public_listing_availability to anon, authenticated;
