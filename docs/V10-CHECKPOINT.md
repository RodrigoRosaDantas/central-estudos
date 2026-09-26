# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 7.0.0
- **Meta:** 10.0.0
- **Next major:** 8.0.0
- **Active major:** 8.0.0
- **Stage:** VALIDATING
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36278662494 — quality success + deploy success
- **Commit de release validado:** `e47e94341c21219936133762bf3675a0251f4c79`
- **Repositório:** RodrigoRosaDantas/central-estudos
- **Projetos-filhos:** READ-ONLY / NO WRITES

## Baseline de referência dos projetos-filhos — 2026-09-26
- TCE-GO main: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF main: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT main: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Máquina de estado
- `READY`: pode iniciar Next major.
- `IN_PROGRESS`: continuar a major ativa.
- `VALIDATING`: implementação pronta; faltam gates/deploy.
- `BLOCKED`: corrigir/reconciliar antes de avançar.
- `COMPLETE — v10.0.0`: esteira encerrada.

## Snapshot da major ativa

- **Major:** none
- **Started at:** —
- **Source version:** —
- **Central HEAD inicial:** —
- **Último deploy inicial:** —
- **Child SHAs no início:** —
- **Acceptance aplicável:** —
- **Riscos:** —

## Snapshot da major ativa

- **Major:** 8.0.0 — Linha do tempo e diagnóstico técnico
- **Started at:** 2026-09-26
- **Source version:** 7.0.0
- **Central HEAD inicial:** `109ca8eef75dacf1c697fa958d17ef8d1717c47d`
- **Último deploy inicial:** workflow run `36278739820` — quality success + deploy success — HEAD `109ca8eef75dacf1c697fa958d17ef8d1717c47d`
- **Child SHAs no início:** TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`; SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`; TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`
- **Acceptance aplicável:** linha do tempo separa acesso local de atualização técnica; diagnóstico evita conclusões não suportadas; indisponibilidade tem explicação/fallback; origem de cada dado é identificável; painel permanece resumido; nenhum dado pedagógico inventado; gates globais.
- **Riscos:** confundir acesso com progresso; excesso de métricas; diagnóstico afirmar causa sem evidência; histórico local crescer indefinidamente; dados técnicos stale parecerem atuais; duplicação visual com Pulso da Central.
- **QA v8:** PASS — acesso local e atividade técnica separados; histórico limitado a 12 e exibição a 5; limpeza integrada ao histórico; diagnóstico usa linguagem inconclusiva quando necessário; stale/cache identificado; zero chamadas de rede extras; nomes locais escapados antes de `innerHTML`; app shell inclui assets v8.
- **Pipeline de implementação:** workflow run `36279001125` — quality `success` + deploy `success` no HEAD `c29f19ef22016b87c60913ab2668010de779547a`.
- **Estado da implementação:** concluída; aguardando pipeline final com versão/documentação 8.0.0 e pós-deploy.

## Última major concluída — v7.0.0

- **Origem:** v6.0.0
- **Objetivo:** reduzir regressões com quality gate automatizado antes do deploy.
- **Resultado:** PASS
- **Acceptance v7:** PASS nos gates estruturais/lógicos verificáveis.
- **Registry:** validação automatizada de schema básico, campos, IDs únicos, HTTPS e `defaultProject`.
- **JavaScript crítico:** sintaxe de todos os scripts e testes reais de `validateConfig`, `chooseFocus` e `readLastVisit` em sandbox Node.
- **Fallback/configuração:** referências locais, links diretos, `noscript`, manifest, ícones e app shell validados.
- **PWA:** isolamento externo, cache versionado e contratos de atualização verificados.
- **Segurança:** varredura simples de secrets/tokens no frontend.
- **Workflow:** `quality` roda antes de `deploy`; `deploy needs: quality`; falha do gate impede publicação.
- **Runtime:** `actions/setup-node@v7`, Node 22 e zero dependências npm.
- **Rede:** testes não dependem de rede externa nem de escrita nos projetos-filhos.
- **Quality run:** workflow run `36278662494` — quality `success` + deploy `success`.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Commit validado:** `e47e94341c21219936133762bf3675a0251f4c79`.
- **Limitação registrada:** a suite leve não substitui inspeção visual, acessibilidade profunda, performance, segurança avançada ou teste offline real em navegador.

## Última major concluída — v6.0.0

- **Origem:** v5.0.0
- **Objetivo:** PWA e resiliência sem criar dependência dos projetos-filhos.
- **Resultado:** PASS
- **Acceptance v6:** PASS nos gates estruturais/lógicos verificáveis.
- **Correções finais de resiliência:** aviso de atualização isolado do status geral; botão de update idempotente; primeira instalação sem reload forçado; escopo/pathname do worker defendido explicitamente.
- **Service worker:** restrito à origem da Central e somente a GETs; projetos-filhos e APIs externas não são interceptados.
- **Offline:** app shell usa fallback local; isso não afirma disponibilidade offline dos projetos.
- **Cache:** `central-shell-v6.0.0`, network-first e limpeza de caches antigos com prefixo da Central.
- **Atualização:** worker novo pode aguardar; UI oferece `Atualizar agora`, usa `SKIP_WAITING` e recarrega uma vez em `controllerchange`.
- **Instalação:** opcional, sem prompt próprio obrigatório.
- **Recuperação:** falha/remoção de service worker e caches preserva/restaura a experiência web normal.
- **Manifest:** válido e coerente com escopo/start URL relativos da Central.
- **Fallback:** três acessos diretos continuam presentes no HTML sem depender de JavaScript.
- **Quality gate:** registry JSON válido; IDs únicos; URLs HTTPS; referências críticas presentes; nenhum secret/token adicionado; arquitetura/README coerentes; workflow Pages preservado.
- **Post-deploy QA:** run `36277789554` publicou exatamente o HEAD `0c57c967e277764d1938f3a6fc91fc03f73a74e5`; arquivos críticos foram revalidados na `main`. A URL pública não pôde ser aberta diretamente pela ferramenta web desta execução, portanto nenhuma validação visual/offline real foi inventada.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36277789554` — success.
- **Commit validado:** `0c57c967e277764d1938f3a6fc91fc03f73a74e5`.

## Última major concluída — v5.0.0

- **Origem:** v4.0.0
- **Objetivo:** adaptar a Central ao usuário sem backend.
- **Resultado:** PASS
- **Acceptance v5:** PASS nos gates estruturais/lógicos verificáveis.
- **Densidade:** confortável ou compacta.
- **Apresentação:** detalhes técnicos dos cards podem ser ocultados sem remover o Pulso da Central.
- **Ordem:** manual, persistida localmente e ancorada na ordem canônica do registry.
- **Reset:** restaura foco, favoritos, ordem, sort, densidade e apresentação; preserva o último acesso.
- **Preferências inválidas:** são limpas e retornam a defaults seguros.
- **Persistência:** somente localStorage; nenhum dado sensível; falha de persistência não bloqueia navegação.
- **Progressive enhancement:** painel de preferências oculto sem JavaScript.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36272168251` — success.
- **Commit validado:** `cf8cdb818449d020923f50d63e67689b635abc96`.

## Última major concluída — v4.0.0

- **Origem:** v3.0.0
- **Objetivo:** transformar o catálogo em uma camada operacional simples e escalável.
- **Resultado:** PASS
- **Acceptance v4:** PASS nos gates estruturais/lógicos verificáveis.
- **Busca:** local por nome, descrição/área e fase.
- **Favoritos/ordenação:** somente locais; não alteram registry.
- **Separação semântica:** foco, retomada, favorito e recência técnica permanecem independentes.
- **Atalhos:** Alt+1..9 apenas para cards visíveis e sem capturar campos editáveis.
- **Progressive enhancement:** controles do catálogo permanecem ocultos sem JavaScript.
- **Escalabilidade:** IDs do catálogo usam `data-project-id` vindo do registry, sem hardcode dos três projetos atuais.
- **Ação principal:** Abrir ambiente preservada.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36271401822` — success.
- **Commit validado:** `e9b7d5e3cc0a9e0dc5294244912d9674baef67db`.

## Última major concluída — v3.0.0
- **Origem:** v2.0.0
- **Objetivo:** observabilidade técnica confiável e explicável.
- **Resultado:** PASS
- **Deploy:** workflow run `36270559732` — success.
- **Commit validado:** `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`.

## Histórico de majors
- 2026-09-26 — v2.0.0 — fundação consolidada — commit `e3cfacdf6e3784ca0236065cf34ac14c2900dd97` — Pages `36264383202` — success
- 2026-09-26 — v3.0.0 — observabilidade confiável — commit `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c` — Pages `36270559732` — success
- 2026-09-26 — v4.0.0 — catálogo operacional — commit `42ee59a34ebb34ecaa858da77b03646f25c21304` — Pages `36271496568` — success
- 2026-09-26 — v5.0.0 — personalização local — commit `cf8cdb818449d020923f50d63e67689b635abc96` — Pages `36272168251` — success
- 2026-09-26 — v6.0.0 — PWA e resiliência — commit `0c57c967e277764d1938f3a6fc91fc03f73a74e5` — Pages `36277789554` — success
- 2026-09-26 — v7.0.0 — qualidade e testes — commit `e47e94341c21219936133762bf3675a0251f4c79` — Pages `36278662494` — quality success + deploy success

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
