# Roteamento explicável — v14

A v14 organiza sinais já conhecidos sem transformar a Central em um recomendador.

## Lentes

O usuário escolhe explicitamente uma das quatro lentes:

- **Foco** — mostra somente o projeto que o usuário definiu como foco;
- **Retomada** — mostra somente o último ambiente aberto pela Central neste navegador;
- **Ações publicadas** — mostra projetos cujo contrato v12 publicou `nextAction`;
- **Alertas** — mostra projetos cujo contrato publicou alertas.

A lente selecionada é armazenada apenas localmente em `central-estudos:route-lens-v14`.

## Ordem

Quando uma lente retorna mais de um projeto, a ordem é a do catálogo. Não existe:

- score;
- ranking;
- prioridade calculada;
- recomendação automática;
- “melhor projeto”;
- mentor global.

## Explicabilidade

Cada item possui **Por que aparece aqui?**.

A explicação deriva somente da lente escolhida:

- foco definido pelo usuário;
- último acesso local;
- próxima ação publicada pelo projeto;
- alerta publicado pelo projeto.

## Dados stale

Quando uma ação vem de `stale-cache`, ela aparece como **Último estado conhecido**. Não é apresentada como estado atual.

## Rede e arquitetura

A v14 não faz novas chamadas de rede. Ela reutiliza:

- foco/retomada já mantidos pela Central;
- eventos locais;
- contratos já validados pela v12.

A implementação foi consolidada na mesma camada `operational-v13.js`/CSS para evitar duplicação e manter o shell dentro do orçamento de 120 KiB.
