interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number;
  popularity: number;
  stock: number;
  featured: boolean;
  type: string | null;
  promo: boolean;
  promo_name: string | null;
}

interface PromoSettings {
  promo_enabled: boolean;
  promo_discount: number;
}

interface ProductInCart extends Omit<Product, "promo" | "promo_name"> {
  id: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  stock: number;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  password: string;
}

interface Order {
  id: number;
  orderStatus: string;
  orderDate: string;
  data: {
    email: string;
  };
  products: ProductInCart[];
  subtotal: number;
  user: {
    email: string;
    id: number;
  };
}
