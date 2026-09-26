# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 6.0.0
- **Meta:** 10.0.0
- **Next major:** 7.0.0
- **Active major:** 7.0.0
- **Stage:** VALIDATING
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36277789554 — success
- **Commit de release validado:** `0c57c967e277764d1938f3a6fc91fc03f73a74e5`
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

- **Major:** 7.0.0 — Qualidade e testes
- **Started at:** 2026-09-26
- **Source version:** 6.0.0
- **Central HEAD inicial:** `c3a2cad65e974243113fa321dc57492b5bb4e874`
- **Último deploy inicial:** workflow run `36277886863` — success — HEAD `c3a2cad65e974243113fa321dc57492b5bb4e874`
- **Child SHAs no início:** TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`; SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`; TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`
- **Acceptance aplicável:** validação automatizada do registry; testes leves para JavaScript crítico; checagem de links/configuração; quality gate antes do deploy; falha de teste impede deploy; workflow legível/recuperável; testes sem dependência de write nos projetos-filhos; gates globais.
- **Riscos:** quality gate frágil por regex; workflow bloquear deploy por falso positivo; testes dependerem de rede externa; duplicação entre auditoria manual e automática; Node/runtime incompatível.
- **QA v7:** PASS no workflow real — suite `tests/quality.mjs` executada com sucesso; registry/fallback/manifest/assets/PWA validados; funções críticas `validateConfig`, `chooseFocus` e `readLastVisit` testadas em sandbox; URLs HTTP/IDs duplicados/estado local corrompido cobertos.
- **CI gate:** PASS — workflow `Validate and deploy Central de Estudos` possui job `quality` e `deploy needs: quality`; quality real passou antes de o deploy ser enfileirado.
- **Runtime:** `actions/setup-node@v7` com Node 22; sem dependências npm e sem rede externa nos testes.
- **Estado da implementação:** concluída; aguardando deploy final da release 7.0.0 e pós-deploy.

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

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
