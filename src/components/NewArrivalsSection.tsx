import { useMemo } from "react";
import ProductGrid from "./ProductGrid";

const NEW_ARRIVALS_COUNT = 9;

// Newest products first (the list arrives oldest-first from getProducts).
const NewArrivalsSection = ({ products }: { products: Product[] }) => {
  const newest = useMemo(
    () => [...products].reverse().slice(0, NEW_ARRIVALS_COUNT),
    [products]
  );

  if (newest.length === 0) return null;

  return (
    <div>
      <div className="max-w-screen-2xl mx-auto mt-24 px-5 max-[400px]:px-3">
        <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl">
          New Arrivals
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-sm:text-base">
          Check out our new additions to your favourite store.
        </p>
      </div>
      <ProductGrid products={newest} />
    </div>
  );
};
export default NewArrivalsSection;
