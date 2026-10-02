import { supabase } from "./supabase";

export type OrderRow = {
  id: string;
  status: string;
  payment_method: string;
  total: number;
  shipping_address: string | null;
  shipping_phone: string | null;
  paystack_reference: string | null;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
};

export const getOrders = async (userId: string): Promise<OrderRow[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, payment_method, total, shipping_address, shipping_phone, paystack_reference, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load orders:", error.message);
    return [];
  }
  return data as OrderRow[];
};

export const getOrder = async (
  orderId: string
): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> => {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, status, payment_method, total, shipping_address, shipping_phone, paystack_reference, created_at"
    )
    .eq("id", orderId)
    .maybeSingle();

  // RLS means this comes back null both for "doesn't exist" and
  // "exists but isn't yours" - either way there's nothing to show.
  if (orderError || !order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id, title, price, quantity")
    .eq("order_id", orderId);

  if (itemsError) return null;

  return { order: order as OrderRow, items: (items ?? []) as OrderItemRow[] };
};
