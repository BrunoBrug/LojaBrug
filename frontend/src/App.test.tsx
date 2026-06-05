/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { fetchProducts } from "./features/products/productsApi";

vi.mock("./features/products/productsApi", () => ({
  fetchProducts: vi.fn(),
}));

const mockedFetchProducts = vi.mocked(fetchProducts);

describe("App payment return pages", () => {
  it("shows the payment success page on /success", () => {
    mockedFetchProducts.mockResolvedValue([]);
    window.history.pushState({}, "", "/success");

    render(<App />);

    expect(screen.getByRole("heading", { name: /pagamento aprovado/i })).toBeTruthy();
  });

  it("shows the payment cancel page on /cancel", () => {
    mockedFetchProducts.mockResolvedValue([]);
    window.history.pushState({}, "", "/cancel");

    render(<App />);

    expect(screen.getByRole("heading", { name: /pagamento cancelado/i })).toBeTruthy();
  });
});
