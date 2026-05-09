import { useEffect, useState } from "react";
import "./styles.css";
import { ProductGrid } from "./features/products/ProductGrid";
import { fetchProducts, type Product } from "./features/products/productsApi";

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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
      {status === "ready" && <ProductGrid products={products} />}
    </main>
  );
}

export default App;
