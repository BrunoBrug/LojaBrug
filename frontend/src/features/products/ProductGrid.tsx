import type { Product } from "./productsApi";

type ProductGridProps = {
  products: Product[];
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="product-grid" aria-label="Produtos">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image" aria-hidden="true">
            <span>{product.category}</span>
          </div>
          <div className="product-copy">
            <p className="product-category">{product.category}</p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>{currencyFormatter.format(product.priceInCents / 100)}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}
