-- Run in the Supabase SQL Editor. Run each numbered block SEPARATELY
-- (one at a time) to avoid lock collisions.

-- ═══ BLOCK 1: tax switch ═══════════════════════════════════════════════
alter table public.site_settings
  add column if not exists tax_enabled boolean not null default true;

-- ═══ BLOCK 2: admin check helper ═══════════════════════════════════════
-- security definer so policies on profiles can use it without recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- ═══ BLOCK 3: admins can read all orders, items and profiles ═══════════
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Admins can view all order items" on public.order_items;
create policy "Admins can view all order items"
  on public.order_items for select
  using (public.is_admin());

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

-- ═══ BLOCK 4: admin changes order status (cancel restores stock) ═══════
create or replace function public.admin_set_order_status(p_order uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old text;
begin
  if not public.is_admin() then
    raise exception 'Not allowed';
  end if;
  if p_status not in ('pending', 'paid', 'fulfilled', 'cancelled') then
    raise exception 'Invalid status';
  end if;

  select status into v_old from orders where id = p_order for update;
  if v_old is null then
    raise exception 'Order not found';
  end if;
  if v_old = 'cancelled' then
    raise exception 'Cancelled orders cannot be changed';
  end if;

  if p_status = 'cancelled' then
    update products p
    set stock = p.stock + oi.qty
    from (
      select product_id, sum(quantity)::int as qty
      from order_items where order_id = p_order group by product_id
    ) oi
    where p.id = oi.product_id;
  end if;

  update orders set status = p_status where id = p_order;
end;
$$;

revoke all on function public.admin_set_order_status(uuid, text) from public, anon;
grant execute on function public.admin_set_order_status(uuid, text) to authenticated;

-- ═══ BLOCK 5: place_order with 7.5% tax (admin-switchable), no shipping ═
create or replace function public.place_order(
  p_payment_method text,
  p_shipping_address text,
  p_shipping_phone text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_order uuid;
  v_item jsonb;
  v_qty int;
  v_product record;
  v_subtotal numeric := 0;
  v_tax_enabled boolean;
begin
  if v_user is null then
    raise exception 'Please log in first';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty';
  end if;

  insert into orders (user_id, status, payment_method, total, shipping_address, shipping_phone)
  values (v_user, 'pending', p_payment_method, 0, p_shipping_address, p_shipping_phone)
  returning id into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::int;
    if v_qty is null or v_qty < 1 then
      raise exception 'Invalid quantity';
    end if;

    update products
    set stock = stock - v_qty
    where id = (v_item ->> 'product_id')::uuid and stock >= v_qty
    returning id, title, price into v_product;

    if not found then
      raise exception 'Not enough stock for one of the items in your cart';
    end if;

    insert into order_items (order_id, product_id, title, price, quantity)
    values (v_order, v_product.id, v_product.title, v_product.price, v_qty);

    v_subtotal := v_subtotal + v_product.price * v_qty;
  end loop;

  select coalesce(tax_enabled, true) into v_tax_enabled from site_settings where id = 1;

  -- Shipping is agreed privately with the buyer and is NOT in the total.
  update orders
  set total = v_subtotal + case when coalesce(v_tax_enabled, true) then round(v_subtotal * 0.075, 2) else 0 end
  where id = v_order;

  return v_order;
end;
$$;

revoke all on function public.place_order(text, text, text, jsonb) from public, anon;
grant execute on function public.place_order(text, text, text, jsonb) to authenticated;
