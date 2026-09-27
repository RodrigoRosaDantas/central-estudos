# CHANGELOG — Central de Estudos

## [12.0.0] — 2026-09-27
- registry atualizado para schema v2 com `statusUrl`;
- contrato público de estado operacional v1 definido e documentado;
- TCE-GO, SEEDF e TJDFT publicam `public/central-status.json`;
- consumidor read-only com GET, timeout de 3,5 s e cache de 5 min;
- ID/schema/estrutura do contrato validados antes do uso;
- graceful degradation para unavailable/invalid/stale-cache;
- Diagnóstico passa a indicar disponibilidade do contrato operacional;
- Visão Agora ainda não usa `nextAction` ou `currentUnit` — reservado à v13;
- service worker não cacheia contratos dos filhos;
- cache da Central atualizado para `central-shell-v12.0.0`;
- **Writes autorizados nos filhos:** somente `public/central-status.json`;
- **Commit de release validado:** `554063372968b6e128ccf7dc70d22f14b564bd1a`;
- **Deploy validado:** workflow run `36285194809` — quality `success` + deploy `success`.

## [11.0.0] — 2026-09-27
- nova geração da Central iniciada após o fechamento terminal da v10;
- adicionada **Visão Agora** com foco, retomada e catálogo;
- navegação principal: Agora, Projetos, Atividade e Diagnóstico;
- navegação sticky no desktop e inferior fixa no mobile;
- integração baseada em eventos locais, sem polling;
- zero chamadas de rede adicionais na camada v11;
- dados técnicos mantidos como camada secundária;
- nenhuma próxima ação pedagógica, progresso ou desempenho é inventado;
- novos assets `pro-v11.css` e `pro-v11.js` incluídos no app shell;
- cache PWA atualizado para `central-shell-v11.0.0`;
- quality gate cobre os contratos específicos da v11;
- **Projetos-filhos:** somente leitura; zero writes;
- **Commit de release validado:** `7090e201e82192fd53703f5d5e35637f20bbf5f7`;
- **Deploy validado:** workflow run `36284442637` — quality `success` + deploy `success`.

## [10.0.0] — 2026-09-26
- release estável terminal da esteira v10;
- auditoria integral registrada em `docs/FINAL-AUDIT-V10.md`;
- documentação consolidada e arquitetura congelada para esta esteira;
- registry atualizado para `10.0.0`;
- cache PWA rotacionado para `central-shell-v10.0.0`;
- preservados fallback, progressive enhancement, mobile-first, observabilidade não bloqueante e separação entre foco/retomada/favorito/acesso/recência técnica;
- quality gate continua obrigatório antes do deploy;
- nenhuma responsabilidade pedagógica global ou acoplamento obrigatório foi introduzido;
- auditoria terminal: PASS estrutural/automatizado, com limitação explícita de ausência de inspeção visual interativa real;
- **Projetos-filhos:** somente leitura; zero writes nesta esteira; SHAs finais confirmados: TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`, SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`, TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`;
- **Commit de release validado:** `f19cb013b2dfaf20cfc4febb00ab677a79741fd0`;
- **Workflow/deploy final da release:** Pages `36283643314` — `quality: success` + `deploy: success`;
- **Estado terminal:** `COMPLETE — v10.0.0`; nenhuma v11 iniciada automaticamente.

## [9.0.0] — 2026-09-26
- hardening de segurança, acessibilidade, mobile, rede e performance;
- CSP, escape de conteúdo, registry endurecido, health cache curto e deploy lookup direcionado;
- contraste crítico, teclado, forced-colors, touch targets e larguras 360/419/480/680/720/760 auditados;
- shell 91.658 bytes com orçamento <= 120 KiB; zero JS/CSS órfãos e funções nomeadas mortas detectadas;
- cache `central-shell-v9.0.0`;
- commit validado `5a243c24447c39eaaae85fd8183e599be5ac9c81`; Pages `36280042225` — success; zero writes nos filhos.

## [8.0.0] — 2026-09-26
- linha do tempo local limitada e diagnóstico técnico conservador;
- acesso local separado de atividade técnica/disponibilidade/deploy;
- nenhuma inferência de estudo, duração, progresso ou desempenho;
- cache `central-shell-v8.0.0`;
- commit `e1b118a502927256029ae855f39d88fb4fd46a9b`; Pages `36279346345` — success; zero writes nos filhos.

## [7.0.0] — 2026-09-26
- quality gate automatizado, determinístico e sem rede externa;
- validação de registry, fallback, manifest, PWA, secrets e funções críticas;
- workflow `quality → deploy`, com falha de teste impedindo publicação;
- commit `e47e94341c21219936133762bf3675a0251f4c79`; Pages `36278662494` — success; zero writes nos filhos.

## [6.0.0] — 2026-09-26
- PWA e resiliência com service worker restrito à Central;
- app shell offline, network-first, cache versionado e atualização controlada;
- projetos/APIs externas fora do cache; instalação opcional;
- commit `0c57c967e277764d1938f3a6fc91fc03f73a74e5`; Pages `36277789554` — success; zero writes nos filhos.

## [5.0.0] — 2026-09-26
- personalização local: densidade, detalhes, ordem manual e reset seguro;
- preferências inválidas degradam para defaults; nenhum dado sensível;
- commit `cf8cdb818449d020923f50d63e67689b635abc96`; Pages `36272168251` — success; zero writes nos filhos.

## [4.0.0] — 2026-09-26
- catálogo com busca, favoritos, ordenação e atalhos `Alt+1..9`;
- foco, retomada, favorito e recência permanecem distintos;
- commit `42ee59a34ebb34ecaa858da77b03646f25c21304`; Pages `36271496568` — success; zero writes nos filhos.

## [3.0.0] — 2026-09-26
- observabilidade confiável: disponibilidade, publicação e deploy separados;
- cache/stale/rate limit tratados; dado técnico não representa estudo;
- commit `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`; Pages `36270559732` — success; zero writes nos filhos.

## [2.0.0] — 2026-09-26
- shell consolidada, armazenamento local defensivo, fallback/404 e hierarquia operacional;
- commit `e3cfacdf6e3784ca0236065cf34ac14c2900dd97`; Pages `36264383202` — success; zero writes nos filhos.

## Série 1.x — 2026-09-26
- v1.4: foco local e deploy validado;
- v1.3: pulso global, disponibilidade e publicação técnica;
- v1.2: separação foco/retomada e 404;
- v1.1: fallback, health check, manifest e acessibilidade;
- v1.0: fundação, registry, navegação e arquitetura desacoplada.
