# Auditoria final — Central de Estudos v27.3.0

**Status:** release publicada; Quality gate local/remoto e Pages Deploy aprovados. QA visual móvel permanece pendente.  
**Escopo:** destaque do dia, comparação local de contratos publicados e classificação independente do PRF.  
**Data:** 2026-09-28.

## Implementação

- O cartão do dia local em `America/Sao_Paulo` recebe `aria-current="date"` e muda na virada de meia-noite.
- A Inbox compara fase, ciclo, unidade, próxima ação e alertas com snapshot anterior salvo neste navegador.
- Somente estado `live` avança a base; fontes em cache ficam identificadas. Primeira visita não inventa diferenças anteriores.
- PRF é projeto independente sem prioridade numérica e continua abrindo no Notion enquanto não houver site próprio confirmado.
- Projetos-filhos, Notion, Plataforma de Questões e Work Sites não receberam escrita.

## Testes e publicação

- `node tests/quality.mjs`: **PASS** local.
- App shell (24 recursos): **147.251 bytes brutos / 47.802 bytes gzip**; tetos: 147.456 / 49.152 bytes.
- PR #3 integrado à `main` no commit `2de1734db18e21cfe94a91227af76d5185fe1031`.
- Workflow #368 (`36426260988`): jobs **Quality gate** e **Deploy**, incluindo **Deploy to GitHub Pages**, concluídos com `success`.
- Artefato Pages: `10970644399`, ZIP de 141.717 bytes, digest `sha256:ba0a5d811341800183af12ff30c945ed484b45773901493c614b21e5b63c1400`.

## Pendência conhecida

A inspeção visual manual em viewport móvel segue pendente; esta sessão não ofereceu viewport móvel real/emulado. A validação CSS automatizada não substitui essa inspeção.
