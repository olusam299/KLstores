import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFeaturedProducts } from "../lib/products";

const Banner = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);

  // Featured products are set by whoever runs the store (currently via a
  // SQL update on the `featured` column) - this just displays whichever
  // ones are marked.
  useEffect(() => {
    getFeaturedProducts().then(setSlides);
  }, []);

  // Auto-advance every 5s once there's more than one slide to show.
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[index];
  // .banner in index.css sets a gradient + fallback background image via
  // the `background` shorthand. Overriding just backgroundImage here keeps
  // that same gradient overlay, swapped onto whichever product is current.
  const backgroundImage = currentSlide
    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.15) 100%), url("/assets/${currentSlide.image}")`
    : undefined;

  return (
    <div
      className={`banner w-full flex flex-col justify-end items-center max-sm:h-[550px] max-sm:gap-2 transition-[background-image] duration-700 ${
        currentSlide ? "cursor-pointer" : ""
      }`}
      style={backgroundImage ? { backgroundImage } : undefined}
      onClick={() => currentSlide && navigate(`/product/${currentSlide.id}`)}
    >
      <h2 className="text-white text-center text-6xl font-bold tracking-[1.86px] leading-[60px] max-sm:text-4xl max-[400px]:text-3xl">
        Discover the Best <br />
        Fashion Collection
      </h2>
      <h3 className="text-white text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-[400px]:text-lg">
        The High-Quality Collection
      </h3>

      {/* Buttons sit on top of the clickable banner - stop their clicks
          from also triggering the "go to featured product" navigation. */}
      <div
        className="flex justify-center items-center gap-3 pb-6 max-[400px]:flex-col max-[400px]:gap-1 w-[420px] max-sm:w-[350px] max-[400px]:w-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          to="/shop"
          className="bg-white text-black text-center text-xl border border-[rgba(0, 0, 0, 0.40)] font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center"
        >
          Shop Now
        </Link>
        <Link
          to="/shop"
          className="text-white border-white border-2 text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center"
        >
          See Collection
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="flex gap-2 pb-8" onClick={(e) => e.stopPropagation()}>
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Banner;
