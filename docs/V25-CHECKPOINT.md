# Checkpoint v25 — cronograma semanal

**Stage:** IMPLEMENTATION READY — GitHub Actions pending  
**Versão-alvo:** 25.0.0  
**Baseline:** v24.0.0 em `fe4eb0fc54128b3894c7fe84e56ad82a36247f55`  
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
- GitHub Actions Quality + Deploy: pendente.
- QA visual mobile: layout estrutural responsivo; inspeção manual reservada à auditoria geral.

