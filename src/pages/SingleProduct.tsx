import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
} from "../components";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import { formatCategoryName } from "../utils/formatCategoryName";
import toast from "react-hot-toast";
import { getProduct, getProducts } from "../lib/products";
import { formatNaira } from "../utils/formatNaira";

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  // defining default values for input fields
  const [size, setSize] = useState<string>("xs");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // defining HOC instances
  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      if (!params.id) return;
      setSingleProduct(await getProduct(params.id));
    };

    const fetchProducts = async () => {
      setProducts(await getProducts());
    };
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  // Returns true when the item was added.
  const handleAddToCart = (): boolean => {
    if (!singleProduct) return false;

    if (singleProduct.stock <= 0) {
      toast.error("This product is out of stock");
      return false;
    }

    const safeQuantity = Math.max(1, Math.min(quantity || 1, singleProduct.stock));

    dispatch(
      addProductToTheCart({
        id: singleProduct.id + size + color,
        productId: singleProduct.id,
        image: singleProduct.image,
        title: singleProduct.title,
        category: singleProduct.category,
        price: singleProduct.price,
        quantity: safeQuantity,
        size,
        color,
        popularity: singleProduct.popularity,
        stock: singleProduct.stock,
        featured: singleProduct.featured,
        type: singleProduct.type,
      })
    );
    toast.success("Product added to the cart");
    return true;
  };

  const handleCheckoutNow = () => {
    if (handleAddToCart()) navigate("/checkout");
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3">
      <div className="grid grid-cols-3 gap-x-8 max-lg:grid-cols-1">
        <div className="lg:col-span-2">
          <img
            src={singleProduct?.image}
            alt={singleProduct?.title}
          />
        </div>
        <div className="w-full flex flex-col gap-5 mt-9">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl">{singleProduct?.title}</h1>
            <div className="flex justify-between items-center">
              <p className="text-base text-brand">
                {formatCategoryName(singleProduct?.category || "")}
              </p>
              <p className="text-base font-bold">{formatNaira(singleProduct?.price ?? 0)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SelectInputUpgrade
              selectList={[
                { id: "xs", value: "XS" },
                { id: "sm", value: "SM" },
                { id: "m", value: "M" },
                { id: "lg", value: "LG" },
                { id: "xl", value: "XL" },
                { id: "2xl", value: "2XL" },
              ]}
              value={size}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSize(() => e.target.value)
              }
            />
            <SelectInputUpgrade
              selectList={[
                { id: "black", value: "BLACK" },
                { id: "red", value: "RED" },
                { id: "blue", value: "BLUE" },
                { id: "white", value: "WHITE" },
                { id: "rose", value: "ROSE" },
                { id: "green", value: "GREEN" },
              ]}
              value={color}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(() => e.target.value)
              }
            />

            <QuantityInputUpgrade
              value={quantity}
              min={1}
              max={singleProduct?.stock || 1}
              disabled={!singleProduct || singleProduct.stock <= 0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const parsed = parseInt(e.target.value);
                const limit = singleProduct?.stock ?? 1;
                setQuantity(
                  Number.isFinite(parsed)
                    ? Math.max(1, Math.min(parsed, limit))
                    : 1
                );
              }}
            />
            {singleProduct && singleProduct.stock <= 0 && (
              <p className="text-red-600 text-sm">Out of stock</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Button mode="brown" text="Add to cart" onClick={() => handleAddToCart()} />
            <Button mode="white" text="Check out now" onClick={handleCheckoutNow} />
            <p className="text-brand text-sm text-right">
              Delivery fee and timing are agreed with the seller on WhatsApp
            </p>
          </div>
          <div>
            {/* drowdown items */}
            <Dropdown dropdownTitle="Description">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore
              quos deleniti, mollitia, vitae harum suscipit voluptatem quasi, ab
              assumenda accusantium rem praesentium accusamus quae quam tempore
              nostrum corporis eaque. Mollitia.
            </Dropdown>

            <Dropdown dropdownTitle="Product Details">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ad
              at odio illo, necessitatibus, reprehenderit dolore voluptas ea
              consequuntur ducimus repellat soluta mollitia facere sapiente.
              Unde provident possimus hic dolore.
            </Dropdown>

            <Dropdown dropdownTitle="Delivery Details">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ad
              at odio illo, necessitatibus, reprehenderit dolore voluptas ea
              consequuntur ducimus repellat soluta mollitia facere sapiente.
              Unde provident possimus hic dolore.
            </Dropdown>
          </div>
        </div>
      </div>

      {/* similar products */}
      <div>
        <h2 className="text-black/90 text-5xl mt-24 mb-12 text-center max-lg:text-4xl">
          Similar Products
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-5 lg:gap-8 mt-12">
          {products
            .filter((p: Product) => p.id !== params.id)
            .slice(0, 3)
            .map((product: Product) => (
            <ProductItem
              key={product?.id}
              id={product?.id}
              image={product?.image}
              title={product?.title}
              category={product?.category}
              price={product?.price}
              popularity={product?.popularity}
              stock={product?.stock}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SingleProduct;
