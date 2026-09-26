# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 4.0.0
- **Meta:** 10.0.0
- **Next major:** 5.0.0
- **Active major:** 5.0.0
- **Stage:** IN_PROGRESS
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36271496568 — success
- **Commit de release validado:** `42ee59a34ebb34ecaa858da77b03646f25c21304`
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

- **Major:** 5.0.0 — Personalização local
- **Started at:** 2026-09-26
- **Source version:** 4.0.0
- **Central HEAD inicial:** `968a00e76166d68bda4ea1fe981e69526acc4b7a`
- **Último deploy inicial:** workflow run `36271895234` — success — HEAD `968a00e76166d68bda4ea1fe981e69526acc4b7a`
- **Child SHAs no início:** TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`; SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`; TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`
- **Acceptance aplicável:** preferências somente locais; reset seguro; preferências inválidas não quebram renderização; ordem/apresentação não alteram registry; nenhuma informação sensível; configuração compreensível e reversível; gates globais.
- **Riscos:** conflito com ordenação da v4; preferências corrompidas; controles mortos sem JavaScript; reset apagar continuidade indevidamente; regressão mobile ao adicionar painel de preferências.

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
- **Limitação registrada:** a URL pública do GitHub Pages não pôde ser aberta diretamente pela ferramenta web desta sessão; nenhuma validação visual foi inventada.

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

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
