# Auditoria final — v21.0.0 Presença e Ritmo

## Resultado
- **Estado:** COMPLETE.
- **Versão terminal:** 21.0.0.
- **Active major:** none.
- **Next major:** none.
- **Central release commit:** `418231a98699a52b07bdce6d94d6d00a3c1e01bd`.
- **Workflow:** `36346724227` (run 330) — Quality gate `success` + Deploy `success`.
- **Artefato Pages:** `10941231310`.
- **Digest:** `sha256:c56665778704a12a0823ddb07e58e1a8925b3ecf25af10a9565c9d5a8eccfb80`.
- **Registry e cache PWA:** 21.0.0 / `central-shell-v21.0.0`.
- **Shell first-party:** 130.650 bytes de 131.072; margem de 422 bytes.

## Funcionalidade e testes
- A primeira dobra apresenta saudação, frase original do dia, relógio em destaque e foco atual.
- A frase é determinística pelo calendário de `America/Sao_Paulo`, estável durante o dia e renovada na data seguinte; o conjunto não tem autoria atribuída nem promete resultado.
- Relógio em hora/minuto sem segundos, data por extenso em português e fuso explícito de Brasília.
- Atualização por minuto e ao voltar para a aba; teste runtime fixo confirmou 00:15 de Brasília com relógio-base UTC, saudação, data e rotação diária da frase.
- Suíte local e workflow de qualidade passaram; regressões v10→v20, segurança, fallback/no-JS, contratos e orçamento preservados.
- Página servida confirmou `v21.0.0`, hora/data/frase, versão correta e ausência de rolagem horizontal na visualização desktop de 1363 × 936.
- PWA permanece limitado à Central; nenhuma chamada externa foi adicionada para relógio ou frase.

## Inspeção visual e limites
- **Desktop:** inspeção visual da página publicada concluída; a captura mostra saudação, frase, relógio, foco e evolução.
- **Mobile em viewport real:** não executado. O browser disponível não oferece controle de viewport nesta sessão; os estilos responsivos, alvos existentes, zoom/reflow, movimento reduzido e regras de alto contraste foram verificados estruturalmente pelo CSS e pelo quality gate. Isso não é registrado como inspeção visual mobile.
- **Console:** nenhum erro de JavaScript do site; o único aviso observado pertence à extensão do browser.

## Repositórios-filhos
- TCE-GO: `889017ba83143be268a84358229882a2b3ef9289` — igual ao preflight, zero writes.
- SEEDF: `b68431e2aa4944199705400c8821bf28505299d1` — igual ao preflight, zero writes.
- TJDFT: `99877771dcd008594d6855c08f077e1563e609bd` — igual ao preflight, zero writes.
- SEDES/DF histórico e links diretos preservados.

## Fechamento
A v21 está fechada como versão terminal desta esteira. O item mobile sem captura real ficou explicitamente não executado; os testes estruturais aprovados não são apresentados como prova visual. Não iniciar v22.
