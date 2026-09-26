# CHANGELOG — Central de Estudos

## [8.0.0] — 2026-09-26
- linha do tempo local de acessos feitos pela Central, limitada a 12 registros;
- painel técnico reutiliza sinais existentes de disponibilidade, publicação e deploy;
- acesso local e atualização técnica aparecem como fontes distintas;
- diagnóstico evita causas não comprovadas e explicita estados inconclusivos/cache;
- nenhum acesso é tratado como estudo, duração, progresso ou desempenho;
- linha do tempo não cria chamadas de rede adicionais;
- histórico local é sanitizado antes da renderização;
- app shell atualizado para `central-shell-v8.0.0`;
- quality gate v7 passou com os contratos específicos da v8;
- **Projetos-filhos:** zero writes nesta release;
- **Commit de release validado:** `e1b118a502927256029ae855f39d88fb4fd46a9b`;
- **Deploy validado:** workflow run `36279346345` — quality `success` + deploy `success`.

## [7.0.0] — 2026-09-26
- quality gate automatizado e sem dependências externas;
- validação automática de registry, fallback, manifest, assets e contratos PWA;
- testes leves das funções críticas do `app.js` em sandbox Node;
- detecção simples de secrets/tokens no frontend;
- workflow Pages dividido em `quality → deploy`;
- deploy depende explicitamente do sucesso do quality gate;
- testes não usam rede externa nem write nos projetos-filhos;
- `actions/setup-node@v7` com Node 22;
- **Projetos-filhos:** zero writes nesta release;
- **Commit de release validado:** `e47e94341c21219936133762bf3675a0251f4c79`;
- **Deploy validado:** workflow run `36278662494` — quality `success` + deploy `success`.

## [6.0.0] — 2026-09-26
- PWA e resiliência com service worker limitado à origem da Central;
- app shell offline após primeira visita, sem cachear projetos-filhos ou APIs externas;
- estratégia network-first para navegações e recursos conhecidos do shell;
- cache versionado `central-shell-v6.0.0` com limpeza previsível de caches antigos;
- atualização controlada via worker em espera e ação explícita **Atualizar agora**;
- aviso de atualização separado do status geral; primeira instalação não força reload; escopo do worker validado também por pathname;
- instalação permanece opcional e conduzida pelo navegador;
- falha ou remoção do service worker preserva/restaura o comportamento web normal;
- **Acceptance v6:** PASS nos gates estruturais/lógicos verificáveis; inspeção visual/offline em navegador real não foi inventada quando indisponível;
- **Projetos-filhos:** zero writes nesta release; SHAs finais iguais ao preflight;
- **Commit de release validado:** `0c57c967e277764d1938f3a6fc91fc03f73a74e5`;
- **Deploy validado:** workflow run `36277789554` — success.

## [5.0.0] — 2026-09-26
- personalização local sem backend;
- densidade confortável/compacta;
- opção para ocultar detalhes técnicos nos cards sem ocultar o Pulso da Central;
- ordem manual dos ambientes ancorada no registry;
- reset seguro de preferências com preservação do último acesso;
- preferências inválidas degradam para defaults;
- painel de preferências usa progressive enhancement e fica oculto sem JavaScript;
- nenhum dado sensível é armazenado;
- **Projetos-filhos:** zero writes nesta release;
- **Commit de release validado:** `cf8cdb818449d020923f50d63e67689b635abc96`;
- **Deploy validado:** workflow run `36272168251` — success.

## [4.0.0] — 2026-09-26
- catálogo operacional com busca local e ordenação por padrão, favoritos ou nome;
- favoritos persistidos somente no navegador e semanticamente separados de foco/retomada/recência;
- atalhos `Alt+1..9` para cards visíveis, desativados durante digitação em campos;
- controles responsivos/touch-friendly e progressive enhancement preservado;
- ação principal continua sendo abrir o projeto real; fallback estático preservado;
- **Riscos/limitações:** inspeção visual real da URL pública não ficou disponível nesta sessão; QA pós-deploy foi estrutural e pelo artefato/commit publicado;
- **Projetos-filhos:** zero writes; SHAs finais iguais ao preflight;
- **Commit de release validado:** `42ee59a34ebb34ecaa858da77b03646f25c21304`;
- **Deploy validado:** workflow run `36271496568` — success.

## [3.0.0] — 2026-09-26
- observabilidade confiável: disponibilidade, publicação e deploy separados;
- cache de 15 minutos, stale explícito e rate limit tratado;
- origem dos dados explicada; dado técnico não representa estudo;
- projetos-filhos mantidos somente leitura;
- commit de release validado: `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`;
- deploy validado: workflow run `36270559732` — success.

## [2.0.0] — 2026-09-26
- shell consolidada; hierarquia foco → retomada → ambientes → estado técnico;
- armazenamento local defensivo e registry validado antes da renderização;
- modo degradado preserva acessos estáticos;
- projetos-filhos sem writes;
- commit validado `e3cfacdf6e3784ca0236065cf34ac14c2900dd97`; deploy `36264383202` — success.

## [1.4.0] — 2026-09-26
- foco escolhível localmente; foco separado de último acesso; observabilidade pública; deploy validado `36263567239`.

## [1.3.0] — 2026-09-26
- pulso global; disponibilidade; última publicação técnica pública; cache local.

## [1.2.0] — 2026-09-26
- separação entre foco e retomada; experiência de retomada; 404; melhorias mobile.

## [1.1.0] — 2026-09-26
- fallback resiliente; health check; manifest/ícone; acessibilidade.

## [1.0.0] — 2026-09-26
- fundação da Central; registry; navegação inicial; arquitetura desacoplada.
