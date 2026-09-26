# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 4.0.0
- **Meta:** 10.0.0
- **Next major:** 5.0.0
- **Active major:** none
- **Stage:** READY
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36271230177 — success
- **Commit de release validado:** `f4a8688abc370061ad92a45cbb9b5c4a9b68054c`
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

## Última major concluída — v4.0.0
- **Origem:** v3.0.0
- **Objetivo:** catálogo operacional para escolha e acesso sem duplicar dashboards.
- **Resultado:** PASS
- **Acceptance v4:** PASS nos gates estruturais/lógicos verificáveis.
- **Catálogo:** busca local; ordem padrão/favoritos/nome; favoritos locais.
- **Semântica:** foco, favorito, último acesso e recência continuam distintos.
- **Atalhos:** `Alt+1..9` apenas fora de campos editáveis; touch não depende de teclado.
- **Ação principal:** abrir ambiente permanece dominante e fallback direto foi preservado.
- **QA:** registry/manifest válidos; IDs/HTTPS/fallback/404 preservados; JS v4 revisado; observer corrigido para não criar loop; storage degrada sem bloquear.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36271230177` — success para commit `f4a8688abc370061ad92a45cbb9b5c4a9b68054c`.
- **Limitação:** a URL pública do Pages não pôde ser aberta diretamente pelas ferramentas desta sessão; nenhuma validação visual foi inventada.

## Última major concluída — v3.0.0
- **Origem:** v2.0.0
- **Objetivo:** observabilidade técnica confiável e explicável.
- **Resultado:** PASS
- **Deploy:** workflow run `36270559732` — success.
- **Commit validado:** `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`.

## Histórico de majors
- 2026-09-26 — v2.0.0 — fundação consolidada — commit `e3cfacdf6e3784ca0236065cf34ac14c2900dd97` — Pages `36264383202` — success
- 2026-09-26 — v3.0.0 — observabilidade confiável — commit `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c` — Pages `36270559732` — success
- 2026-09-26 — v4.0.0 — catálogo operacional — commit `f4a8688abc370061ad92a45cbb9b5c4a9b68054c` — Pages `36271230177` — success

## Regra de avanço
Uma major só fecha após acceptance, audit protocol, quality gate, Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
