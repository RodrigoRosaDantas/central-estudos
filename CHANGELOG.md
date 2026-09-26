# CHANGELOG — Central de Estudos

## [10.0.0] — 2026-09-26
- release estável terminal da esteira v10;
- auditoria integral registrada em `docs/FINAL-AUDIT-V10.md`;
- documentação consolidada e arquitetura congelada para esta esteira;
- registry atualizado para `10.0.0`;
- cache PWA rotacionado para `central-shell-v10.0.0`;
- preservados fallback, progressive enhancement, mobile-first, observabilidade não bloqueante e separação entre foco/retomada/favorito/acesso/recência técnica;
- quality gate continua obrigatório antes do deploy;
- nenhuma responsabilidade pedagógica global ou acoplamento obrigatório foi introduzido;
- **Projetos-filhos:** somente leitura; zero writes durante a implementação; SHAs devem ser reconfirmados no fechamento;
- **Commit/deploy final:** pendentes de fechamento após quality + deploy + post-deploy QA.

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
