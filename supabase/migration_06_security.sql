-- Run this in the Supabase SQL Editor. Fixes two security holes:
--
-- 1. Any logged-in user could set is_admin = true on their own profile row.
--    Now users can only update full_name, phone and address.
-- 2. Any logged-in user could insert an order with status 'paid' and any
--    price. Now orders can only be inserted as 'pending', item prices are
--    copied from the products table by a trigger, and only the
--    paystack-verify / paystack-webhook functions (service role) can mark
--    an order paid.

-- ── 1. Lock down profiles ───────────────────────────────────────────────
revoke update on public.profiles from authenticated, anon;
grant update (full_name, phone, address) on public.profiles to authenticated;

-- ── 2. Orders: pending only, unique Paystack reference ──────────────────
drop policy if exists "Users can create their own orders" on public.orders;
create policy "Users can create their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id and status = 'pending');

create unique index if not exists orders_paystack_reference_key
  on public.orders (paystack_reference)
  where paystack_reference is not null;

-- ── 3. Order items: price and title always come from products ───────────
create or replace function public.set_order_item_price()
returns trigger as $$
begin
  select p.title, p.price into new.title, new.price
  from public.products p
  where p.id = new.product_id;

  if new.price is null then
    raise exception 'Unknown product %', new.product_id;
  end if;
  if new.quantity is null or new.quantity < 1 then
    raise exception 'Invalid quantity';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists order_items_set_price on public.order_items;
create trigger order_items_set_price
  before insert on public.order_items
  for each row execute procedure public.set_order_item_price();

-- ── Check after running ─────────────────────────────────────────────────
-- Make sure your own account is still admin:
--   select id, is_admin from public.profiles
--   where id = (select id from auth.users where email = 'your-email@example.com');
