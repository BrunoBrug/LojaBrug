import { useEffect, useReducer, useState } from "react";
import "./styles.css";
import { CartPanel } from "./features/cart/CartPanel";
import { cartReducer } from "./features/cart/cartReducer";
import { ProductGrid } from "./features/products/ProductGrid";
import { fetchProducts, type Product } from "./features/products/productsApi";

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    let isMounted = true;

    fetchProducts()
      .then((nextProducts) => {
        if (isMounted) {
          setProducts(nextProducts);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">LojaBrug</p>
        <h1>Essenciais pequenos, presença grande.</h1>
        <p className="lede">
          Uma coleção enxuta de camisetas, pulseiras e bottoms com acabamento
          minimalista e personalidade visual.
        </p>
      </header>

      {status === "loading" && <p className="catalog-status">Carregando coleção...</p>}
      {status === "error" && (
        <p className="catalog-status" role="alert">
          Nao foi possivel carregar os produtos agora.
        </p>
      )}
      {status === "ready" && (
        <section className="commerce-layout">
          <ProductGrid
            products={products}
            onAddToCart={(product) => dispatch({ type: "add", product })}
          />
          <CartPanel
            items={cart.items}
            onCheckout={() => {
              createCheckoutPayload(cart.items);
            }}
            onQuantityChange={(productId, option, quantity) =>
              dispatch({ type: "setQuantity", productId, option, quantity })
            }
            onRemove={(productId, option) => dispatch({ type: "remove", productId, option })}
          />
        </section>
      )}
    </main>
  );
}

export default App;

function createCheckoutPayload(items: { product: Product; quantity: number; option?: string }[]) {
  return {
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      option: item.option,
    })),
  };
}
