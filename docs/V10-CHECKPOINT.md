# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 5.0.0
- **Meta:** 10.0.0
- **Next major:** 6.0.0
- **Active major:** none
- **Stage:** READY
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36272168251 — success
- **Commit de release validado:** `cf8cdb818449d020923f50d63e67689b635abc96`
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
- **Incidente de deploy:** um run antigo do Pages ficou temporariamente preso e bloqueou a fila; ele foi cancelado pelo GitHub e o deploy final prosseguiu sem alteração de workflow.
- **Limitação registrada:** nenhuma renderização visual real foi inventada; QA visual ficou restrito ao que as ferramentas conseguem verificar estruturalmente.

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
- 2026-09-26 — v5.0.0 — personalização local — commit `cf8cdb818449d020923f50d63e67689b635abc96` — Pages `36272168251` — success

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
