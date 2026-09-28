# Auditoria final — Central de Estudos v27.6.1

**Status:** PUBLISHED — Quality gate e GitHub Pages aprovados.  
**Data:** 2026-09-28.  
**Commit publicado:** `177abfe4b8bd8d0e051bc5ae9f6d67c314adfa6a`.  
**Workflow:** [run 36494985818 (#382)](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36494985818).  
**Artifact Pages:** `11002388897`, 168.960 bytes.  
**Shell:** 146.235/147.456 bytes bruto; 46.624/49.152 bytes gzip.  
**Página:** https://rodrigorosadantas.github.io/central-estudos/#projetos

## Verificações

- `node tests/quality.mjs`: PASS local e no workflow GitHub.
- `git diff --check`: PASS.
- QA visual no GitHub Pages confirmou v27.6.1 e os rótulos acima dos campos Horas e Minutos.
- O cache instalado foi atualizado para v27.6.1 durante a conferência.
- A conferência não criou registros de estudo nem alterou o cronograma.

A release corrige a disposição dos dois campos de duração da v27.6.0. Registro local, backups, somas diárias e semanais, totais por projeto e grade semanal permanecem como publicados na v27.6.0.
