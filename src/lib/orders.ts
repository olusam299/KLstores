import { supabase } from "./supabase";

export type CreateOrderInput = {
  paymentMethod: "whatsapp";
  shippingAddress: string;
  shippingPhone: string;
  items: ProductInCart[];
};

// Goes through the place_order database function (migration_08), which
// checks stock, prices the items from the products table, reduces stock and
// saves everything in one step. Throws with a readable message if an item
// is out of stock.
export const createOrder = async ({
  paymentMethod,
  shippingAddress,
  shippingPhone,
  items,
}: CreateOrderInput): Promise<string> => {
  const { data, error } = await supabase.rpc("place_order", {
    p_payment_method: paymentMethod,
    p_shipping_address: shippingAddress,
    p_shipping_phone: shippingPhone,
    p_items: items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    })),
  });

  if (error) throw new Error(error.message);
  return data as string;
};
