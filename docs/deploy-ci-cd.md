# Deploy E CI/CD

O pipeline do LojaBrug separa validacao de codigo e deploy:

- CI no GitHub Actions valida pull requests.
- CD fica nos provedores via Git integration.
- Secrets reais ficam nos dashboards dos provedores.

## CI No GitHub Actions

Arquivo: `.github/workflows/ci.yml`

O workflow roda em pull requests para `main` e em pushes para `main`:

- Frontend: `npm ci`, testes, lint e build.
- Backend: `./mvnw test`.

A branch `main` deve exigir pull request e checks obrigatorios antes do merge. Para este projeto, os checks esperados sao:

- `frontend`
- `backend`

## CD Do Frontend Na Vercel

Arquivo: `vercel.json`

A Vercel deve conectar ao repositorio `BrunoBrug/LojaBrug` e usar a Git integration. Como o frontend esta dentro de `frontend/`, o `vercel.json` informa:

- instalar dependencias com `cd frontend && npm ci`;
- buildar com `cd frontend && npm run build`;
- publicar `frontend/dist`.

Variaveis na Vercel:

- `VITE_API_URL`: URL publica da API no Render.
- `VITE_STRIPE_PUBLISHABLE_KEY`: chave publicavel da Stripe, se o frontend precisar dela no futuro.

No MVP atual, o frontend redireciona para a URL criada pelo backend, entao a chave publicavel pode ficar documentada mesmo que ainda nao seja usada.

## CD Do Backend No Render Free

O Render deve conectar ao mesmo repositorio e criar um Web Service para `backend/`.

Configuracao sugerida:

- Runtime: Java.
- Build command: `cd backend && ./mvnw clean package -DskipTests`
- Start command: `cd backend && java -jar target/api-0.0.1-SNAPSHOT.jar`

Variaveis no Render:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`

## Stripe Webhook Em Producao

Depois que a API estiver publicada no Render, crie no Stripe Dashboard um webhook apontando para:

```text
https://SUA-API-RENDER/api/webhooks/stripe
```

Eventos iniciais:

- `checkout.session.completed`

Copie o signing secret `whsec_...` para `STRIPE_WEBHOOK_SECRET` no Render. Nao cole esse valor no GitHub, no chat ou em arquivos versionados.

## Quando Usar Deploy Pelo GitHub Actions

Tambem seria possivel fazer deploy da Vercel por GitHub Actions usando `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`. Para este MVP, a Git integration e mais simples e reduz a quantidade de secrets no GitHub.

Use Actions para deploy somente se voce quiser aprender deploy prebuilt, promocao de preview para producao ou gates mais avancados antes de publicar.

