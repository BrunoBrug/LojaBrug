import type { Product } from "../products/productsApi";

export type CartItem = {
  product: Product;
  quantity: number;
  option?: string;
};

export type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "add"; product: Product; option?: string }
  | { type: "remove"; productId: string; option?: string }
  | { type: "setQuantity"; productId: string; option?: string; quantity: number };

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "add") {
    const existing = state.items.find(
      (item) => item.product.id === action.product.id && item.option === action.option,
    );

    if (!existing) {
      return {
        items: [...state.items, { product: action.product, option: action.option, quantity: 1 }],
      };
    }

    return {
      items: state.items.map((item) =>
        item.product.id === action.product.id && item.option === action.option
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    };
  }

  if (action.type === "remove") {
    return {
      items: state.items.filter(
        (item) => item.product.id !== action.productId || item.option !== action.option,
      ),
    };
  }

  if (action.type === "setQuantity") {
    return {
      items: state.items.map((item) =>
        item.product.id === action.productId && item.option === action.option
          ? { ...item, quantity: Math.max(1, action.quantity) }
          : item,
      ),
    };
  }

  return state;
}
