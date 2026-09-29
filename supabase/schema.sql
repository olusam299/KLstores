-- Fashion Store — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query)

-- ─────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text not null,
  category text not null,
  price numeric(10, 2) not null,
  popularity int not null default 0,
  stock int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone (even logged-out visitors) can browse products
create policy "Public can read products"
  on public.products for select
  using (true);

-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase's built-in auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending', -- pending | paid | contacted | fulfilled
  payment_method text not null,           -- 'paystack' | 'whatsapp'
  total numeric(10, 2) not null,
  shipping_address text,
  shipping_phone text,
  paystack_reference text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id),
  title text not null,   -- snapshot at time of order
  price numeric(10, 2) not null,
  quantity int not null
);

alter table public.order_items enable row level security;

create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create their own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
