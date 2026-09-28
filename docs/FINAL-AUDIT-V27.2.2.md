# Auditoria final — Central de Estudos v27.2.2

**Status:** Quality gate local PASS; PR #1 integrado à `main`; Quality gate e Pages Deploy remotos PASS. QA visual móvel permanece pendente.  
**Data:** 2026-09-28.

## Correção aplicada

A frase anterior era determinística por data e, por isso, permanecia igual durante todo o dia. Agora a Central alterna as seis frases do Major Cadar automaticamente em janelas de cinco minutos, sem recarga. A frase, autoria e link de origem correspondente são atualizados juntos.

## Verificações locais

- O teste de runtime confirma estabilidade dentro da janela e troca na fronteira seguinte.
- O teste percorre seis janelas consecutivas e confere seis frases distintas, cada qual com sua fonte correta.
- A aceitação estrutural preserva fallback sem JavaScript, PWA e ausência de chamadas externas.
- `node tests/quality.mjs`: **PASS**, incluindo teto pós-v20 autorizado de 144 KiB bruto e 48 KiB gzip.

## Publicação remota confirmada

- PR #1 foi integrado por squash à `main`: [`376fdcdcbfded4618f39d54723b981bad5223357`](https://github.com/RodrigoRosaDantas/central-estudos/commit/376fdcdcbfded4618f39d54723b981bad5223357).
- [Workflow #366](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36406335263) terminou com conclusão `success`.
- Os jobs **Quality gate** e **Deploy**, incluindo **Deploy to GitHub Pages**, terminaram com conclusão `success`.
- QA visual móvel continua pendente; esta auditoria não marca inspeção visual como concluída.
