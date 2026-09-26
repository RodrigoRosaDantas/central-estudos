# Central de Estudos

Camada de entrada para os ambientes independentes de estudo:

- TCE-GO
- SEEDF
- TJDFT

## Princípio arquitetural

> A Central observa e direciona. Os projetos executam e decidem.

A Central **não importa, altera ou replica** o código dos projetos-filhos.

## Estado atual — v3.0

- observabilidade técnica consolidada em v3.0;
- publicação técnica, disponibilidade e deploy tratados como dados distintos;
- cache local de observabilidade de 15 minutos;
- fallback stale-cache quando a API pública falha;
- tratamento explícito de rate limit da API do GitHub;
- descoberta de deploy público com preferência por `deploy-pages.yml`;
- explicação da origem dos dados e separação explícita entre dado técnico e estudo;
- fundação de produto consolidada em v2.0;
- hierarquia principal: foco → retomada → ambientes → estado técnico;
- camada de armazenamento local tolerante a indisponibilidade/corrupção;
- validação defensiva do registry antes da renderização;
- modo degradado explícito quando a camada dinâmica falha;
- interface mobile-first;
- foco atual separado de último acesso;
- foco selecionável pelo usuário e salvo apenas neste aparelho;
- pulso global de disponibilidade dos ambientes;
- leitura pública da última publicação de cada repositório, com cache local de 15 minutos;
- retomada real do último ambiente aberto;
- saudação contextual pelo horário do aparelho;
- registro único de projetos em `config/projects.json`;
- histórico local com projeto + data/hora;
- health check informativo, com timeout e estado inconclusivo;
- fallback estático: os três projetos continuam acessíveis mesmo se JavaScript ou o registry falharem;
- identidade visual sutil por ambiente;
- acessibilidade de teclado e preferência por movimento reduzido;
- manifest + ícone para uso como atalho no celular;
- workflow explícito de GitHub Pages;
- zero framework, zero dependências e zero etapa de build.

## Publicação

GitHub Pages, diretamente da branch `main`.

## Regra de segurança

A Central nunca deve ser requisito para os projetos funcionarem.

TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e devem continuar acessíveis pelas URLs próprias.

## Adicionar um novo projeto

A fonte dinâmica de verdade é `config/projects.json`.

O `index.html` contém apenas uma cópia mínima dos links para fallback de segurança. Ao adicionar um novo projeto, mantenha o fallback coerente.

Consulte `docs/ARCHITECTURE.md` antes de introduzir integrações.


<!-- deploy-trigger: 2026-09-26 -->


## Governança da evolução até v10

A esteira autônoma usa:

- `docs/COMMAND-V10.md` — protocolo mestre;
- `docs/ROADMAP-V10.md` — objetivo de cada major;
- `docs/ACCEPTANCE-V10.md` — critérios de aceite;
- `docs/AUDIT-PROTOCOL.md` — preflight, QA, deploy e rollback;
- `docs/V10-CHECKPOINT.md` — máquina de estado;
- `docs/BACKLOG-V10.md` — ideias fora de escopo;
- `CHANGELOG.md` — histórico das releases.

Princípio: **o checkpoint manda; o relógio não manda**. Uma execução nunca pula para a próxima major se a atual estiver incompleta.
