# Central de Estudos

Camada de entrada para os ambientes independentes TCE-GO, SEEDF e TJDFT.

> **A Central observa e direciona. Os projetos executam e decidem.**

A Central não importa, altera ou replica o código dos projetos-filhos.

## Estado atual — v4.0

A v4 transforma o catálogo em uma ferramenta operacional sem virar outro dashboard:

- busca local por nome, área e conteúdo do card;
- ordenação por padrão, favoritos ou nome;
- favoritos locais, independentes do foco e da retomada;
- atalhos de desktop `Alt+1..9` para os ambientes visíveis, sem capturar digitação em campos;
- controles touch-friendly e progressive enhancement;
- **Abrir ambiente** permanece a ação principal.

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

## Publicação
GitHub Pages, diretamente da branch `main`.

## Segurança e independência
A Central nunca deve ser requisito para os projetos funcionarem. TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e acessíveis pelas próprias URLs. A Central não escreve nos projetos-filhos e não armazena informação sensível.

## Adicionar um projeto
A fonte dinâmica de verdade é `config/projects.json`. O `index.html` mantém uma cópia mínima dos links para fallback; ao adicionar ambiente, mantenha o fallback coerente e consulte `docs/ARCHITECTURE.md`.

## Governança até v10
A evolução usa `docs/COMMAND-V10.md`, `docs/ROADMAP-V10.md`, `docs/ACCEPTANCE-V10.md`, `docs/AUDIT-PROTOCOL.md`, `docs/V10-CHECKPOINT.md`, `docs/BACKLOG-V10.md` e `CHANGELOG.md`.

Princípio: **o checkpoint manda; o relógio não manda**.
