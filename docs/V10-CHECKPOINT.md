# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 9.0.0
- **Meta:** 10.0.0
- **Next major:** 10.0.0
- **Active major:** none
- **Stage:** READY
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36280042225 — quality success + deploy success
- **Commit de release validado:** `5a243c24447c39eaaae85fd8183e599be5ac9c81`
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

## Última major concluída — v9.0.0

- **Origem:** v8.0.0
- **Objetivo:** hardening antes da auditoria final v10.
- **Resultado:** PASS
- **Acceptance v9:** PASS nos gates estruturais/lógicos verificáveis.
- **Acessibilidade:** skip link, foco visível, relações de controle, atalhos protegidos durante digitação, touch targets, forced-colors e contraste automatizado dos tokens críticos >= 4.5:1.
- **Mobile:** auditoria estrutural cobre 360/419/480/680/720/760 px; hardening adicional de largura, padding e quebra de texto em 360 px.
- **Segurança frontend:** CSP, IDs seguros no registry, default válido, versão semântica, URLs normalizadas e conteúdo dinâmico/local escapado antes de `innerHTML`.
- **Rede:** metadata GitHub mantém cache de 15 min; health usa cache curto de 2 min; offline evita nova checagem; deploy lookup usa workflow alvo com `per_page=1` e fallback máximo 30.
- **Performance:** shell bruto auditado em 91.658 bytes; quality gate impõe orçamento <= 120 KiB; zero dependências externas de JS/CSS.
- **Código:** zero JS/CSS órfãos e zero funções nomeadas mortas detectadas na auditoria estática.
- **PWA:** cache atualizado para `central-shell-v9.0.0`.
- **Edge cases:** documentados em `docs/HARDENING-V9.md`.
- **Quality gate:** workflow run `36280042225` — quality `success` + deploy `success`.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Commit validado:** `5a243c24447c39eaaae85fd8183e599be5ac9c81`.
- **Limitação registrada:** inspeção visual real em navegador não foi inventada; auditorias de mobile/contraste foram estruturais e automatizadas onde disponível.

## Última major concluída — v8.0.0

- **Origem:** v7.0.0
- **Objetivo:** adicionar linha do tempo e diagnóstico técnico sem assumir lógica pedagógica.
- **Resultado:** PASS
- **Acceptance v8:** PASS nos gates estruturais/lógicos verificáveis.
- **Acesso local:** histórico próprio em `localStorage`, limitado a 12 registros e exibição de 5, integrado a **Limpar histórico**.
- **Separação de fontes:** acesso local, publicação técnica, disponibilidade e deploy permanecem semanticamente distintos.
- **Atividade técnica:** reutiliza os sinais da observabilidade existente; zero chamadas de rede adicionais.
- **Diagnóstico:** linguagem conservadora, com estados inconclusivos e sem atribuição de causa não comprovada.
- **Stale/cache:** condição explicitamente indicada quando metadados podem estar desatualizados.
- **Sem inferência pedagógica:** acesso não é tratado como estudo, duração, progresso ou desempenho.
- **Segurança local:** nomes vindos do histórico local são escapados antes de renderização em HTML.
- **PWA:** app shell atualizado para `central-shell-v8.0.0` com os novos assets.
- **Quality gate:** contratos específicos da v8 adicionados a `tests/quality.mjs`.
- **Incidente de pipeline:** um run intermediário ficou preso; o checkpoint foi temporariamente marcado `BLOCKED`. O push de proteção destravou a concorrência, cancelou os runs obsoletos e o pipeline final concluiu normalmente.
- **Pipeline final:** workflow run `36279346345` — quality `success` + deploy `success`.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Commit validado:** `e1b118a502927256029ae855f39d88fb4fd46a9b`.
- **Limitação registrada:** inspeção visual real em navegador não foi inventada; validação visual ficou restrita ao que as ferramentas permitiram verificar estruturalmente.

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
- 2026-09-26 — v8.0.0 — linha do tempo e diagnóstico — commit `e1b118a502927256029ae855f39d88fb4fd46a9b` — Pages `36279346345` — quality success + deploy success
- 2026-09-26 — v9.0.0 — hardening — commit `5a243c24447c39eaaae85fd8183e599be5ac9c81` — Pages `36280042225` — quality success + deploy success

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
