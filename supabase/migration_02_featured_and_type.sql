-- Run this in the Supabase SQL Editor after schema.sql / seed.sql.
-- Adds two columns to the products table:
--   featured - shown in the home page banner slideshow
--   type     - product type for the "Our Collection" tabs (Tops, Dresses, Shorts, Jeans)

alter table public.products
  add column if not exists featured boolean not null default false;

alter table public.products
  add column if not exists type text;

-- Mark the 5 earliest-added products as featured, for the banner slideshow.
-- Re-run safely any time - it just recomputes the same 5.
update public.products
set featured = true
where id in (
  select id from public.products order by created_at asc limit 5
);

update public.products
set featured = false
where id not in (
  select id from public.products order by created_at asc limit 5
);

-- Assign a type to every product round-robin (Tops, Dresses, Shorts, Jeans)
-- so the Our Collection tabs have something to filter. Replace with real
-- types once you're using real product data.
with numbered as (
  select id, row_number() over (order by created_at asc) as rn
  from public.products
)
update public.products p
set type = case (numbered.rn % 4)
  when 1 then 'Tops'
  when 2 then 'Dresses'
  when 3 then 'Shorts'
  when 0 then 'Jeans'
end
from numbered
where p.id = numbered.id;
