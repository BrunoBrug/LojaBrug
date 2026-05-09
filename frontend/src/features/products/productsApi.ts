export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  priceInCents: number;
  imageUrl: string;
  options: string[];
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${apiUrl}/api/products`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os produtos.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isProduct)) {
    throw new Error("Resposta de produtos invalida.");
  }

  return data;
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    typeof product.description === "string" &&
    typeof product.priceInCents === "number" &&
    typeof product.imageUrl === "string" &&
    Array.isArray(product.options) &&
    product.options.every((option) => typeof option === "string")
  );
}
