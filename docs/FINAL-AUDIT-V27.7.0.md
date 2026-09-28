# Auditoria final v27.7.0 — registro guiado

**Estado:** PUBLISHED — QUALITY GATE PASS — DEPLOY PASS  
**Data:** 28/09/2026  
**Site:** https://rodrigorosadantas.github.io/central-estudos/

## Integração e publicação

- PR #16: https://github.com/RodrigoRosaDantas/central-estudos/pull/16
- Commit na `main`: `bd0ac36beb9f53e899035d0e12e5e9a042f325b7`
- workflow run #384 — `36500234949`: Quality gate **success**; Deploy **success**.
- Artefato `github-pages`: ID `11005355766`; 181.469 bytes; SHA-256 `5aa757c497df0cde5f4dc07c12af3709e62540e31adda0657662685306cffa94`.

## Escopo validado

- Grade semanal existente e prioridades P1–P4 preservadas.
- Seleção de dias deriva da grade: seg–sex SEEDF/TJDFT, PRF seg/qua/sex, TCE-GO ter/qui, sábado revisões + TCE-GO, domingo protegido.
- Catálogos presentes para SEEDF, TJDFT (P01–P18, RL01–RL13, REV01–REV06), TCE-GO e PRFADM01–PRFADM33. A ordem e o avanço continuam nos projetos de origem.
- Seleção de matéria apenas preenche o formulário. Checkbox começou desligado; nada foi enviado; nenhum tempo/histórico foi criado durante o QA.
- Histórico e backups locais continuam no mesmo formato; sem sincronização ou escrita no Notion.

## Qualidade e limite de interface

- `node tests/quality.mjs`: PASS no workflow #384.
- `git diff --check`: PASS localmente.
- App shell: 147.407/147.456 bytes bruto (49 bytes de margem); 46.881/49.152 bytes gzip.
- Regras de tela estreita (≤360px) e controles com alvo mínimo de 42px cobertos pelo teste automatizado.
- A inspeção visual ao vivo ocorreu em viewport amplo de navegador, não em aparelho físico/emulação móvel. A tela de QA mostrou a semana anterior com terça selecionada e TCE-GO previsto; a seleção de SEEDF abriu catálogo de leis sem salvar registro.

## Riscos remanescentes

- O catálogo é uma fotografia de 28/09/2026 e deve ser revisto quando a nomenclatura ou disponibilidade mudar nas fontes.
- Na primeira visita offline, antes de o cache runtime receber os recursos guiados, a pessoa usa o formulário manual; após acesso bem-sucedido, os recursos são armazenados same-origin.
- A próxima conferência visual em aparelho físico pode validar diferenças específicas de navegador/tela; a suíte cobre breakpoints e toque estreito.
