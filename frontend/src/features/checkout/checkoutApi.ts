import type { CartItem } from "../cart/cartReducer";

type CheckoutItemPayload = {
  productId: string;
  quantity: number;
  option?: string;
};

type CheckoutResponse = {
  checkoutUrl: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function createCheckout(items: CartItem[]): Promise<string> {
  const payload = {
    items: items.map(toCheckoutItemPayload),
  };

  const response = await fetch(`${apiUrl}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel iniciar o checkout.");
  }

  const data: unknown = await response.json();

  if (!isCheckoutResponse(data)) {
    throw new Error("Resposta de checkout invalida.");
  }

  return toSafeCheckoutUrl(data.checkoutUrl);
}

function toCheckoutItemPayload(item: CartItem): CheckoutItemPayload {
  return {
    productId: item.product.id,
    quantity: item.quantity,
    option: item.option,
  };
}

function isCheckoutResponse(value: unknown): value is CheckoutResponse {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    typeof (value as Record<string, unknown>).checkoutUrl === "string"
  );
}

function toSafeCheckoutUrl(checkoutUrl: string): string {
  const url = new URL(checkoutUrl);

  if (url.protocol !== "https:") {
    throw new Error("URL de checkout invalida.");
  }

  return url.toString();
}
