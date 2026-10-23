-- Nesty Sousse demo seed: one EXISTING provisioned agency profile + 31 listings.
--
-- This seed is synthetic. It contains no scraped Airbnb data, real addresses,
-- real agency contact details, reviews, or listing photos. All rows stay in
-- `draft` and are exposed only as non-bookable demo previews. Replace the agency
-- ID below with an existing agency authorized to use the demo data before running.
--
-- Prerequisites:
--   1. Apply the shared schema migrations, including
--      the listing lifecycle and demo preview migrations.
--   2. Provision the agency through Nesty Base and create its auth user.
--   3. Obtain the agency's authorization for demo listings under its account.
  --   4. Set v_agency_id below. Run in a transaction-capable SQL client.
--
-- This does not create an auth user or public.agencies row. The profile is
-- upserted only for the matched active agency's existing auth user. Listing
-- IDs are stable; rerunning the script does not overwrite existing rows.

begin;

do $$
declare
  -- EDIT THIS to an existing, active, authorized public.agencies.id.
  v_agency_id constant uuid := '00000000-0000-4000-8000-000000000000';
  v_host_id uuid;
  v_host_name text;
  v_host_email text;
  v_i integer;
  v_district text;
  v_type text;
  v_price integer;
  v_bedrooms integer;
  v_bathrooms integer;
  v_lat double precision;
  v_lng double precision;
  v_tags text[];
  v_amenities text[];
  v_gallery text[];
begin
  if v_agency_id = '00000000-0000-4000-8000-000000000000'::uuid then
    raise exception 'Edit v_agency_id to the authorized agency ID before running this seed';
  end if;

  if to_regclass('public.agencies') is null then
    raise exception 'public.agencies is missing; apply the Nesty Base agency migration first';
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'listings'
      and column_name = 'pricing'
  ) then
    raise exception 'Listing lifecycle columns are missing; apply the listing_lifecycle migration first';
  end if;

  select a.auth_user_id, a.name, a.email
    into v_host_id, v_host_name, v_host_email
  from public.agencies a
  where a.id = v_agency_id
    and a.status = 'active'
    and a.auth_user_id is not null;

  if v_host_id is null then
    raise exception 'No active provisioned agency with an auth user matches ID %', v_agency_id;
  end if;

  if not exists (select 1 from auth.users u where u.id = v_host_id) then
    raise exception 'Agency auth user % is missing', v_host_id;
  end if;

  insert into public.profiles (id, email, full_name, role)
  values (v_host_id, v_host_email, v_host_name, 'host')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        role = 'host';

  for v_i in 1..31 loop
    v_district := (array[
      'Sousse Corniche', 'Sousse Medina', 'Sahloul', 'Khzema',
      'Hammam Sousse', 'Jawhara', 'Bouhsina'
    ])[((v_i - 1) % 7) + 1];

    v_type := (array[
      'apartment', 'studio', 'villa', 'house', 'room', 'apartment', 'riad'
    ])[((v_i - 1) % 7) + 1];

    v_price := 700 + ((v_i * 83) % 1700);
    v_bedrooms := case when v_type in ('studio', 'room') then 0 else 1 + (v_i % 3) end;
    v_bathrooms := case when v_type = 'room' then 1 else 1 + (v_i % 2) end;

    -- Approximate points around Sousse; every point remains within Tunisia.
    v_lat := 35.80 + ((v_i % 8) * 0.006);
    v_lng := 10.59 + ((v_i % 9) * 0.007);

    v_tags := case v_i % 4
      when 0 then array['cityCenter', 'nearShops', 'family']
      when 1 then array['nearBeach', 'seaView', 'romantic']
      when 2 then array['quietArea', 'remoteWork', 'nearShops']
      else array['beachfront', 'luxury', 'family']
    end;
    v_amenities := case v_i % 4
      when 0 then array['wifi', 'ac', 'kitchen', 'fridge', 'tv']
      when 1 then array['wifi', 'ac', 'balcony', 'pool', 'parking']
      when 2 then array['wifi', 'heating', 'workspace', 'washer', 'elevator']
      else array['wifi', 'hotWater', 'kitchen', 'garden', 'parking']
    end;

    v_gallery := array[
      format('https://placehold.co/1200x800/jpeg?text=NESTY+DEMO+%s+PHOTO+1', v_i),
      format('https://placehold.co/1200x800/jpeg?text=NESTY+DEMO+%s+PHOTO+2', v_i),
      format('https://placehold.co/1200x800/jpeg?text=NESTY+DEMO+%s+PHOTO+3', v_i),
      format('https://placehold.co/1200x800/jpeg?text=NESTY+DEMO+%s+PHOTO+4', v_i),
      format('https://placehold.co/1200x800/jpeg?text=NESTY+DEMO+%s+PHOTO+5', v_i)
    ];

    insert into public.listings (
      id, host_id, title, city, address, price_per_month, currency,
      type, rental_term, audience, bedrooms, bathrooms, area_sqm,
      cover_image, gallery, rooms, amenities, rating, review_count,
      host_name, description, is_superhost, bills_included, flatmates,
      latitude, longitude, status, tags, property_type, max_guests,
      district, contact_phone, house_rules, pricing, booking_conditions,
      wizard_step, is_demo
    ) values (
      ('90000000-0000-4000-8000-' || lpad(v_i::text, 12, '0'))::uuid,
      v_host_id,
      format('DEMO %s home in %s', v_i, v_district),
      'Sousse',
      format('Sample address %s, %s (demo only)', v_i, v_district),
      v_price, 'TND', 'entire_place', 'long_term', array['adults', 'children'],
      v_bedrooms, v_bathrooms, 35 + ((v_i * 7) % 130),
      v_gallery[1], v_gallery, '[]'::jsonb, v_amenities, 0, 0,
      v_host_name,
      format('Synthetic Nesty demo listing %s. Not a real offer; replace with agency-verified details before publication.', v_i),
      false, false, 0, v_lat, v_lng, 'draft', v_tags, v_type,
      greatest(2, v_bedrooms * 2), v_district, '+21600000000',
      '{"pets":false,"smoking":false,"party":false,"instructions":"Demo data; confirm house rules with the agency."}'::jsonb,
      jsonb_build_object(
        'model', 'month', 'amount', v_price, 'minNights', 1,
        'longStayDiscountPct', 0, 'extraFee', 0
      ),
      '{"cancellation":"flexible","paymentMethods":["cash"],"paymentPolicy":"optionalAdvance","advancePct":0}'::jsonb,
      6, true
    ) on conflict (id) do nothing;
  end loop;
end $$;

commit;
