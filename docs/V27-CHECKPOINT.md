# Checkpoint v27 — cronograma dia a dia

**Stage:** PUBLISHED — inspeção visual em viewport móvel pendente  
**Versão:** 27.0.0  
**Baseline:** v26.0.0 em `e4fec4083baa803b93bcd0148dda74fbadfc10d0`  
**Release commit:** `58dde5355839f138e5f87f509939aa1396c9c03a`  
**Workflow:** [36363954600 — Quality gate + Pages Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36363954600)  
**Repositório:** `RodrigoRosaDantas/central-estudos`  
**Projetos-filhos:** READ-ONLY; nenhum write planejado.

## Entregas

- Sete cartões separados, um para cada dia da semana, em ordem de segunda-feira a domingo.
- PRF Administrativo visível em destaque como trilha complementar e nos cartões de segunda, quarta e sexta.
- SEEDF P1 e TJDFT P2: estudo de segunda a sexta e revisão no sábado.
- TCE-GO P3: terça, quinta e sábado.
- PRF mantém a sequência PRFADM01→PRFADM30, sem prioridade 4 e sem pular unidade.
- Domingo protegido, com D7/D20 somente quando previstos.
- Layout diário usa uma coluna em telas estreitas; app shell e URLs versionadas atualizados para v27.

## Validação

- `node tests/quality.mjs`: PASS no commit `58dde53`.
- GitHub Actions Quality gate + Pages Deploy: SUCCESS no workflow `36363954600`.
- GitHub Pages mostra V27, sete cartões na ordem definida e o destaque PRF Administrativo.
- Relógio de Brasília continua em `HH:MM:SS` e avança por segundo.
- O navegador de QA exibe 1363×936; inspeção visual móvel real permanece pendente, mas o breakpoint de uma coluna passa no quality gate.
- A atualização controlada pelo PWA pode mostrar “Atualizar agora” aos clientes que ainda usam a shell v26.
- TCE-GO, SEEDF, TJDFT e demais projetos-filhos permanecem inalterados.
