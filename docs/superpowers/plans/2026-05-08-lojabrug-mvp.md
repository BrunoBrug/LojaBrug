# LojaBrug MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the LojaBrug MVP with a React storefront on Vercel, a Spring Boot API on Render Free, fixed backend catalog, simple cart, and Stripe Checkout.

**Architecture:** Use a monorepo with `frontend/` and `backend/`. The frontend owns browsing and cart state; the backend owns the official catalog, price validation, Stripe Checkout Session creation, and Stripe webhook verification. The code should keep `Product`, `Cart`, `Checkout`, and `Order` boundaries clear so a future database/admin phase can replace the fixed catalog cleanly.

**Tech Stack:** React, TypeScript, Vite, Java, Spring Boot, Maven, Stripe Java SDK, JUnit, Vitest, GitHub Actions, Vercel, Render Free.

---

## File Structure

- `.github/workflows/ci.yml`: runs frontend and backend checks on pull requests.
- `.gitignore`: ignores secrets, build output, dependencies, and local context files.
- `README.md`: project overview, local setup, environment variables, and deploy notes.
- `frontend/`: React/Vite storefront.
- `frontend/.env.example`: safe frontend environment variable example.
- `frontend/src/features/products/`: product API types and UI.
- `frontend/src/features/cart/`: cart state and cart UI.
- `frontend/src/features/checkout/`: checkout client call.
- `backend/`: Spring Boot API.
- `backend/.env.example`: safe backend environment variable example.
- `backend/src/main/java/com/lojabrug/api/product/`: fixed product catalog.
- `backend/src/main/java/com/lojabrug/api/checkout/`: cart validation and Stripe Checkout.
- `backend/src/main/java/com/lojabrug/api/webhook/`: Stripe webhook verification.
- `backend/src/test/java/com/lojabrug/api/`: backend tests.

## Task 1: Repository Safety And Remote Setup

**Files:**
- Modify: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Verify local Git identity**

Run:

```bash
git config --get user.name
git config --get user.email
```

Expected: output is the user's identity, not Codex. Do not continue if identity is wrong.

- [ ] **Step 2: Confirm `AGENTS.md` is ignored and not tracked**

Run:

```bash
git check-ignore AGENTS.md
git ls-files AGENTS.md
```

Expected: first command prints `AGENTS.md`; second command prints nothing.

- [ ] **Step 3: Create project README**

Create `README.md`:

```markdown
# LojaBrug

LojaBrug is a minimal premium storefront MVP with a React frontend, Spring Boot backend, and Stripe Checkout.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Java, Spring Boot
- Payments: Stripe Checkout
- Frontend deploy: Vercel
- Backend deploy: Render Free

## Security

Do not commit real `.env` files or secrets. Use `.env.example` files as documentation only.

## Local Development

Frontend runs from `frontend/`.
Backend runs from `backend/`.
```

- [ ] **Step 4: Commit repository baseline**

Run:

```bash
git add .gitignore README.md docs/superpowers/specs/2026-05-08-lojabrug-mvp-design.md docs/superpowers/plans/2026-05-08-lojabrug-mvp.md
git commit -m "docs: add LojaBrug implementation plan"
```

Expected: commit succeeds without `Co-authored-by`.

- [ ] **Step 5: Create and connect remote repository only when approved**

Use the GitHub plugin or `gh` with the user's account to create/connect remote `LojaBrug`.

Run only after explicit approval:

```bash
gh repo create LojaBrug --private --source=. --remote=origin --push
```

Expected: remote repository exists as `LojaBrug`, `main` is pushed, and `AGENTS.md` is absent from GitHub.

## Task 2: Frontend Scaffold

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/index.html`
- Create: `frontend/src/main.tsx`
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/styles.css`
- Create: `frontend/.env.example`

- [ ] **Step 1: Scaffold Vite React TypeScript**

Run:

```bash
npm create vite@latest frontend -- --template react-ts
```

Expected: `frontend/package.json` exists.

- [ ] **Step 2: Install dependencies**

Run:

```bash
cd frontend
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Add frontend env example**

Create `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_example
```

- [ ] **Step 4: Replace starter app shell**

Use `frontend/src/App.tsx`:

```tsx
import "./styles.css";

export function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">LojaBrug</p>
        <h1>Essenciais pequenos, presença grande.</h1>
        <p className="lede">
          Uma coleção enxuta de camisetas, pulseiras e bottoms com acabamento minimalista e personalidade visual.
        </p>
      </header>
    </main>
  );
}

export default App;
```

- [ ] **Step 5: Add initial premium visual styling**

Use `frontend/src/styles.css`:

```css
:root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #181713;
  background: #f7f4ee;
}

body {
  margin: 0;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
}

.hero {
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 24px 32px;
}

.eyebrow {
  margin: 0 0 18px;
  color: #8f3f2b;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 5.8rem);
  line-height: 0.96;
  letter-spacing: 0;
}

.lede {
  max-width: 620px;
  margin: 24px 0 0;
  color: #5c574d;
  font-size: 1.08rem;
  line-height: 1.65;
}
```

- [ ] **Step 6: Verify frontend**

Run:

```bash
cd frontend
npm run build
```

Expected: build passes.

- [ ] **Step 7: Commit frontend scaffold**

Run:

```bash
git add frontend
git commit -m "feat: scaffold React storefront"
```

## Task 3: Backend Scaffold

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/lojabrug/api/LojaBrugApiApplication.java`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/.env.example`
- Create: `backend/src/test/java/com/lojabrug/api/LojaBrugApiApplicationTests.java`

- [ ] **Step 1: Create Spring Boot project**

Use Spring Initializr or create Maven structure with:
- Spring Web
- Validation
- Spring Boot Test

`backend/pom.xml` must include Stripe:

```xml
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>28.2.0</version>
</dependency>
```

- [ ] **Step 2: Add application class**

Create `backend/src/main/java/com/lojabrug/api/LojaBrugApiApplication.java`:

```java
package com.lojabrug.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LojaBrugApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(LojaBrugApiApplication.class, args);
    }
}
```

- [ ] **Step 3: Add safe backend env example**

Create `backend/.env.example`:

```env
STRIPE_SECRET_KEY=sk_test_example
STRIPE_WEBHOOK_SECRET=whsec_example
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

- [ ] **Step 4: Add application config**

Create `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

lojabrug:
  frontend-url: ${FRONTEND_URL:http://localhost:5173}
  allowed-origins: ${ALLOWED_ORIGINS:http://localhost:5173}
  stripe:
    secret-key: ${STRIPE_SECRET_KEY:}
    webhook-secret: ${STRIPE_WEBHOOK_SECRET:}
```

- [ ] **Step 5: Add context load test**

Create `backend/src/test/java/com/lojabrug/api/LojaBrugApiApplicationTests.java`:

```java
package com.lojabrug.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LojaBrugApiApplicationTests {
    @Test
    void contextLoads() {
    }
}
```

- [ ] **Step 6: Verify backend**

Run:

```bash
cd backend
./mvnw test
```

On Windows, use:

```bash
cd backend
mvnw.cmd test
```

Expected: tests pass.

- [ ] **Step 7: Commit backend scaffold**

Run:

```bash
git add backend
git commit -m "feat: scaffold Spring Boot API"
```

## Task 4: Product Catalog API

**Files:**
- Create: `backend/src/main/java/com/lojabrug/api/product/Product.java`
- Create: `backend/src/main/java/com/lojabrug/api/product/ProductCatalog.java`
- Create: `backend/src/main/java/com/lojabrug/api/product/ProductController.java`
- Create: `backend/src/test/java/com/lojabrug/api/product/ProductCatalogTest.java`
- Create: `frontend/src/features/products/productsApi.ts`
- Create: `frontend/src/features/products/ProductGrid.tsx`

- [ ] **Step 1: Write backend catalog test**

Create `ProductCatalogTest.java` with assertions for six products:

```java
package com.lojabrug.api.product;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ProductCatalogTest {
    @Test
    void catalogContainsSixInitialProducts() {
        ProductCatalog catalog = new ProductCatalog();

        assertThat(catalog.findAll()).hasSize(6);
        assertThat(catalog.findById("camiseta-essencial")).isPresent();
        assertThat(catalog.findById("bottom-assinatura")).isPresent();
    }
}
```

- [ ] **Step 2: Add product record**

Create `Product.java`:

```java
package com.lojabrug.api.product;

import java.util.List;

public record Product(
    String id,
    String name,
    String category,
    String description,
    long priceInCents,
    String imageUrl,
    List<String> options
) {
}
```

- [ ] **Step 3: Add fixed catalog**

Create `ProductCatalog.java` with six products:

```java
package com.lojabrug.api.product;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class ProductCatalog {
    private final List<Product> products = List.of(
        new Product("camiseta-essencial", "Camiseta Essencial", "Camiseta", "Algodao macio com corte limpo.", 8900, "/products/camiseta-essencial.jpg", List.of("P", "M", "G")),
        new Product("camiseta-noite", "Camiseta Noite", "Camiseta", "Preta, simples e marcante.", 9900, "/products/camiseta-noite.jpg", List.of("P", "M", "G")),
        new Product("pulseira-linha", "Pulseira Linha", "Pulseira", "Metal discreto com presenca.", 4900, "/products/pulseira-linha.jpg", List.of()),
        new Product("pulseira-cobre", "Pulseira Cobre", "Pulseira", "Tom quente para contraste sutil.", 5400, "/products/pulseira-cobre.jpg", List.of()),
        new Product("bottom-assinatura", "Bottom Assinatura", "Bottom", "Detalhe grafico para a peca favorita.", 1900, "/products/bottom-assinatura.jpg", List.of()),
        new Product("bottom-brilho", "Bottom Brilho", "Bottom", "Pequeno ponto de luz no look.", 2200, "/products/bottom-brilho.jpg", List.of())
    );

    public List<Product> findAll() {
        return products;
    }

    public Optional<Product> findById(String id) {
        return products.stream().filter(product -> product.id().equals(id)).findFirst();
    }
}
```

- [ ] **Step 4: Add products endpoint**

Create `ProductController.java`:

```java
package com.lojabrug.api.product;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductCatalog catalog;

    public ProductController(ProductCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping
    public List<Product> listProducts() {
        return catalog.findAll();
    }
}
```

- [ ] **Step 5: Add frontend product API**

Create `frontend/src/features/products/productsApi.ts`:

```ts
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
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
cd backend
mvnw.cmd test
cd ../frontend
npm run build
```

Commit:

```bash
git add backend frontend
git commit -m "feat: add fixed product catalog"
```

## Task 5: Cart UI And Checkout Button

**Files:**
- Create: `frontend/src/features/cart/cartReducer.ts`
- Create: `frontend/src/features/cart/CartPanel.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Add cart reducer test**

Create focused tests for add, remove, and quantity changes using Vitest.

Expected behaviors:
- adding a product creates an item with quantity `1`;
- adding the same product increments quantity;
- removing deletes the item;
- quantity cannot go below `1`.

- [ ] **Step 2: Add cart reducer**

Create `cartReducer.ts`:

```ts
import type { Product } from "../products/productsApi";

export type CartItem = {
  product: Product;
  quantity: number;
  option?: string;
};

export type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "add"; product: Product; option?: string }
  | { type: "remove"; productId: string }
  | { type: "setQuantity"; productId: string; quantity: number };

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "add") {
    const existing = state.items.find((item) => item.product.id === action.product.id && item.option === action.option);
    if (!existing) {
      return { items: [...state.items, { product: action.product, option: action.option, quantity: 1 }] };
    }

    return {
      items: state.items.map((item) =>
        item.product.id === action.product.id && item.option === action.option
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    };
  }

  if (action.type === "remove") {
    return { items: state.items.filter((item) => item.product.id !== action.productId) };
  }

  if (action.type === "setQuantity") {
    return {
      items: state.items.map((item) =>
        item.product.id === action.productId ? { ...item, quantity: Math.max(1, action.quantity) } : item
      ),
    };
  }

  return state;
}
```

- [ ] **Step 3: Add checkout payload shape**

The frontend must send only IDs, quantities, and options:

```ts
const payload = {
  items: cart.items.map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
    option: item.option,
  })),
};
```

- [ ] **Step 4: Verify and commit**

Run:

```bash
cd frontend
npm test -- --run
npm run build
```

Commit:

```bash
git add frontend
git commit -m "feat: add storefront cart"
```

## Task 6: Stripe Checkout Backend

**Files:**
- Create: `backend/src/main/java/com/lojabrug/api/checkout/CartItemRequest.java`
- Create: `backend/src/main/java/com/lojabrug/api/checkout/CreateCheckoutRequest.java`
- Create: `backend/src/main/java/com/lojabrug/api/checkout/CreateCheckoutResponse.java`
- Create: `backend/src/main/java/com/lojabrug/api/checkout/CheckoutService.java`
- Create: `backend/src/main/java/com/lojabrug/api/checkout/CheckoutController.java`
- Create: `backend/src/test/java/com/lojabrug/api/checkout/CheckoutServiceTest.java`

- [ ] **Step 1: Write cart validation tests**

Test invalid product IDs and invalid quantities before calling Stripe.

Expected:
- unknown product throws a validation error;
- quantity below `1` throws a validation error;
- line item amount comes from backend catalog.

- [ ] **Step 2: Add request/response records**

```java
package com.lojabrug.api.checkout;

public record CartItemRequest(String productId, int quantity, String option) {
}
```

```java
package com.lojabrug.api.checkout;

import java.util.List;

public record CreateCheckoutRequest(List<CartItemRequest> items) {
}
```

```java
package com.lojabrug.api.checkout;

public record CreateCheckoutResponse(String checkoutUrl) {
}
```

- [ ] **Step 3: Implement checkout endpoint**

Endpoint:

```java
@PostMapping("/api/checkout")
public CreateCheckoutResponse createCheckout(@RequestBody @Valid CreateCheckoutRequest request) {
    return checkoutService.createCheckout(request);
}
```

- [ ] **Step 4: Use Stripe Checkout Sessions**

`CheckoutService` should:
- read `STRIPE_SECRET_KEY`;
- validate cart against `ProductCatalog`;
- create line items from backend prices;
- use `${FRONTEND_URL}/success` and `${FRONTEND_URL}/cancel`;
- return only the Stripe checkout URL.

- [ ] **Step 5: Verify and commit**

Run:

```bash
cd backend
mvnw.cmd test
```

Commit:

```bash
git add backend
git commit -m "feat: create Stripe checkout sessions"
```

## Task 7: Webhook And Order Boundary

**Files:**
- Create: `backend/src/main/java/com/lojabrug/api/order/OrderStatus.java`
- Create: `backend/src/main/java/com/lojabrug/api/order/PaymentEventLog.java`
- Create: `backend/src/main/java/com/lojabrug/api/webhook/StripeWebhookController.java`
- Create: `backend/src/test/java/com/lojabrug/api/webhook/StripeWebhookControllerTest.java`

- [ ] **Step 1: Add webhook verification test**

Test that requests without a valid Stripe signature are rejected.

Expected:
- missing signature returns `400`;
- invalid signature returns `400`;
- valid `checkout.session.completed` can be accepted.

- [ ] **Step 2: Add minimal order status enum**

```java
package com.lojabrug.api.order;

public enum OrderStatus {
    PENDING,
    PAID,
    CANCELED
}
```

- [ ] **Step 3: Add payment event log boundary**

For MVP, keep it in memory or log-only. Do not add a database yet.

```java
package com.lojabrug.api.order;

import java.time.Instant;

public record PaymentEventLog(String stripeEventId, String type, Instant receivedAt) {
}
```

- [ ] **Step 4: Add webhook controller**

The controller must use `Webhook.constructEvent(payload, sigHeader, webhookSecret)` from the Stripe Java SDK and reject invalid signatures.

- [ ] **Step 5: Verify and commit**

Run:

```bash
cd backend
mvnw.cmd test
```

Commit:

```bash
git add backend
git commit -m "feat: verify Stripe webhooks"
```

## Task 8: CI, Deploy Documentation, And Protection Checklist

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

- [ ] **Step 1: Add GitHub Actions CI**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build

  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - run: ./mvnw test
```

- [ ] **Step 2: Document deploy variables**

Add to `README.md`:

```markdown
## Environment Variables

### Backend on Render

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`

### Frontend on Vercel

- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

Never paste real secrets into chat, commits, issues, or pull requests.
```

- [ ] **Step 3: Verify all checks**

Run:

```bash
cd frontend
npm run build
cd ../backend
mvnw.cmd test
```

Expected: both pass.

- [ ] **Step 4: Commit CI and docs**

Run:

```bash
git add .github README.md
git commit -m "ci: add project checks"
```

- [ ] **Step 5: Configure GitHub branch protection after remote exists**

After `LojaBrug` exists on GitHub:
- require pull request before merging;
- require status checks;
- block direct pushes to `main`;
- keep the user's GitHub account as the actor.

## Self-Review

- Spec coverage: This plan covers context safety, remote setup, frontend, backend, fixed catalog, cart, Stripe Checkout, webhooks, CI, deploy documentation, and branch protection.
- Placeholder scan: No `TBD`, `TODO`, or unspecified future implementation is required for the MVP tasks.
- Type consistency: Product fields use `id`, `name`, `category`, `description`, `priceInCents`, `imageUrl`, and `options` consistently across backend and frontend. Checkout payload uses `productId`, `quantity`, and `option`.
