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

  return response.json();
}
