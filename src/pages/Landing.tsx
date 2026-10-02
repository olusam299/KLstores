import { useEffect, useState } from "react";
import { Banner, CategoryNav, CategoriesSection, HomeCollectionSection } from "../components";
import { getProducts } from "../lib/products";

const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetched once per mount, so a fresh page load, or leaving the home page
  // and coming back, gets a fresh set of random representative pictures.
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <>
      <Banner />
      <CategoryNav />
      <HomeCollectionSection products={products} />
      <CategoriesSection products={products} />
    </>
  );
};
export default Landing;
