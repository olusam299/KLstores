-- Run this in the Supabase SQL Editor.
--
-- Adds an is_admin flag, and the write permissions an admin needs:
-- inserting/updating/deleting products, and uploading/deleting images in
-- the product-images Storage bucket. Until now only reading products was
-- allowed (see schema.sql) - regular customers still can't write anything.

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- ── Make yourself an admin ──────────────────────────────────────────────
-- Register your account in the app first (if you haven't), then run this
-- with your own email:
--
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'your-email@example.com');

-- ── Products: admin-only writes ─────────────────────────────────────────
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ── Storage: product-images bucket ──────────────────────────────────────
-- Create the "product-images" bucket in the Storage UI first (Public ON)
-- if you haven't already, then run this.

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
