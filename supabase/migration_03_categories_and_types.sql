-- Run this in the Supabase SQL Editor after migration_02.
--
-- Two changes:
-- 1. Reassigns every product's `category` to the department taxonomy
--    (women-clothing, hair, women-shoes, men-clothing, men-shoes, children,
--    general) round-robin, replacing the template's original demo categories
--    (special-edition, luxury-collection, etc). This is what lets "Our
--    Categories" pull a real representative product per department.
-- 2. Broadens `type` to 7 values (Tops, Dresses, Shorts, Jeans, Sweaters,
--    Shoes, Underwears) instead of the original 4, round-robin as before.
--
-- Replace both with real values once you're using real product data.

with numbered as (
  select id, row_number() over (order by created_at asc) as rn
  from public.products
)
update public.products p
set category = case (numbered.rn % 7)
  when 1 then 'women-clothing'
  when 2 then 'hair'
  when 3 then 'women-shoes'
  when 4 then 'men-clothing'
  when 5 then 'men-shoes'
  when 6 then 'children'
  when 0 then 'general'
end
from numbered
where p.id = numbered.id;

with numbered as (
  select id, row_number() over (order by created_at asc) as rn
  from public.products
)
update public.products p
set type = case (numbered.rn % 7)
  when 1 then 'Tops'
  when 2 then 'Dresses'
  when 3 then 'Shorts'
  when 4 then 'Jeans'
  when 5 then 'Sweaters'
  when 6 then 'Shoes'
  when 0 then 'Underwears'
end
from numbered
where p.id = numbered.id;
