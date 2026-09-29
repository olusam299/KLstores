import { supabase } from "./supabase";

type ProductRow = Omit<Product, "price"> & { price: number | string };

const SELECT_FIELDS =
  "id, title, image, category, price, popularity, stock, featured, type";

const normalize = (row: ProductRow): Product => ({
  ...row,
  price: Number(row.price),
});

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_FIELDS)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(normalize);
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return normalize(data as ProductRow);
};

// For each value in `groups`, picks one random product whose groupBy(product)
// matches it. Used to give "Our Categories" and "Our Collection" a fresh
// representative image each time the home page mounts (refresh, or
// leaving and coming back, since React Router unmounts/remounts the page).
export const pickRandomRepresentatives = (
  products: Product[],
  groupBy: (p: Product) => string | null,
  groups: string[]
): Record<string, Product | null> => {
  const result: Record<string, Product | null> = {};
  for (const group of groups) {
    const matches = products.filter((p) => groupBy(p) === group);
    result[group] = matches.length
      ? matches[Math.floor(Math.random() * matches.length)]
      : null;
  }
  return result;
};

// Used for the home page banner slideshow.
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT_FIELDS)
    .eq("featured", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load featured products:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(normalize);
};
