# LojaBrug

LojaBrug is a minimal premium storefront MVP with a React frontend, Spring Boot backend, and Stripe Checkout.

## Stack

- React, TypeScript, Vite
- Java, Spring Boot
- Stripe Checkout
- Vercel
- Render Free

## Seguranca

Nao commit arquivos `.env` nem secrets reais. Use apenas arquivos de exemplo seguros, como `.env.example`, para documentar variaveis necessarias.

## Desenvolvimento Local

- Frontend: `frontend/`
- Backend: `backend/`

## Documentacao De Estudo

- Stripe Checkout: `docs/integrations/stripe-checkout.md`
- Deploy e CI/CD: `docs/deploy-ci-cd.md`
- Idempotencia, RabbitMQ, Redis, CQRS e microsservicos: `docs/learning/scaling-patterns.md`

## Variaveis De Ambiente

### Backend no Render

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`

### Frontend na Vercel

- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

Nunca cole secrets reais em chat, commits, issues ou pull requests. Arquivos
`.env` reais devem ficar apenas locais ou nos dashboards dos provedores.

## Deploy E Protecao

- A Vercel hospeda o frontend React em `frontend/`.
- O Render Free hospeda a API Spring Boot em `backend/`.
- O webhook da Stripe deve apontar para `/api/webhooks/stripe` na API do Render.
- A branch `main` deve exigir pull request e checks de CI antes de merge.
- O arquivo `vercel.json` define como a Vercel builda e publica o frontend do monorepo.
