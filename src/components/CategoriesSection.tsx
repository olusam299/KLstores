import { useMemo } from "react";
import CategoryItem from "./CategoryItem";
import { pickRandomRepresentatives } from "../lib/products";

const categories = [
  { title: "Women Clothing", link: "women-clothing" },
  { title: "Hair", link: "hair" },
  { title: "Women Shoes", link: "women-shoes" },
  { title: "Men Clothing", link: "men-clothing" },
  { title: "Men Shoes", link: "men-shoes" },
  { title: "Children", link: "children" },
  { title: "General", link: "general" },
];

// If a category has no product yet, fall back to a placeholder rather than
// showing a broken image.
const FALLBACK_IMAGES = [
  "luxury category 1.png",
  "luxury category 2.png",
  "luxury category 3.png",
  "luxury category 4.png",
];

const CategoriesSection = ({ products }: { products: Product[] }) => {
  const representatives = useMemo(
    () =>
      pickRandomRepresentatives(
        products,
        (p) => p.category,
        categories.map((c) => c.link)
      ),
    [products]
  );

  return (
    <div className="max-w-screen-2xl px-5 mx-auto mt-24">
      <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl mb-12">
        Our Categories
      </h2>
      <div className="flex justify-between flex-wrap gap-y-10">
        {categories.map((category, i) => (
          <CategoryItem
            key={category.link}
            categoryTitle={category.title}
            image={
              representatives[category.link]?.image ??
              FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
            }
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
};
export default CategoriesSection;
