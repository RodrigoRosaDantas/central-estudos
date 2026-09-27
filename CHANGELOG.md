# CHANGELOG — Central de Estudos

## [24.0.0] - 2026-09-27

### Changed
- Navegação principal organizada em seis telas: Hoje, Retomada, Projetos, Inbox, Histórico e Evolução.
- Retomada mostra foco escolhido e último acesso em cartões separados, com rótulos que não sugerem progresso de estudo.
- Projetos reúne os acessos rápidos e o Workspace de concursos.
- Inbox recebe filtros próprios por tipo e projeto; Radar preserva o conjunto de contratos válidos sem filtros da Inbox.
- Views nomeadas passam a lembrar a tela; registros antigos sem `screen` abrem em Hoje.
- Atalhos antigos continuam levando à tela correspondente.
- Scripts do shell minificados em UTF-8 para fechar abaixo do teto histórico de 128 KiB; teste de payload permanece estrito.
- Service worker atualizado para `central-shell-v24.0.0`.

### Preserved
- Leitura somente dos projetos-filhos e dos contratos publicados.
- Nenhuma chamada de rede adicional, gravação externa, pontuação ou progresso inferido.
- Fallback sem JavaScript e links diretos para os ambientes.
- **Release validada:** commit `01ccefa385f306c13c86e736e6d9a7a49d16adb4`; workflow `36358103801` — Quality + Deploy SUCCESS; artefato Pages `10943764161`, digest `sha256:beae227ecac1214edbd9f6872701e019adfe2b9dabd422b80779705d8ae8f427`; payload do shell 120.555 / 131.072 bytes.
- **QA pós-deploy:** seis telas, navegação por hash, anterior/seguinte e atualização verificados no desktop; viewport móvel real não inspecionado visualmente.

## [23.0.0] - 2026-09-27

### Changed
- “Agora” evolui para **Hoje**, com foco e ação publicada como centro da abertura.
- “Evolução dos projetos” evolui para **Radar operacional**.
- “Como entrar” evolui para **Mentor de execução** com as lentes já confiáveis.
- Ausência de próxima ação passa a ser declarada explicitamente, sem inferência.
- Command Palette ganha acesso direto ao Mentor.
- Atalhos da Home priorizam Mentor, Acessos e Histórico.

### Preserved
- Foco continua definido pelo usuário.
- Radar e Mentor não ranqueiam, pontuam ou trocam prioridade.
- Contratos e projetos-filhos permanecem read-only.

## [22.0.0] - 2026-09-27

### Changed
- Nova Home **Centro de Comando**, com referência visual no TDAS.
- Foco, fase, saúde, evolução, ação publicada e retomada no mesmo contexto.
- Relógio, diretriz, atalhos e navegação inferior refinados para mobile.
- Paleta teal/violeta sobre superfícies escuras.

### Preserved
- Contratos read-only, provenance, Inbox, Views, histórico, preferências, PWA, fallback e links diretos.
- Zero writes nos projetos-filhos e zero progresso/ranking inferido.

## [21.0.0] — 2026-09-27
- nova recepção visual com frase original de incentivo estável por dia de Brasília;
- saudação separada do relógio, com hora/minuto, dia da semana e data por extenso;
- relógio e frase recalculados a cada minuto e ao retornar à aba;
- estilos obsoletos de cartões removidos e shell mantido em 130.650 bytes / 131.072 bytes;
- regressões v10→v20 e comportamento do relógio/frase verificados por quality gate;
- projetos-filhos permanecem READ-ONLY e sem writes.
- **Release:** `418231a98699a52b07bdce6d94d6d00a3c1e01bd`; workflow `36346724227` — quality + deploy SUCCESS.
- **Artefato:** `10941231310`, digest `sha256:c56665778704a12a0823ddb07e58e1a8925b3ecf25af10a9565c9d5a8eccfb80`.
- **QA:** desktop PASS; inspeção visual mobile em viewport real não executada.


## [20.0.0] — 2026-09-27
- auditoria terminal integral da geração v16→v20;
- regressões v10/v15 e contratos v16→v19 revalidados;
- mobile/teclado/a11y/offline auditados estruturalmente pelo gate existente;
- segurança, PWA, registry, documentação e independência consolidados;
- nenhum novo recurso funcional adicionado ao shell;
- zero writes em TCE-GO, SEEDF e TJDFT;
- app shell rotacionado para `central-shell-v20.0.0`;
- auditoria terminal documentada em `docs/FINAL-AUDIT-V20.md`.
- **Commit terminal validado:** `8980ec3de229b85722556d5a9bc2ecc185965476`;
- **Workflow terminal validado:** `36332111657` — quality `success` + deploy `success`;
- **Artefato Pages:** `10935679416`, shell 130.983 bytes <= 131.072 bytes;
- **Estado terminal:** COMPLETE; nenhuma v21 definida.


- **Manutenção UX pós-terminal:** horário de Brasília no cabeçalho, rótulos de navegação mais claros, “Opções da Central” e evolução confiável dos projetos baseada nos contratos publicados.
- **Hotfix UX validado:** commit `6692cfc6361a712131bb34f36ee3899413cd0607`, workflow `36333688144`, shell 130.973 bytes.

- **Polimento UX v20:** botão Opções no cabeçalho, data/horário de Brasília atualizados a cada minuto, contagem de projetos acompanhados e navegação consolidada em 5 colunas.
- **Validação:** commit `9d04c2efef0a78622333929e53f2a85f19dc0b18`, workflow `36336455463`, artefato `10937705227`, shell 130.771 bytes.
- **Home mobile simplificada:** remove duplicações de foco/retomada, adota rótulos Acessos/Histórico e prioriza Evolução antes de “Como entrar”.
- **Atualização operacional global:** botão `Atualizar tudo` reaproveita refresh read-only dos contratos, sem fetch na camada de apresentação.
- **Validação:** commit `9f4ab37745c85b23908fa29acedbabebbea34034`, workflow `36337115700`, artefato `10936824711`, shell 130.989 bytes.
- **Manutenção UX — foco, retomada e evolução:** foco e último ambiente aberto agora aparecem uma única vez em “Agora”; a retomada informa último acesso sem sugerir aula exata ou progresso.
- **Validação funcional:** commit `fa47c154cbf377c55c006869c23ab1794357b373`, workflow `36339824154` — quality SUCCESS + deploy SUCCESS; artefato `10937469381`, digest `sha256:f765d120cfce8983a349ca13ee3a4b23c95cd76cc30e91af22078b4af7d9b140`; shell 130.229 bytes.

## [19.0.0] — 2026-09-27
- Views locais nomeadas e limitadas a 8 por navegador;
- snapshots restritos a aba do Workspace, lente e filtros da Inbox;
- salvar/aplicar/restaurar via Command Palette existente;
- filtros da Inbox persistidos localmente para compor views;
- foco, retomada, favoritos, histórico, contratos e caches ficam fora das views;
- views/filtros adicionados explicitamente à allowlist do backup de preferências;
- zero backend, zero fetch novo e zero writes externos;
- compactação semântica de módulos existentes para manter o teto de 128 KiB;
- app shell preparado para `central-shell-v19.0.0`;
- shell funcional auditado em 130.983 bytes <= 131.072 bytes.
- **Commit de release validado:** `de8881589d8103c4b114f9cba7356a2559148b6b`;
- **Deploy validado:** workflow `36331287103` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10935921078` — PASS.


## [18.0.0] — 2026-09-27
- provenance e frescor explícitos na Inbox operacional;
- idade descritiva de contrato e fonte publicada;
- `source.kind`, `source.ref`, `source.status` e schema compatível visíveis;
- refresh manual por projeto via evento local, reutilizando GET read-only/timeout/validação/cache;
- refresh simultâneo deduplicado; zero polling;
- apresentação continua sem `fetch` e sem inferência causal baseada em idade;
- fallback/no-JS, mobile, links diretos, foco/retomada e contratos stale preservados;
- zero writes nos projetos externos;
- app shell rotacionado para `central-shell-v18.0.0`;
- shell funcional auditado em 130.986 bytes <= 131.072 bytes.
- **Commit de release validado:** `4f6c02c08045eb3a2022953f50af7c54dd0606a4`;
- **Deploy validado:** workflow `36330175487` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10935502046` — PASS.


## [17.0.0] — 2026-09-27
- Inbox operacional consolidando ações publicadas e alertas dos contratos read-only;
- filtros por Tudo / Ações / Alertas e por projeto;
- provenance explícita para contrato publicado, cache recente e cache antigo;
- estado stale separado como **Último estado**;
- ordem de catálogo preservada, sem ranking, score ou prioridade calculada;
- camada operacional sem chamadas de rede próprias;
- fallback/no-JS, mobile-first, links diretos e independência dos projetos preservados;
- quality gate recebeu contrato específico da v17 e coerência de cache baseada na versão do registry;
- app shell rotacionado para `central-shell-v17.0.0`;
- projetos externos permanecem read-only; zero writes.
- **Commit de release validado:** `1dad7e93f708dd9fdb6361d1da6e65c7687cef64`;
- **Deploy validado:** workflow `36329426775` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10934629623` — PASS; shell 130.106 bytes <= 128 KiB.


## [16.0.0] — 2026-09-27
- nova roadmap **Workspace PRO v16→v20** iniciada;
- Command Palette com Ctrl/⌘+K;
- botão flutuante para acesso por toque/mobile;
- busca projetos ativos, arquivados e futuros;
- navegação rápida entre Agora, Projetos, Workspace, Atividade e Diagnóstico;
- ações rápidas para foco e retomada;
- teclado ↑/↓/Enter/Escape e semântica de opções;
- zero chamadas de rede adicionais;
- zero writes em projetos externos;
- cache atualizado para `central-shell-v16.0.0`;
- orçamento da nova geração definido em 128 KiB;
- **Pipeline de implementação:** `36312740627` — quality success + deploy success;
- **Commit de release validado:** `cfbac82a6bc1b9d924ef5b34f5f40884deb3be38`;
- **Deploy validado:** workflow run `36312910219` — quality `success` + deploy `success`.

## [15.0.0] — 2026-09-27
- Workspace de concursos com lifecycle `active / archived / future`;
- TCE-GO, SEEDF e TJDFT permanecem ativos;
- SEDES/DF — TDAS adicionado como primeiro histórico arquivado, com Pages verificado;
- arquivados/futuros ficam fora de foco, retomada e observabilidade ativa;
- nova navegação para **Workspace** e filtros Ativos / Arquivados / Futuros;
- exportação/importação de preferências com allowlist explícita e limite de 64 KB;
- backup exclui último acesso, histórico e caches técnicos/operacionais;
- registry atualizado para schema v3;
- app shell rotacionado para `central-shell-v15.0.0`;
- shell final auditado em 122.134 bytes <= 120 KiB (122.880 bytes);
- **Projetos externos:** zero writes durante a v15;
- **Commit de produto validado:** `e70063822dd0185fcade890aa4320b37c03a5315`;
- **Deploy validado:** workflow run `36287841226` — quality `success` + deploy `success`.

## [14.0.0] — 2026-09-27
- roteamento explicável por lentes escolhidas pelo usuário;
- lentes: Foco, Retomada, Ações publicadas e Alertas;
- cada resultado explica por que aparece;
- múltiplos resultados preservam a ordem do catálogo;
- estado stale mostrado como **Último estado conhecido**;
- lente local persistida sem backend;
- zero chamadas de rede adicionais;
- sem ranking, score, prioridade calculada ou recomendação automática;
- camada v13/v14 consolidada para evitar duplicação;
- shell mantido dentro do orçamento de 120 KiB sem aumentar o limite;
- app shell atualizado para `central-shell-v14.0.0`;
- **Projetos-filhos:** read-only; zero writes;
- **Commit de release validado:** `589ae593d2ab9107555760dc6e6c5e57851a619d`;
- **Deploy validado:** workflow run `36286790166` — quality `success` + deploy `success`.

## [13.0.0] — 2026-09-27
- estado operacional dos contratos v12 passa a ser apresentado na interface;
- nova seção **Próximas ações publicadas**;
- fase, ciclo, unidade atual, próxima ação e alertas exibidos quando publicados;
- ações `operational` e `planned` recebem rótulos distintos;
- stale cache é mostrado como **Último estado conhecido**;
- foco escolhido pelo usuário permanece independente do estado operacional;
- camada v13 sem chamadas de rede próprias;
- sem ranking, score, prioridade calculada ou mentor global;
- novos assets `operational-v13.css` e `operational-v13.js`;
- app shell atualizado para `central-shell-v13.0.0`;
- **Projetos-filhos:** read-only nesta major; zero writes;
- **Commit de release validado:** `83696d8471fc24c84fdb72c965bcffd5a2fa58ea`;
- **Deploy validado:** workflow run `36285904184` — quality `success` + deploy `success`.

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
