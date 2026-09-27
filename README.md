# Central de Estudos

Camada de entrada para os ambientes independentes TCE-GO, SEEDF e TJDFT.

> **A Central observa e direciona. Os projetos executam e decidem.**

A Central não importa, altera ou replica o código dos projetos-filhos.

## Estado atual — v14.0

A v14 adiciona roteamento explicável sem decidir pelo usuário.

Evoluções da v14:
- quatro lentes escolhidas explicitamente: **Foco, Retomada, Ações publicadas e Alertas**;
- cada resultado possui **Por que aparece aqui?**;
- quando há vários projetos, a ordem continua sendo a do catálogo;
- a lente selecionada fica apenas neste navegador;
- estado stale aparece como **Último estado conhecido**;
- nenhuma chamada de rede adicional;
- sem ranking, score, prioridade calculada, recomendação automática ou mentor global;
- camada v13/v14 consolidada para manter o shell dentro do orçamento original de 120 KiB.

A v13 continua apresentando na interface o estado operacional autorizado pelos contratos v12.

Evoluções da v13:
- nova seção **Próximas ações publicadas**;
- fase, ciclo e unidade atual exibidos quando publicados;
- próxima ação aparece exatamente como fornecida pelo projeto;
- `operational`, `planned` e `stale-cache` são visualmente distintos;
- o foco humano continua independente do estado operacional;
- alertas públicos do contrato podem ser mostrados;
- estado stale é apresentado como **Último estado conhecido**, nunca como atual;
- a camada v13 não faz chamadas de rede próprias;
- não existe ranking, score, mentor global ou prioridade calculada.

A v12 continua fornecendo contratos operacionais read-only opcionais entre a Central e cada projeto.

Evoluções da v12:
- registry schema v2 com `statusUrl` opcional;
- contrato público versionado em `central-status.json`;
- schema v1 documentado em `docs/STATUS-CONTRACT-V1.md`;
- consumidor com timeout, cache curto e fallback stale;
- contrato inválido/indisponível nunca bloqueia o projeto;
- Diagnóstico informa disponibilidade do contrato sem exibir ainda `nextAction`;
- service worker não intercepta/cacheia contratos dos projetos-filhos;
- TCE-GO, SEEDF e TJDFT publicam somente um arquivo leve autorizado para a Central.

A v11 permanece como a camada PRO/UX sobre a base estável da v10.

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
- PWA network-first, app shell offline e cache `central-shell-v14.0.0` restrito à Central;
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

A Central nunca é requisito para os projetos funcionarem. TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e acessíveis pelas próprias URLs. A Central não escreve em dados internos dos projetos-filhos e não armazena informação sensível. Na v12, cada filho publica explicitamente um único contrato público `central-status.json`, consumido somente em leitura.

## Adicionar um projeto

A fonte dinâmica de verdade é `config/projects.json`. O `index.html` mantém uma cópia mínima dos links para fallback; ao adicionar ambiente, mantenha o fallback coerente e consulte `docs/ARCHITECTURE.md`.

## Governança e auditoria

A evolução até v10 é governada por `docs/COMMAND-V10.md`, `docs/ROADMAP-V10.md`, `docs/ACCEPTANCE-V10.md`, `docs/AUDIT-PROTOCOL.md`, `docs/V10-CHECKPOINT.md`, `docs/BACKLOG-V10.md`, `docs/FINAL-AUDIT-V10.md` e `CHANGELOG.md`.

A v10 é terminal para esta esteira: após validação final, o checkpoint fica `COMPLETE — v10.0.0` e nenhuma v11 é iniciada automaticamente.
