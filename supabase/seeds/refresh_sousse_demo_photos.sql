-- Assign stock images already used in the Nesty marketing preview to the
-- synthetic Sousse demo listings. These are illustrative, not photos of real
-- homes. Keep rows in draft and is_demo=true; public clients label them and
-- disable booking.

begin;

with photo_pool as (
  select array[
    '1600585154340-be6161a56a0c',
    '1613490493576-7fde63acd811',
    '1580587771525-78b9dba3b914',
    '1600607687939-ce8a6c25118c',
    '1512917774080-9991f1c4c750',
    '1568605114967-8130f3a36994',
    '1600047509807-ba8f99d2cdde',
    '1502672260266-1c1ef2d93688',
    '1570129477492-45c003edd2be',
    '1560448204-e02f11c3d0e2'
  ]::text[] as ids
),
demo_rows as (
  select id, row_number() over (order by id)::integer as seed_index
  from public.listings
  where city = 'Sousse'
    and status = 'draft'
    and is_demo = true
),
updated_gallery as (
  select
    d.id,
    array(
      select format(
        'https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=1200&q=75',
        p.ids[((d.seed_index + photo_no - 2) % cardinality(p.ids)) + 1]
      )
      from generate_series(1, 5) as g(photo_no)
      order by photo_no
    ) as gallery
  from demo_rows d
  cross join photo_pool p
)
update public.listings l
set cover_image = u.gallery[1],
    gallery = u.gallery
from updated_gallery u
where l.id = u.id;

commit;
