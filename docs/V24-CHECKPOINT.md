# Checkpoint v24 — seis telas da Central

**Stage:** COMPLETE — v24.0.0 publicada no GitHub Pages  
**Projeto:** `RodrigoRosaDantas/central-estudos`  
**Release commit:** `01ccefa385f306c13c86e736e6d9a7a49d16adb4`  
**Workflow:** `36358103801` — Quality gate SUCCESS + Deploy SUCCESS  
**Artefato Pages:** `10943764161` — 105.200 bytes — `sha256:beae227ecac1214edbd9f6872701e019adfe2b9dabd422b80779705d8ae8f427`  
**Payload do app shell:** 120.555 / 131.072 bytes; margem de 10.517 bytes.

## Entregas

- Hoje, Retomada, Projetos, Inbox, Histórico e Evolução como seis telas com hash direto.
- Retomada separa foco escolhido de último acesso local e não chama navegação de progresso.
- Projetos combina catálogo com ciclo de vida; Inbox usa filtros próprios e Radar conserva a lista geral.
- Histórico mantém acessos locais separados dos sinais técnicos; Evolução reúne Radar, Mentor, preferências e estado técnico.
- Views antigas continuam válidas; as novas guardam a tela atual e podem ser abertas ou excluídas na lista.
- As seções de tela ficam diretamente em `main`; a regressão de aninhamento encontrada no QA foi corrigida e entrou no gate estrutural.

## Verificação

- `node tests/quality.mjs`: PASS.
- GitHub Actions: Quality gate + Deploy SUCCESS no workflow indicado acima.
- Pages: seis hashes diretos abertos no browser; navegação anterior, seguinte e atualização mantiveram a tela; QA executado em desktop.
- Projetos-filhos preservados: TCE-GO `889017ba83143be268a84358229882a2b3ef9289`, SEEDF `b68431e2aa4944199705400c8821bf28505299d1`, TJDFT `99877771dcd008594d6855c08f077e1563e609bd`.
- Work Sites permaneceu intocado.
- QA visual manual em viewport móvel real não foi executado; critérios responsivos estruturais passaram no gate.

Detalhes e evidências: `docs/FINAL-AUDIT-V24.md`.
