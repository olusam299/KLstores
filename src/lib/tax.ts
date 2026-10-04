import { supabase } from "./supabase";

// Must match place_order() in supabase/migration_09 (7.5% = 0.075).
export const TAX_RATE = 0.075;

export const computeTax = (subtotal: number, taxEnabled: boolean) =>
  taxEnabled ? Math.round(subtotal * TAX_RATE * 100) / 100 : 0;

export const getTaxEnabled = async (): Promise<boolean> => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("tax_enabled")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return true;
  return data.tax_enabled as boolean;
};

export const setTaxEnabled = async (enabled: boolean) => {
  const { error } = await supabase
    .from("site_settings")
    .update({ tax_enabled: enabled })
    .eq("id", 1);
  if (error) throw error;
};
