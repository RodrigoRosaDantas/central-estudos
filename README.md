# Central de Estudos

Camada de entrada para os ambientes independentes TCE-GO, SEEDF e TJDFT.

> **A Central observa e direciona. Os projetos executam e decidem.**

A Central não importa, altera ou replica o código dos projetos-filhos.

## Estado atual — v11.0

A v11 inicia uma nova geração sobre a base estável da v10.

Evoluções da v11:
- **Visão Agora** com foco, retomada e quantidade de ambientes;
- navegação direta entre **Agora, Projetos, Atividade e Diagnóstico**;
- navegação fixa no mobile e sticky no desktop;
- foco e retomada atualizam a Visão Agora por eventos locais, sem polling;
- nenhum dado pedagógico é inferido ou inventado;
- informação técnica continua disponível, mas fica visualmente secundária;
- zero chamadas de rede adicionais na camada v11;
- nova esteira documentada em `docs/ROADMAP-V15.md` e `docs/V15-CHECKPOINT.md`.

A v10 permanece registrada como baseline estável e auditada em `docs/FINAL-AUDIT-V10.md`.

Capacidades consolidadas:

- shell mobile-first com fallback estático e 404 própria;
- foco atual separado de último acesso/retomada;
- catálogo com busca, favoritos, ordenação e atalhos locais;
- personalização local reversível, sem backend e sem dados sensíveis;
- observabilidade somente leitura, não bloqueante, com disponibilidade, publicação técnica e deploy separados;
- falhas de rede/rate limit tratadas sem falso estado offline;
- linha do tempo local de acessos separada de atividade técnica e sem inferência pedagógica;
- PWA network-first, app shell offline e cache `central-shell-v11.0.0` restrito à Central;
- quality gate automatizado antes de todo deploy;
- CSP, escape de conteúdo, HTTPS, contraste, teclado, forced colors e touch targets auditados;
- orçamento de shell <= 120 KiB e zero dependências externas de JS/CSS;
- registry único em `config/projects.json`;
- GitHub Pages automático após quality gate;
- zero framework e zero etapa de build.

## Offline não significa projetos offline

O cache PWA guarda somente arquivos da Central. TCE-GO, SEEDF e TJDFT continuam ambientes externos independentes e exigem a própria conectividade. A Central nunca apresenta um projeto como disponível offline apenas porque sua shell abriu do cache.

## Separação de conceitos

**Foco**, **retomada/último acesso**, **favorito**, **acesso local**, **recência técnica**, **disponibilidade** e **deploy** são sinais distintos. Commit ou acesso não é interpretado como estudo, duração, progresso ou desempenho.

## Publicação

GitHub Pages, diretamente da branch `main`. O workflow executa `quality` antes de `deploy`; falha no gate impede publicação.

## Segurança e independência

A Central nunca é requisito para os projetos funcionarem. TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e acessíveis pelas próprias URLs. A Central não escreve nos projetos-filhos e não armazena informação sensível.

## Adicionar um projeto

A fonte dinâmica de verdade é `config/projects.json`. O `index.html` mantém uma cópia mínima dos links para fallback; ao adicionar ambiente, mantenha o fallback coerente e consulte `docs/ARCHITECTURE.md`.

## Governança e auditoria

A evolução até v10 é governada por `docs/COMMAND-V10.md`, `docs/ROADMAP-V10.md`, `docs/ACCEPTANCE-V10.md`, `docs/AUDIT-PROTOCOL.md`, `docs/V10-CHECKPOINT.md`, `docs/BACKLOG-V10.md`, `docs/FINAL-AUDIT-V10.md` e `CHANGELOG.md`.

A v10 é terminal para esta esteira: após validação final, o checkpoint fica `COMPLETE — v10.0.0` e nenhuma v11 é iniciada automaticamente.
