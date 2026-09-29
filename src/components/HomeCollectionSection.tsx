import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
import ProductGridWrapper from "./ProductGridWrapper";
import CollectionTypeFrame from "./CollectionTypeFrame";
import { pickRandomRepresentatives } from "../lib/products";

const TYPES = ["All", "Tops", "Dresses", "Shorts", "Jeans", "Sweaters", "Shoes", "Underwears"];

const HomeCollectionSection = ({ products }: { products: Product[] }) => {
  const [activeType, setActiveType] = useState("All");

  const representatives = useMemo(() => {
    const byType = pickRandomRepresentatives(
      products,
      (p) => p.type,
      TYPES.filter((t) => t !== "All")
    );
    // "All" doesn't correspond to a single type, so just pick any product.
    const allPick = products.length
      ? products[Math.floor(Math.random() * products.length)]
      : null;
    return { ...byType, All: allPick } as Record<string, Product | null>;
  }, [products]);

  return (
    <div>
      <div className="max-w-screen-2xl flex items-center justify-between mx-auto mt-24 px-5 max-[400px]:px-3">
        <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl">
          Our Collection
        </h2>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-8 px-5 max-[400px]:px-3 flex gap-4 overflow-x-auto pb-2">
        {TYPES.map((type) => (
          <CollectionTypeFrame
            key={type}
            label={type}
            image={representatives[type]?.image ?? null}
            active={activeType === type}
            onClick={() => setActiveType(type)}
          />
        ))}
      </div>

      <ProductGridWrapper limit={6} type={activeType}>
        <ProductGrid />
      </ProductGridWrapper>
    </div>
  );
};
export default HomeCollectionSection;
