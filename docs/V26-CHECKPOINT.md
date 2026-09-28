# Checkpoint v26 — ritmo, citações e agenda móvel

**Stage:** PUBLISHED — inspeção visual em viewport móvel pendente  
**Versão:** 26.0.0  
**Baseline:** v25.0.0 em `70725ee52122766c4e1e13599fdd144f61e7f60b`  
**Release commit:** `8b848a7e8b644471aa401642e52cb333730266e3`  
**Workflow:** [36363168347 — Quality gate + Pages Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36363168347)  
**Repositório:** `RodrigoRosaDantas/central-estudos`  
**Projetos-filhos:** READ-ONLY; nenhum write planejado.

## Entregas

- SEEDF P1 e TJDFT P2: estudo de segunda a sexta e revisão no sábado.
- TCE-GO P3: terça, quinta e sábado.
- PRF-ADM: segunda, quarta e sexta, retomando a próxima unidade da sequência PRFADM01→PRFADM30.
- Agenda agrupada por rotina, com grade de uma coluna em telas estreitas.
- Relógio de Brasília em `HH:MM:SS`; citações diárias com autoria, referência e fonte.
- Service worker v26 inclui a folha nova da agenda e URLs versionadas para atualizar o script e o registro de projetos em clientes com cache antigo.

## Validação

- `node tests/quality.mjs`: PASS no commit `8b848a7`.
- GitHub Actions Quality gate e Pages Deploy: SUCCESS no workflow `36363168347`.
- GitHub Pages verificado em V26; relógio avançou de `21:43:03` para `21:43:04`; grade, autoria e fonte presentes.
- Testes automatizados confirmam os padrões de dias e o breakpoint móvel.
- Inspeção visual móvel real permanece pendente: o navegador de validação ficou em 1363×936 e não oferece emulação de viewport; a prévia local foi bloqueada pelo ambiente.
- TCE-GO, SEEDF, TJDFT e demais projetos-filhos permanecem inalterados.
