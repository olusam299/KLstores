-- Run this in the Supabase SQL Editor.
--
-- Up to now, the `image` column stored just a filename (e.g. "product image
-- 1.jpg"), and the app code added "/assets/" in front of it when rendering.
-- Going forward, `image` stores the full, ready-to-use URL instead - either
-- a Supabase Storage URL for real products, or a local "/assets/..." path
-- for the placeholder demo ones. This lets both kinds of products render
-- through the exact same <img src={image} /> everywhere in the app.
--
-- This one-time update prefixes your existing demo rows so they keep
-- working under the new convention. Safe to re-run - it skips rows that
-- already start with "/assets/" or "http".

update public.products
set image = '/assets/' || image
where image not like '/assets/%'
  and image not like 'http%';
