import { Link } from "react-router-dom";
import { formatCategoryName } from "../utils/formatCategoryName";
import { formatNaira } from "../utils/formatNaira";

const ProductItem = ({
  id,
  image,
  title,
  category,
  price,
  popularity: _popularity,
  stock: _stock,
}: {
  id: string;
  image: string;
  title: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
}) => {
  return (
    <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-2">
      <Link
        to={`/product/${id}`}
        className="block w-full aspect-[4/5] overflow-hidden bg-gray-100"
      >
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </Link>
      <Link
        to={`/product/${id}`}
        className="text-black text-center text-xs sm:text-lg lg:text-2xl tracking-[0.5px] truncate"
      >
        <h2 className="truncate">{title}</h2>
      </Link>
      <p className="hidden sm:block text-brand text-sm lg:text-lg tracking-wide text-center">
        {formatCategoryName(category)}
      </p>
      <p className="text-black text-sm sm:text-lg lg:text-2xl text-center font-bold">
        {formatNaira(price)}
      </p>
      <div className="w-full flex flex-col gap-1">
        <Link
          to={`/product/${id}`}
          className="text-white bg-brand text-center text-xs sm:text-base lg:text-xl font-normal tracking-[0.6px] w-full h-8 sm:h-10 lg:h-12 flex items-center justify-center"
        >
          View product
        </Link>
        <Link
          to={`/product/${id}`}
          className="hidden sm:flex bg-white text-black text-center text-base lg:text-xl border border-black/40 font-normal tracking-[0.6px] w-full h-10 lg:h-12 items-center justify-center"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
};
export default ProductItem;
