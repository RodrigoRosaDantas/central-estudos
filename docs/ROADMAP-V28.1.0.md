# Roadmap v28.1.0 — Central ↔ Jornada

Status: `READY_FOR_RELEASE` after the local and pull request gates pass.

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
