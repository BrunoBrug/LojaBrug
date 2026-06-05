# Padroes Para Aprender Escala

Estes itens ficam fora do MVP, mas combinam bem com uma evolucao de estudo da LojaBrug.

## Idempotencia

Idempotencia evita processar a mesma operacao duas vezes quando o cliente tenta novamente uma requisicao ou quando a rede falha.

Exemplo bom para a LojaBrug:

- O frontend envia uma chave `Idempotency-Key` ao criar checkout.
- O backend guarda a chave e a resposta criada.
- Se a mesma chave chegar de novo, o backend devolve a mesma resposta em vez de criar outra sessao.

Casos em que isso e util:

- duplo clique no botao de finalizar compra;
- timeout no frontend seguido de retry;
- consumidor de fila processando uma mensagem repetida;
- webhook recebido mais de uma vez.

## Fila Com RabbitMQ

RabbitMQ ajuda a processar tarefas de forma assincrona. Em vez de fazer tudo durante a requisicao HTTP, a API publica uma mensagem e um worker processa depois.

Exemplo bom para a LojaBrug:

- Webhook Stripe confirma pagamento.
- API registra um evento `payment.completed`.
- Worker consome o evento e envia email, baixa estoque ou gera nota.

Casos em que isso e util:

- tarefas lentas;
- integracoes externas instaveis;
- retries controlados;
- absorver picos de muitas compras ao mesmo tempo.

## Rate Limiting Com Redis

Rate limiting limita quantas requisicoes um usuario, IP ou token pode fazer em uma janela de tempo.

Exemplo bom para a LojaBrug:

- limitar `POST /api/checkout` por IP;
- limitar tentativas em futuras rotas de admin;
- reduzir abuso em endpoints publicos.

Redis e uma boa escolha porque consegue contar acessos com baixa latencia e expirar contadores automaticamente.

## CQRS

CQRS significa Command Query Responsibility Segregation. A ideia e separar operacoes de escrita, chamadas de commands, das operacoes de leitura, chamadas de queries.

Em um CRUD simples, o mesmo modelo costuma servir para ler e escrever. Com CQRS, voce pode ter:

- commands para criar pedido, confirmar pagamento e alterar estoque;
- queries para listar produtos, exibir pedidos e montar telas de admin.

Para que serve:

- deixar regras de escrita mais protegidas;
- otimizar consultas sem mexer no fluxo de escrita;
- facilitar auditoria e eventos;
- preparar sistemas com leituras e escritas muito diferentes.

No MVP da LojaBrug, CQRS seria exagero. Para aprender, ele pode entrar quando houver pedidos persistidos, admin e historico de pagamento.

## Precisa De Microsservicos?

Nao. Idempotencia, RabbitMQ, Redis e CQRS podem existir em um monolito Spring Boot bem organizado.

Microsservicos so passam a fazer sentido quando ha necessidade real de separar deploy, escala, ownership ou ciclo de vida de partes do sistema.

Uma evolucao saudavel para estudo:

1. Monolito modular com catalogo, checkout, pedidos e admin.
2. Banco de dados e idempotencia.
3. Redis para rate limiting.
4. RabbitMQ para eventos assincronos.
5. CQRS em pedidos/admin se as leituras ficarem diferentes das escritas.
6. So depois avaliar separar servicos, por exemplo `order-service` e `notification-service`.

Assim voce aprende os padroes sem carregar a complexidade de rede, observabilidade e deploy independente cedo demais.

