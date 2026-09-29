# Critérios de aceitação v28.0.2 — resumo dinâmico do PRF

## Integração PRF

- [x] A próxima ação do foco rápido vem de state.nextAction no contrato read-only do PRF.
- [x] O tipo de ação publicado continua distinguindo operacional, planejado e manual.
- [x] Cache antigo é apresentado como último estado conhecido.
- [x] Contrato ausente usa fallback genérico sem afirmar PRFADM01 ou outra unidade.
- [x] A Central permanece somente leitura; sincronização Notion e publicação continuam no repositório do PRF.

## Compatibilidade

- [x] TCE-GO continua como foco padrão; PRF continua P4 na grade de segunda, quarta e sexta.
- [x] SEEDF e TJDFT não são alterados.
- [x] Os três estados PRF (publicado, cache antigo e indisponível) têm teste de regressão.
- [x] Cache de aplicação/PWA atualizado para v28.0.2.

## Validação e publicação

- [x] Suíte local `node tests/quality.mjs`: PASS.
- [x] GitHub Actions [workflow #433](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36605206713): success.
- [x] Job **Quality gate** e job **Deploy**, incluindo **Deploy to GitHub Pages**: success.
- [x] PR [#24](https://github.com/RodrigoRosaDantas/central-estudos/pull/24) integrado ao `main`.
