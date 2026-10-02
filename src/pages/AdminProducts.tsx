import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { getProducts } from "../lib/products";
import { createProduct, deleteProduct, updateProductStock } from "../lib/admin";

const CATEGORIES = [
  "women-clothing",
  "women-shoes",
  "men-clothing",
  "men-shoes",
  "hair",
  "children",
  "general",
];

const TYPES = ["Tops", "Dresses", "Shorts", "Jeans", "Sweaters", "Shoes", "Underwears"];

const inputClass =
  "block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border shadow-sm sm:text-sm";

type Access = "checking" | "denied" | "allowed";

const AdminProducts = () => {
  const navigate = useNavigate();
  const [access, setAccess] = useState<Access>("checking");
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const refreshProducts = async () => setProducts(await getProducts());

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Please login to view this page");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        setAccess("denied");
        return;
      }

      setAccess("allowed");
      refreshProducts();
    };
    check();
  }, [navigate]);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setStock("");
    setFeatured(false);
    setImageFile(null);
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (!title.trim() || !imageFile || !Number.isFinite(parsedPrice) || !Number.isFinite(parsedStock)) {
      toast.error("Please fill in every field, including a photo");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct({
        title: title.trim(),
        price: parsedPrice,
        category,
        type,
        stock: parsedStock,
        featured,
        imageFile,
      });
      toast.success("Product added");
      resetForm();
      await refreshProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again";
      toast.error(`Couldn't add product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, productTitle: string) => {
    if (!confirm(`Delete "${productTitle}"? This can't be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again";
      toast.error(`Couldn't delete: ${message}`);
    }
  };

  const handleStockChange = async (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
    try {
      await updateProductStock(id, newStock);
    } catch {
      toast.error("Couldn't update stock");
      refreshProducts();
    }
  };

  if (access === "checking") {
    return <div className="max-w-screen-2xl mx-auto pt-20 px-5">Loading...</div>;
  }

  if (access === "denied") {
    return (
      <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <p>You don't have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5 pb-24 max-[400px]:px-3">
      <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

      <form
        onSubmit={handleAddProduct}
        className="bg-white border border-gray-200 p-5 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
      >
        <h2 className="sm:col-span-2 text-lg font-medium">Add a product</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            min="0"
            className={inputClass}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Show in home page banner (featured)
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="sm:col-span-2 text-white bg-brand text-center text-lg font-normal h-12 flex items-center justify-center disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add product"}
        </button>
      </form>

      <h2 className="text-lg font-medium mb-4">
        Current products ({products.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b">Image</th>
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Category</th>
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Price</th>
              <th className="py-3 px-4 border-b">Stock</th>
              <th className="py-3 px-4 border-b">Featured</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-2 px-4 border-b">
                  <img src={product.image} alt={product.title} className="w-12 h-12 object-cover" />
                </td>
                <td className="py-2 px-4 border-b">{product.title}</td>
                <td className="py-2 px-4 border-b">{product.category}</td>
                <td className="py-2 px-4 border-b">{product.type}</td>
                <td className="py-2 px-4 border-b">${product.price}</td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    min="0"
                    className="w-16 h-8 indent-1 border border-gray-300"
                    value={product.stock}
                    onChange={(e) =>
                      handleStockChange(product.id, Number(e.target.value) || 0)
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.featured ? "Yes" : ""}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleDelete(product.id, product.title)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
