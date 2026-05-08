# LojaBrug MVP Design

## Objetivo
Criar o MVP da LojaBrug: uma loja online minimalista premium, com personalidade visual, para vender uma pequena colecao de produtos como camisetas, pulseiras e bottoms.

O MVP deve validar a experiencia de compra com uma arquitetura simples:
- frontend React hospedado na Vercel;
- backend Java Spring Boot hospedado no Render Free;
- pagamentos via Stripe Checkout;
- catalogo fixo no codigo;
- carrinho simples no frontend;
- evolucao futura planejada para banco de dados, pedidos persistidos e painel administrativo.

## Decisoes aprovadas
- Direcao visual: minimalista premium com personalidade.
- Catalogo inicial: 2 camisetas, 2 pulseiras e 2 bottoms.
- Fluxo de compra: carrinho simples.
- Checkout: Stripe Checkout hospedado pela Stripe.
- Backend: Spring Boot no Render Free.
- Frontend: React na Vercel.
- Admin/painel: fora do MVP.
- Estoque real: fora do MVP.
- Repositorio remoto pretendido: `LojaBrug`.
- `main` deve receber codigo apenas via pull request.
- Commits e GitHub devem usar somente a conta do usuario, sem `Co-authored-by` do Codex.

## Arquitetura
O frontend React sera responsavel por apresentar a loja, gerenciar o carrinho local, chamar a API Java e redirecionar o usuario para o Stripe Checkout.

O backend Spring Boot sera responsavel por expor o catalogo, validar itens do carrinho, recalcular precos de forma confiavel, criar sessoes de checkout na Stripe e receber webhooks de confirmacao de pagamento.

No MVP, os produtos ficarao fixos no backend. Essa escolha evita banco de dados e painel administrativo no inicio, mas preserva uma fronteira clara para evoluir depois: a fonte de produtos podera ser trocada por banco sem reescrever a loja inteira.

## Componentes
### Frontend React
Responsabilidades:
- exibir a vitrine com 6 produtos;
- manter o carrinho durante a navegacao;
- permitir adicionar, remover e alterar quantidade de itens;
- chamar a API do backend para criar uma sessao Stripe Checkout;
- redirecionar para a URL de checkout retornada pelo backend;
- exibir paginas de pagamento aprovado e pagamento cancelado.

Telas do MVP:
- Home/vitrine;
- Carrinho;
- Pagamento aprovado;
- Pagamento cancelado.

Uma pagina simples de "Sobre" pode existir no rodape, mas nao deve competir com o fluxo principal de compra.

### Backend Spring Boot
Responsabilidades:
- servir o catalogo fixo;
- validar IDs e quantidades enviadas pelo carrinho;
- recalcular os valores no servidor;
- criar Stripe Checkout Sessions;
- validar webhooks da Stripe por assinatura;
- registrar eventos de pagamento de forma minima no MVP.

Dominios iniciais:
- `Product`: produto do catalogo;
- `Cart`: itens recebidos do frontend;
- `Checkout`: criacao de sessao Stripe;
- `Order`: representacao minima para preparar evolucao futura.

## Fluxo de compra
1. Usuario acessa a loja na Vercel.
2. Frontend busca o catalogo na API Spring Boot.
3. Usuario adiciona produtos ao carrinho.
4. Usuario revisa quantidades no carrinho.
5. Frontend envia IDs e quantidades para o backend.
6. Backend valida produtos e recalcula precos.
7. Backend cria uma Stripe Checkout Session.
8. Frontend redireciona o usuario para a URL da Stripe.
9. Stripe processa o pagamento.
10. Usuario retorna para sucesso ou cancelamento.
11. Stripe envia webhook para o backend.
12. Backend valida assinatura do webhook e confirma o pagamento.

## Dados do produto
Cada produto do MVP deve ter:
- `id`;
- `name`;
- `category`;
- `description`;
- `priceInCents`;
- `imageUrl` ou referencia de imagem local;
- opcoes simples quando fizer sentido, como tamanho para camiseta.

O frontend nunca deve enviar preco confiavel para o backend. Ele envia apenas produto, quantidade e opcoes. O backend calcula o total usando o catalogo oficial.

## Stripe
Usar Stripe Checkout Sessions para pagamentos unicos.

O backend deve guardar e usar:
- `STRIPE_SECRET_KEY`;
- `STRIPE_WEBHOOK_SECRET`;
- `FRONTEND_URL`.

O frontend pode usar:
- `VITE_API_URL`;
- `VITE_STRIPE_PUBLISHABLE_KEY`, se for necessario para integracao com Stripe.js.

Secrets reais nunca devem ser enviados no chat, commitados, expostos em logs ou colocados em variaveis `VITE_`.

## Ambientes e secrets
### Local
Arquivos reais `.env` ficam apenas na maquina do desenvolvedor e devem ser ignorados pelo Git.

Exemplos seguros devem ser commitados como:
- `backend/.env.example`;
- `frontend/.env.example`.

### Render
O Render deve receber as variaveis do backend diretamente no dashboard:
- `STRIPE_SECRET_KEY`;
- `STRIPE_WEBHOOK_SECRET`;
- `FRONTEND_URL`.

### Vercel
A Vercel deve receber variaveis do frontend diretamente no dashboard:
- `VITE_API_URL`;
- `VITE_STRIPE_PUBLISHABLE_KEY`, se usado.

### GitHub
GitHub Secrets devem ser usados apenas quando algum workflow precisar de segredo. Para o MVP, Stripe secrets devem preferencialmente ficar apenas no Render.

## GitHub, CI e seguranca
O repositorio remoto pretendido e `LojaBrug`.

Regras desejadas:
- branch `main` protegida;
- merge na `main` apenas via pull request;
- checks obrigatorios antes de merge;
- workflows separados para frontend e backend quando fizer sentido;
- sem `Co-authored-by` do Codex nos commits;
- commits feitos com a identidade Git do usuario.
- `AGENTS.md` deve ficar apenas local e nao deve ser enviado ao repositorio remoto.

Checks iniciais:
- testes do backend;
- testes do frontend;
- build do frontend;
- build do backend.

## Deploy
Frontend:
- Vercel conectada ao repositorio GitHub;
- deploy de preview por pull request;
- deploy de producao ao fazer merge na `main`.

Backend:
- Render Free conectado ao repositorio GitHub;
- deploy da API Spring Boot;
- aceitar a limitacao de cold start/spin down no MVP.

## Evolucao futura
O MVP deve ser implementado como uma boutique enxuta, mas com caminho claro para evoluir para uma versao mais estruturada.

Fase futura com admin/painel pode incluir:
- banco de dados;
- pedidos persistidos;
- autenticacao de administrador;
- cadastro e edicao de produtos;
- upload e armazenamento de imagens;
- controle de estoque;
- listagem de pedidos;
- permissoes e protecao de rotas.

Para facilitar essa evolucao, o MVP deve manter limites claros entre catalogo, carrinho, checkout e pedidos.

## Fora do escopo do MVP
- painel administrativo;
- banco de dados;
- controle real de estoque;
- login de usuario;
- conta de cliente;
- cupons;
- frete dinamico;
- calculo automatico de impostos;
- multiplos meios de pagamento customizados fora do Stripe Checkout.

## Criterios de aceite
- A home mostra os 6 produtos do catalogo inicial.
- O usuario consegue adicionar itens ao carrinho.
- O usuario consegue alterar quantidades e remover itens.
- O backend valida o carrinho e cria uma Stripe Checkout Session.
- O usuario consegue ser redirecionado para o Stripe Checkout em ambiente de teste.
- O webhook Stripe e validado por assinatura no backend.
- Paginas de sucesso e cancelamento funcionam.
- Secrets reais nao aparecem no repositorio.
- CI executa checks de frontend e backend.
- `main` e protegida para receber codigo apenas via pull request.
