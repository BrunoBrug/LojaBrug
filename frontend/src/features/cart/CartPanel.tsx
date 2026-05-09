import type { CartItem } from "./cartReducer";

type CartPanelProps = {
  items: CartItem[];
  onRemove: (productId: string, option?: string) => void;
  onQuantityChange: (productId: string, option: string | undefined, quantity: number) => void;
  onCheckout: () => void;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CartPanel({
  items,
  onRemove,
  onQuantityChange,
  onCheckout,
}: CartPanelProps) {
  const totalInCents = items.reduce(
    (total, item) => total + item.product.priceInCents * item.quantity,
    0,
  );

  return (
    <aside className="cart-panel" aria-label="Carrinho">
      <div className="cart-header">
        <h2>Carrinho</h2>
        <span>{items.length} itens</span>
      </div>

      {items.length === 0 ? (
        <p className="cart-empty">Sua seleção aparece aqui.</p>
      ) : (
        <ul className="cart-items">
          {items.map((item) => (
            <li className="cart-item" key={`${item.product.id}-${item.option ?? "default"}`}>
              <div>
                <strong>{item.product.name}</strong>
                {item.option && <span>{item.option}</span>}
              </div>
              <input
                aria-label={`Quantidade de ${item.product.name}`}
                min={1}
                type="number"
                value={item.quantity}
                onChange={(event) =>
                  onQuantityChange(item.product.id, item.option, Number(event.currentTarget.value))
                }
              />
              <button type="button" onClick={() => onRemove(item.product.id, item.option)}>
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="cart-footer">
        <span>Total</span>
        <strong>{currencyFormatter.format(totalInCents / 100)}</strong>
      </div>
      <button
        className="checkout-button"
        disabled={items.length === 0}
        type="button"
        onClick={onCheckout}
      >
        Finalizar compra
      </button>
    </aside>
  );
}
