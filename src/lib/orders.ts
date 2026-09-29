import { supabase } from "./supabase";

export type CreateOrderInput = {
  userId: string;
  paymentMethod: "paystack" | "whatsapp";
  status: string;
  total: number;
  shippingAddress: string;
  shippingPhone: string;
  paystackReference?: string;
  items: ProductInCart[];
};

export const createOrder = async ({
  userId,
  paymentMethod,
  status,
  total,
  shippingAddress,
  shippingPhone,
  paystackReference,
  items,
}: CreateOrderInput) => {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status,
      payment_method: paymentMethod,
      total,
      shipping_address: shippingAddress,
      shipping_phone: shippingPhone,
      paystack_reference: paystackReference ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw orderError ?? new Error("Failed to create order");
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsError) {
    throw itemsError;
  }

  return order;
};
