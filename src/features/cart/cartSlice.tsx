import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = {
  productsInCart: ProductInCart[];
  subtotal: number;
};

const CART_STORAGE_KEY = "klstores-cart";

// Cart lives in localStorage so it survives a page refresh. If anything
// is missing or malformed we just fall back to an empty cart.
const loadCartFromStorage = (): ProductInCart[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProductInCart[]) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (productsInCart: ProductInCart[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(productsInCart));
  } catch {
    // localStorage can fail (private browsing, quota) - cart just won't persist
  }
};

const initialProducts = loadCartFromStorage();
const initialState: CartState = {
  productsInCart: initialProducts,
  subtotal: initialProducts.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  ),
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const limit = action.payload.stock ?? Infinity;
      const product = state.productsInCart.find(
        (product) => product.id === action.payload.id
      );
      if (product) {
        state.productsInCart = state.productsInCart.map((product) => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              quantity: Math.min(
                product.quantity + action.payload.quantity,
                limit
              ),
            };
          }
          return product;
        });
      } else {
        state.productsInCart.push({
          ...action.payload,
          quantity: Math.min(action.payload.quantity, limit),
        });
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToStorage(state.productsInCart);
    },
    removeProductFromTheCart: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      state.productsInCart = state.productsInCart.filter(
        (product) => product.id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToStorage(state.productsInCart);
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      state.productsInCart = state.productsInCart.map((product) => {
        if (product.id === action.payload.id) {
          // Clamp between 1 and available stock so a typed value can't
          // go to 0, negative, or above what's actually in stock.
          const limit = product.stock ?? Infinity;
          const safeQuantity = Number.isFinite(action.payload.quantity)
            ? Math.max(1, Math.min(action.payload.quantity, limit))
            : product.quantity;
          return {
            ...product,
            quantity: safeQuantity,
          };
        }
        return product;
      });
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToStorage(state.productsInCart);
    },
    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
    },
    clearCart: (state) => {
      state.productsInCart = [];
      state.subtotal = 0;
      saveCartToStorage(state.productsInCart);
    },
  },
});

export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  calculateTotalPrice,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
