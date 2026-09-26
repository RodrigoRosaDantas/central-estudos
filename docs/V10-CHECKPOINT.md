# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 3.0.0
- **Meta:** 10.0.0
- **Next major:** 4.0.0
- **Active major:** 4.0.0
- **Stage:** IN_PROGRESS
- **Status:** IN PROGRESS
- **Último deploy de release validado:** workflow run 36270559732 — success
- **Commit de release validado:** `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`
- **Repositório:** RodrigoRosaDantas/central-estudos
- **Projetos-filhos:** READ-ONLY / NO WRITES

## Baseline de referência dos projetos-filhos — 2026-09-26

- TCE-GO main: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF main: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT main: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Máquina de estado

### READY
Pode iniciar `Next major`.

### IN_PROGRESS
A major indicada em `Active major` está sendo construída. Próxima execução deve continuar a mesma.

### VALIDATING
Implementação principal terminou, mas ainda faltam acceptance/auditoria/deploy. Não iniciar major seguinte.

### BLOCKED
Existe falha/inconsistência. Corrigir/reconciliar antes de avançar.

### COMPLETE — v10.0.0
Esteira encerrada.

## Snapshot da major ativa

- **Major:** 4.0.0
- **Started at:** 2026-09-26T20:54:23Z
- **Source version:** 3.0.0
- **Central HEAD inicial:** `3879073fa0790f0398ccbbbe6c023ca4656edc34`
- **Último deploy inicial:** workflow run `36270621412` — success — HEAD `3879073fa0790f0398ccbbbe6c023ca4656edc34`
- **Child SHAs no início:** TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`; SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`; TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`
- **Acceptance aplicável:** catálogo simples e escalável; busca/filtro somente com ganho real; favoritos/ordenação locais; foco, favorito, último acesso e recência distintos; atalhos sem prejudicar touch/mobile; abrir projeto permanece ação principal; gates globais.
- **Riscos:** excesso de controles para apenas 3 projetos; conflito entre ordenação local e foco; regressão mobile/touch; atalhos capturarem digitação; armazenamento local indisponível/corrompido.

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

## Histórico de majors

- 2026-09-26 — v2.0.0 — fundação consolidada e resiliência local — commit `e3cfacdf6e3784ca0236065cf34ac14c2900dd97` — Pages run `36264383202` — success
- 2026-09-26 — v3.0.0 — observabilidade confiável — commit `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c` — Pages run `36270559732` — success

## Regra de avanço

Uma major só fecha após acceptance da versão, audit protocol, quality gate, deploy Pages `success`, post-deploy QA verificável, changelog e checkpoint.

## Parada

Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
