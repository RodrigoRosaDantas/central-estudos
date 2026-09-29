# Roadmap v28.1.0 — Central ↔ Jornada

Status: `PUBLISHED`; implementation and its post-deploy contract view are live. A title-only follow-up is recorded in the final audit.

## Objetivo

Integrar a Central Operacional (`central-estudos`) e o Painel Estratégico/Jornada (`plano-de-transicao`) sem fundi-los. O registry da Central passa a declarar P1 SEEDF, P2 TJDFT, P3 TCE-GO e P4 PRF Administrativo; a Jornada consome esse registry e os contratos v1 publicados pelos projetos.

## Escopo preservado

- TCE-GO segue como foco padrão; nenhuma preferência nem cronograma semanal muda.
- Projetos P1–P4 e suas integrações com Notion permanecem independentes e sem escrita.
- A Plataforma de Questões segue transversal, fora de P1–P4.
- SEDES/DF permanece histórico e sem código P1–P4.
- Contratos públicos são somente leitura; a Jornada não lê `study` nem consulta Notion/Supabase.
- Catálogo e contratos podem falhar sem impedir o uso da Central, da Jornada ou dos sites individuais.

## Gate de liberação

- Suite de qualidade da Central passa na branch.
- Auditoria estática e UI da Jornada passam em desktop e mobile.
- Nenhum segredo aparece em arquivos públicos.
- Ações do GitHub publicam Pages somente a partir de `main`.
- Merge depende de todos os gates verdes.

## Registro de publicação

- Central PR #28 passou no quality workflow e publicou a versão `28.1.0` no GitHub Pages.
- Jornada PR #27 passou nas suítes de auditoria e UI e publicou o Painel Estratégico.
- Os ajustes de cache da Jornada PR #28 passaram nas suítes; a sincronização Notion preservou o fluxo e alterou apenas `data/snapshot.json`.
- O estado vivo P1–P4 e os hashes de CI/deploy estão em [`FINAL-AUDIT-V28.1.0.md`](FINAL-AUDIT-V28.1.0.md).
