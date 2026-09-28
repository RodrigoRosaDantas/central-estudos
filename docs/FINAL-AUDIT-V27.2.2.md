# Auditoria final — Central de Estudos v27.2.2

**Status:** Quality gate local PASS; workflow/deploy remoto e inspeção visual móvel não confirmados nesta sessão.  
**Data:** 2026-09-28.

## Correção aplicada

A frase anterior era determinística por data e, por isso, permanecia igual durante todo o dia. Agora a Central alterna as seis frases do Major Cadar automaticamente em janelas de cinco minutos, sem recarga. A frase, autoria e link de origem correspondente são atualizados juntos.

## Verificações locais

- O teste de runtime confirma estabilidade dentro da janela e troca na fronteira seguinte.
- O teste percorre seis janelas consecutivas e confere seis frases distintas, cada qual com sua fonte correta.
- A aceitação estrutural preserva fallback sem JavaScript, PWA e ausência de chamadas externas.
- `node tests/quality.mjs`: **PASS**, incluindo teto pós-v20 autorizado de 144 KiB bruto e 48 KiB gzip.

## Pendências de publicação

O commit da alteração está pronto para publicação. O conector disponível não expõe uma execução de workflow push nem o artefato desse commit; por isso, não marco o deploy como confirmado. QA visual móvel permanece pendente enquanto não houver viewport móvel disponível.
