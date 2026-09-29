import { Link } from "react-router-dom";

const chipClass =
  "px-4 py-2 border border-black/20 text-sm tracking-wide hover:bg-brand hover:text-white hover:border-brand transition-colors whitespace-nowrap";

const categories = [
  { label: "Women Clothing", slug: "women-clothing" },
  { label: "Hair", slug: "hair" },
  { label: "Women Shoes", slug: "women-shoes" },
  { label: "Men Clothing", slug: "men-clothing" },
  { label: "Men Shoes", slug: "men-shoes" },
  { label: "Children", slug: "children" },
  { label: "General", slug: "general" },
];

const CategoryNav = () => {
  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3 mt-10">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to={`/shop/${category.slug}`}
            className={chipClass}
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
