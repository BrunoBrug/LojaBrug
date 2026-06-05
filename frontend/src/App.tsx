import { useEffect, useReducer, useState } from "react";
import "./styles.css";
import { CartPanel } from "./features/cart/CartPanel";
import { cartReducer } from "./features/cart/cartReducer";
import { createCheckout } from "./features/checkout/checkoutApi";
import { ProductGrid } from "./features/products/ProductGrid";
import { fetchProducts, type Product } from "./features/products/productsApi";

export function App() {
  if (window.location.pathname === "/success") {
    return (
      <PaymentReturnPage
        title="Pagamento aprovado"
        message="Recebemos a confirmacao da Stripe. Obrigado por comprar na LojaBrug."
        actionLabel="Voltar para loja"
      />
    );
  }

  if (window.location.pathname === "/cancel") {
    return (
      <PaymentReturnPage
        title="Pagamento cancelado"
        message="Seu pagamento nao foi concluido. O carrinho pode ser montado novamente na loja."
        actionLabel="Ver produtos"
      />
    );
  }

  return <Storefront />;
}

function Storefront() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "loading" | "error">("idle");
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
            checkoutStatus={checkoutStatus}
            items={cart.items}
            onCheckout={async () => {
              setCheckoutStatus("loading");

              try {
                const checkoutUrl = await createCheckout(cart.items);
                window.location.assign(checkoutUrl);
              } catch {
                setCheckoutStatus("error");
              }
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

type PaymentReturnPageProps = {
  title: string;
  message: string;
  actionLabel: string;
};

function PaymentReturnPage({ title, message, actionLabel }: PaymentReturnPageProps) {
  return (
    <main className="app-shell return-page">
      <section className="return-content" aria-labelledby="return-title">
        <p className="eyebrow">LojaBrug</p>
        <h1 id="return-title">{title}</h1>
        <p className="lede">{message}</p>
        <a className="return-link" href="/">
          {actionLabel}
        </a>
      </section>
    </main>
  );
}

export default App;
