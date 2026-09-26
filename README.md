# Central de Estudos

Camada de entrada para os ambientes independentes TCE-GO, SEEDF e TJDFT.

> **A Central observa e direciona. Os projetos executam e decidem.**

A Central não importa, altera ou replica o código dos projetos-filhos.

## Estado atual — v7.0

A v7 adiciona um quality gate automatizado antes de cada deploy:

- registry, fallback, manifest e referências internas validados automaticamente;
- sintaxe de todos os JavaScripts críticos verificada;
- testes reais de configuração, foco e recuperação de estado local corrompido;
- contratos de PWA/service worker auditados;
- detecção simples de secrets/tokens no frontend;
- workflow dividido em `quality → deploy`;
- qualquer falha no gate impede a publicação;
- testes sem rede externa e sem dependências de escrita nos projetos-filhos.

A v6 continua fornecendo PWA e resiliência sem transformar a Central em dependência dos projetos:

- app shell da própria Central disponível como fallback offline após a primeira visita;
- service worker limitado à origem da Central;
- estratégia network-first conservadora;
- cache explicitamente versionado (`central-shell-v6.0.0`) e limpeza previsível de versões antigas;
- atualização controlada: quando um novo worker estiver pronto, a Central oferece **Atualizar agora**;
- nenhum site, API ou estado dos projetos-filhos é cacheado pelo service worker;
- instalação como app permanece opcional e conduzida pelo navegador;
- falha/ausência de service worker preserva o comportamento web normal.

A personalização local da v5 continua disponível: densidade, detalhes técnicos, ordem manual, reset seguro e preferências somente neste navegador. O catálogo da v4 preserva busca, favoritos, ordenação e atalhos `Alt+1..9`.

Fundação preservada:
- foco atual separado de último acesso/retomada;
- observabilidade técnica separa disponibilidade, publicação e deploy;
- cache local de observabilidade de 15 minutos, stale explícito e rate limit tratado;
- registry único em `config/projects.json`;
- armazenamento local defensivo;
- fallback estático com os três links mesmo sem JavaScript/registry;
- interface mobile-first;
- GitHub Pages automático;
- zero framework e zero etapa de build.

## Offline não significa projetos offline
O cache PWA guarda somente arquivos da Central. TCE-GO, SEEDF e TJDFT continuam sendo ambientes externos independentes e exigem a própria conectividade. A Central nunca deve apresentar um projeto como disponível offline apenas porque sua shell abriu do cache.

## Publicação
GitHub Pages, diretamente da branch `main`.

## Segurança e independência
A Central nunca deve ser requisito para os projetos funcionarem. TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e acessíveis pelas próprias URLs. A Central não escreve nos projetos-filhos e não armazena informação sensível.

## Adicionar um projeto
A fonte dinâmica de verdade é `config/projects.json`. O `index.html` mantém uma cópia mínima dos links para fallback; ao adicionar ambiente, mantenha o fallback coerente e consulte `docs/ARCHITECTURE.md`.

## Governança até v10
A evolução usa `docs/COMMAND-V10.md`, `docs/ROADMAP-V10.md`, `docs/ACCEPTANCE-V10.md`, `docs/AUDIT-PROTOCOL.md`, `docs/V10-CHECKPOINT.md`, `docs/BACKLOG-V10.md` e `CHANGELOG.md`.

Princípio: **o checkpoint manda; o relógio não manda**.
