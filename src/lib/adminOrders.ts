import { supabase } from "./supabase";

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type AdminOrder = {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_method: string;
  total: number;
  shipping_address: string | null;
  shipping_phone: string | null;
  created_at: string;
  customerName: string;
  items: { title: string; price: number; quantity: number }[];
};

// Admin-only: RLS (migration_09) lets admins read every order, item and profile.
export const getAllOrders = async (): Promise<AdminOrder[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, payment_method, total, shipping_address, shipping_phone, created_at, order_items(title, price, quantity)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  const userIds = [...new Set((data ?? []).map((o) => o.user_id as string))];
  const names: Record<string, string> = {};
  if (userIds.length) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);
    for (const p of profiles ?? []) {
      names[p.id as string] = (p.full_name as string) || "";
    }
  }

  return (data ?? []).map((o) => ({
    id: o.id as string,
    user_id: o.user_id as string,
    status: o.status as OrderStatus,
    payment_method: o.payment_method as string,
    total: Number(o.total),
    shipping_address: o.shipping_address as string | null,
    shipping_phone: o.shipping_phone as string | null,
    created_at: o.created_at as string,
    customerName: names[o.user_id as string] || "Unknown customer",
    items: ((o.order_items as { title: string; price: number | string; quantity: number }[]) ?? []).map(
      (i) => ({ title: i.title, price: Number(i.price), quantity: i.quantity })
    ),
  }));
};

export const setOrderStatus = async (id: string, status: OrderStatus) => {
  const { error } = await supabase.rpc("admin_set_order_status", {
    p_order: id,
    p_status: status,
  });
  if (error) throw new Error(error.message);
};
