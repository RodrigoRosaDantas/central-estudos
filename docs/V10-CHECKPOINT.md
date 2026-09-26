# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 1.4.0
- **Meta:** 10.0.0
- **Next major:** 2.0.0
- **Active major:** none
- **Stage:** READY
- **Status:** IN PROGRESS
- **Último deploy validado:** workflow run 36263567239 — success
- **Repositório:** RodrigoRosaDantas/central-estudos
- **Projetos-filhos:** READ-ONLY / NO WRITES

## Baseline de referência dos projetos-filhos — 2026-09-26

Apenas para auditoria de preflight; alterações externas independentes podem ocorrer.

- TCE-GO main: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF main: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT main: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Série 1.x consolidada

- v1.0 — fundação da Central e registry;
- v1.1 — fallback resiliente, health check e PWA básica;
- v1.2 — foco x retomada + 404;
- v1.3 — observabilidade pública somente leitura;
- v1.4 — foco escolhível localmente.

## Máquina de estado

### READY
Pode iniciar `Next major`.

### IN_PROGRESS
A major indicada em `Active major` está sendo construída.
Próxima execução deve continuar a mesma.

### VALIDATING
Implementação principal terminou, mas ainda faltam acceptance/auditoria/deploy.
Não iniciar major seguinte.

### BLOCKED
Existe falha/inconsistência.
Corrigir/reconciliar antes de avançar.

### COMPLETE — v10.0.0
Esteira encerrada.

## Snapshot da major ativa

Preencher ao iniciar uma major:

- **Major:** none
- **Started at:** —
- **Source version:** —
- **Central HEAD inicial:** —
- **Último deploy inicial:** —
- **Child SHAs no início:** —
- **Acceptance aplicável:** —
- **Riscos:** —

## Regra de avanço

Uma major só fecha após:
- acceptance da versão;
- audit protocol;
- quality gate;
- deploy Pages `success`;
- post-deploy QA;
- changelog;
- checkpoint.

## Histórico de majors futuras

Formato:

`- YYYY-MM-DD — vX.0.0 — resumo — final commit — Pages run — success`

## Parada

Ao concluir v10.0.0:
- `Status: COMPLETE — v10.0.0`;
- `Next major: none`;
- `Active major: none`;
- `Stage: COMPLETE`;
- não iniciar v11;
- desativar automação.
