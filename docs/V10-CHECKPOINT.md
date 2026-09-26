# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 3.0.0
- **Meta:** 10.0.0
- **Next major:** 4.0.0
- **Active major:** none
- **Stage:** READY
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36270559732 — success
- **Commit de release validado:** `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`
- **Repositório:** RodrigoRosaDantas/central-estudos
- **Projetos-filhos:** READ-ONLY / NO WRITES

## Baseline de referência dos projetos-filhos — 2026-09-26

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

- **Major:** none
- **Started at:** —
- **Source version:** —
- **Central HEAD inicial:** —
- **Último deploy inicial:** —
- **Child SHAs no início:** —
- **Acceptance aplicável:** —
- **Riscos:** —

## Última major concluída — v3.0.0

- **Origem:** v2.0.0
- **Objetivo:** tornar a observabilidade técnica confiável e explicável.
- **Resultado:** PASS
- **Acceptance v3:** PASS nos gates estruturais/lógicos verificáveis.
- **Cache:** 15 minutos, com `cached` e `stale-cache` distintos.
- **Rate limit:** tratado explicitamente sem bloquear navegação.
- **Deploy público:** busca até 100 runs e prioriza `deploy-pages.yml`.
- **Origem dos dados:** explicada na interface; publicação técnica não equivale a estudo.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36270559732` — success.
- **Commit validado:** `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`.
- **Limitação registrada:** a URL pública do GitHub Pages não pôde ser aberta diretamente pelas ferramentas desta sessão; nenhuma renderização visual foi inventada.

## Última major concluída — v2.0.0

- **Origem:** v1.4.0
- **Objetivo:** consolidar a fundação da shell.
- **Resultado:** PASS
- **Acceptance v2:** PASS nos gates verificáveis estruturalmente.
- **QA estrutural:** PASS — JS/JSON/manifest válidos; IDs únicos; HTTPS; fallback 3/3; 404; sem secrets detectados.
- **Hierarquia:** foco → retomada → ambientes → estado técnico.
- **Resiliência local:** storage defensivo, limpeza de preferências inválidas e modo degradado explícito.
- **Projetos-filhos:** SHAs finais idênticos aos SHAs de preflight; zero writes nesta execução.
- **Deploy:** workflow run `36264383202` — success.
- **Commit validado:** `e3cfacdf6e3784ca0236065cf34ac14c2900dd97`.
- **Limitação registrada:** este ambiente não conseguiu acessar diretamente a URL do GitHub Pages para inspeção visual real; nenhuma validação visual foi inventada.

## Regra de avanço

Uma major só fecha após:
- acceptance da versão;
- audit protocol;
- quality gate;
- deploy Pages `success`;
- post-deploy QA verificável;
- changelog;
- checkpoint.

## Histórico de majors

- 2026-09-26 — v2.0.0 — fundação consolidada e resiliência local — commit `e3cfacdf...` — Pages run `36264383202` — success
- 2026-09-26 — v3.0.0 — observabilidade confiável — commit `dbc938e2...` — Pages run `36270559732` — success

## Parada

Ao concluir v10.0.0:
- `Status: COMPLETE — v10.0.0`;
- `Next major: none`;
- `Active major: none`;
- `Stage: COMPLETE`;
- não iniciar v11;
- desativar automação.
