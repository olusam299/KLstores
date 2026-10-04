import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Must match the checkout maths in src/pages/Checkout.tsx:
// total = subtotal + shipping + subtotal / 5
const SHIPPING = 5;
const TAX_RATE = 0.2;

export const adminClient = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

export type FinalizeResult =
  | { ok: true; status: "paid" }
  | { ok: false; error: string; code: number };

// Verifies a Paystack transaction against the order it belongs to and marks
// the order paid. Safe to call more than once (client + webhook both do).
export const finalizeOrder = async (
  reference: string,
  onlyForUserId?: string
): Promise<FinalizeResult> => {
  const admin = adminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, status")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (!order) return { ok: false, error: "Order not found", code: 404 };
  if (onlyForUserId && order.user_id !== onlyForUserId) {
    return { ok: false, error: "Order not found", code: 404 };
  }
  if (order.status === "paid" || order.status === "fulfilled") {
    return { ok: true, status: "paid" };
  }

  // Expected amount comes from the database, never from the browser.
  const { data: items } = await admin
    .from("order_items")
    .select("price, quantity")
    .eq("order_id", order.id);

  if (!items || items.length === 0) {
    return { ok: false, error: "Order has no items", code: 400 };
  }
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const expected = subtotal + SHIPPING + subtotal * TAX_RATE;
  const expectedKobo = Math.round(expected * 100);

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${Deno.env.get("PAYSTACK_SECRET_KEY")}` } }
  );
  const body = await res.json().catch(() => null);
  const tx = body?.data;

  if (!res.ok || !body?.status || tx?.status !== "success") {
    return { ok: false, error: "Payment not successful", code: 402 };
  }
  if (tx.currency !== "NGN" || tx.amount < expectedKobo) {
    return { ok: false, error: "Amount paid doesn't match the order", code: 402 };
  }

  const { error } = await admin
    .from("orders")
    .update({ status: "paid", total: expected })
    .eq("id", order.id)
    .eq("status", "pending");

  if (error) return { ok: false, error: "Could not update order", code: 500 };
  return { ok: true, status: "paid" };
};
