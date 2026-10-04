import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPromoProducts, getPromoSettings } from "../lib/promo";

// "Promo of the day" section. Shown only when an admin switches it on
// (Manage Products > Promo) and at least one product is marked promo.
const PromoHero = () => {
  const [settings, setSettings] = useState<PromoSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getPromoSettings().then(setSettings);
    getPromoProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!settings?.promo_enabled || products.length === 0) return null;

  const product = products[index % products.length];
  const name = product.promo_name?.trim() || product.title;

  return (
    <section className="w-full bg-[#0B1F4B] mt-24">
      <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3 py-10 flex items-center gap-8 max-md:flex-col">
        <Link
          to={`/product/${product.id}`}
          className="w-1/2 max-md:w-full aspect-[4/3] overflow-hidden bg-[#13306e]"
        >
          <img
            src={product.image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="w-1/2 max-md:w-full flex flex-col items-start max-md:items-center max-md:text-center gap-2 text-yellow-300">
          <p className="text-lg tracking-[0.35em] font-semibold max-sm:text-sm">
            PROMO OF THE DAY
          </p>
          <p className="text-7xl font-black leading-none max-sm:text-5xl">
            SAVE {settings.promo_discount}%
          </p>
          <p className="text-3xl italic font-light tracking-wide max-sm:text-xl">
            Lightning Deal
          </p>
          <p className="text-2xl font-semibold mt-2 max-sm:text-lg">{name}</p>

          <Link
            to={`/product/${product.id}`}
            className="mt-4 px-8 h-12 flex items-center justify-center bg-yellow-300 text-[#0B1F4B] text-lg font-semibold tracking-wide"
          >
            Shop now
          </Link>

          {products.length > 1 && (
            <div className="flex gap-2 mt-3">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Show promo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full ${
                    i === index % products.length
                      ? "bg-yellow-300"
                      : "bg-yellow-300/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default PromoHero;
