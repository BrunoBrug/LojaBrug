# Stripe Checkout Integration

Este projeto usa Stripe Checkout para pagamentos unicos de produtos fisicos. A regra principal e simples: o frontend monta o carrinho, mas o backend valida produtos, recalcula precos e cria a sessao de pagamento.

## Fluxo Do Pagamento

1. O cliente adiciona produtos ao carrinho no React.
2. O frontend envia para `POST /api/checkout` apenas `productId`, `quantity` e `option`.
3. O Spring Boot busca os produtos no catalogo fixo e recalcula o total.
4. O backend cria uma Checkout Session na Stripe usando `STRIPE_SECRET_KEY`.
5. A API responde uma `checkoutUrl`.
6. O frontend redireciona o cliente para a URL HTTPS da Stripe.
7. A Stripe chama `POST /api/webhooks/stripe` quando o pagamento muda de estado.
8. O backend valida a assinatura do webhook com `STRIPE_WEBHOOK_SECRET`.

## Arquivos Principais

- Frontend checkout client: `frontend/src/features/checkout/checkoutApi.ts`
- Frontend fluxo de compra: `frontend/src/App.tsx`
- Backend checkout controller: `backend/src/main/java/com/lojabrug/api/checkout/CheckoutController.java`
- Backend criacao da sessao Stripe: `backend/src/main/java/com/lojabrug/api/checkout/StripeCheckoutSessionClient.java`
- Backend webhook Stripe: `backend/src/main/java/com/lojabrug/api/webhook/StripeWebhookController.java`

## Seguranca Do MVP

- O frontend nunca recebe `STRIPE_SECRET_KEY`.
- O frontend nao envia preco para o backend.
- O backend rejeita carrinho vazio, quantidade invalida e produto inexistente.
- O frontend so aceita redirect para URL `https://`.
- Webhook sem assinatura ou com assinatura invalida retorna `400`.
- Secrets reais ficam no Render, Vercel ou Stripe Dashboard, nunca no Git.

## Como Testar Localmente

No backend:

```powershell
cd backend
.\mvnw.cmd test
```

No frontend:

```powershell
cd frontend
npm.cmd test -- --run
npm.cmd run lint
npm.cmd run build
```

Para testar webhooks localmente no futuro, use o Stripe CLI para encaminhar eventos para `http://localhost:8080/api/webhooks/stripe`. O valor `whsec_...` gerado pelo CLI deve ir apenas no `.env` local do backend.

