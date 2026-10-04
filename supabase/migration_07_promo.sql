-- Run this in the Supabase SQL Editor after migration_06.
-- Adds the "Promo of the day" hero section controls.

alter table public.products
  add column if not exists promo boolean not null default false;

-- Optional display name shown in the promo hero (falls back to the title).
alter table public.products
  add column if not exists promo_name text;

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  promo_enabled boolean not null default false,
  promo_discount int not null default 20 check (promo_discount between 1 and 90)
);

insert into public.site_settings (id) values (1) on conflict do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
