import { supabase } from "./supabase";

export type NewProductInput = {
  title: string;
  price: number;
  category: string;
  type: string;
  stock: number;
  featured: boolean;
  imageFile: File;
};

// Uploads to the product-images bucket and returns its public URL. RLS on
// storage.objects only allows this for admins (see migration_05_admin.sql).
export const uploadProductImage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
};

export const createProduct = async (input: NewProductInput) => {
  const image = await uploadProductImage(input.imageFile);

  const { error } = await supabase.from("products").insert({
    title: input.title,
    price: input.price,
    category: input.category,
    type: input.type,
    stock: input.stock,
    featured: input.featured,
    image,
    popularity: 0,
  });

  if (error) throw error;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

export const updateProductStock = async (id: string, stock: number) => {
  const { error } = await supabase
    .from("products")
    .update({ stock })
    .eq("id", id);
  if (error) throw error;
};
