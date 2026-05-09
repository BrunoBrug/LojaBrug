import { describe, expect, it } from "vitest";
import type { Product } from "../products/productsApi";
import { cartReducer, type CartState } from "./cartReducer";

const product: Product = {
  id: "camiseta-essencial",
  name: "Camiseta Essencial",
  category: "Camiseta",
  description: "Algodao macio com corte limpo.",
  priceInCents: 8900,
  imageUrl: "data:image/svg+xml,%3Csvg%3E%3C/svg%3E",
  options: ["P", "M", "G"],
};

describe("cartReducer", () => {
  it("adds a product with quantity one", () => {
    const state = cartReducer(emptyCart(), { type: "add", product, option: "M" });

    expect(state.items).toEqual([{ product, option: "M", quantity: 1 }]);
  });

  it("increments quantity when adding the same product and option", () => {
    const state = cartReducer(
      { items: [{ product, option: "M", quantity: 1 }] },
      { type: "add", product, option: "M" },
    );

    expect(state.items[0].quantity).toBe(2);
  });

  it("removes a product from the cart", () => {
    const state = cartReducer(
      { items: [{ product, option: "M", quantity: 1 }] },
      { type: "remove", productId: product.id },
    );

    expect(state.items).toEqual([]);
  });

  it("keeps quantity at one or above", () => {
    const state = cartReducer(
      { items: [{ product, option: "M", quantity: 3 }] },
      { type: "setQuantity", productId: product.id, quantity: 0 },
    );

    expect(state.items[0].quantity).toBe(1);
  });
});

function emptyCart(): CartState {
  return { items: [] };
}
