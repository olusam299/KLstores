import { supabase } from "./supabase";

const DEFAULTS: PromoSettings = { promo_enabled: false, promo_discount: 20 };

export const getPromoSettings = async (): Promise<PromoSettings> => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("promo_enabled, promo_discount")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEFAULTS;
  return data as PromoSettings;
};

export const getPromoProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, image, category, price, popularity, stock, featured, type, promo, promo_name"
    )
    .eq("promo", true)
    .order("created_at", { ascending: true });

  if (error) return [];
  return (data as Product[]).map((p) => ({ ...p, price: Number(p.price) }));
};

export const updatePromoSettings = async (settings: PromoSettings) => {
  const { error } = await supabase
    .from("site_settings")
    .update(settings)
    .eq("id", 1);
  if (error) throw error;
};

export const updateProductPromo = async (
  id: string,
  promo: boolean,
  promoName: string | null
) => {
  const { error } = await supabase
    .from("products")
    .update({ promo, promo_name: promoName })
    .eq("id", id);
  if (error) throw error;
};
