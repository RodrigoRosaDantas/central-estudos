# Checkpoint v25 — cronograma semanal

**Stage:** COMPLETE — v25.0.0 publicada no GitHub Pages  
**Versão-alvo:** 25.0.0  
**Baseline:** v24.0.0 em `fe4eb0fc54128b3894c7fe84e56ad82a36247f55`  
**Release commit:** `84c2d0ef3c130d9edc4bffcc7d1ff708ff8bab0f`  
**Workflow:** [36360961076 — Quality gate + Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36360961076)  
**Repositório:** `RodrigoRosaDantas/central-estudos`  
**Projetos-filhos:** READ-ONLY; nenhum write planejado.

## Entregas

- Grade semanal P1 SEEDF → P2 TJDFT às segundas, quartas e sextas.
- Sessões TCE-GO P3 às terças, quintas e sábados; domingo protegido.
- Atalho direto com hash para a agenda dentro da tela Hoje.
- Texto deixa claro que a grade não registra estudo e não altera o foco.
- Atualização do cache PWA, versão, testes e documentação v25.

## Validação

- `node tests/quality.mjs`: PASS no checkout local.
- Payload do app shell: dentro do limite do quality gate (128 KiB).
- GitHub Actions Quality gate + Deploy: SUCCESS no workflow `36360961076`.
- QA visual mobile: layout estrutural responsivo; inspeção manual reservada à auditoria geral.
