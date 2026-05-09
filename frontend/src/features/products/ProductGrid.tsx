import type { Product } from "./productsApi";

type ProductGridProps = {
  products: Product[];
  onAddToCart: (product: Product) => void;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <section className="product-grid" aria-label="Produtos">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <img className="product-image" src={product.imageUrl} alt={product.name} />
          <div className="product-copy">
            <p className="product-category">{product.category}</p>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <strong>{currencyFormatter.format(product.priceInCents / 100)}</strong>
            <button type="button" onClick={() => onAddToCart(product)}>
              Adicionar
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
