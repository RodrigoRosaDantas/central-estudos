# Auditoria final — v23.0.0 Hoje + Radar + Mentor

## Resultado
- **Estado:** COMPLETE.
- **Versão:** 23.0.0.
- **Release validada:** `4dcc9d5320ea590418069aefe409790e1c0e5a88`.
- **Workflow:** `36350011045` (run 340) — Quality gate SUCCESS + Deploy SUCCESS.
- **Artefato Pages:** `10941832458`.
- **Digest:** `sha256:5d2d12ab60bdb1ba57dcda239e53086ab49b9c1cfcd46832d9c5644c9d341d58`.
- **Shell first-party:** 130.685 / 131.072 bytes; margem 387 bytes.
- **Registry/PWA:** 23.0.0 / `central-shell-v23.0.0`.

## O que mudou
A Home agora é explicitamente **Hoje**. O foco escolhido pelo usuário continua sendo a referência principal e a próxima ação só aparece quando foi publicada pelo próprio projeto. Se não houver ação publicada, a Central diz isso claramente e aponta para navegação/consulta, sem inventar uma tarefa.

O antigo bloco de evolução virou **Radar operacional**, mantendo leitura multi-projeto baseada nos contratos. O antigo “Como entrar” virou **Mentor de execução**: as mesmas lentes confiáveis de foco, retomada, ações publicadas e alertas agora são apresentadas como orientação de navegação, com explicabilidade e sem troca automática de prioridade.

## Regressão
As tentativas intermediárias do gate detectaram incompatibilidades de contrato histórico e bloquearam deploy. Os testes foram ajustados para aceitar a evolução sem apagar os invariantes antigos. Também foi preservada a guarda que impede linguagem de ranking/score na camada operacional. O run 340 passou todos os testes e o deploy.

## Projetos-filhos
- TCE-GO: `889017ba83143be268a84358229882a2b3ef9289` — sem writes.
- SEEDF: `b68431e2aa4944199705400c8821bf28505299d1` — sem writes.
- TJDFT: `99877771dcd008594d6855c08f077e1563e609bd` — sem writes.
- SEDES/DF histórico: apenas navegação/registro preservados.

## Limites
Não foi executada inspeção visual live em viewport controlável nesta sessão. O mobile e a acessibilidade permaneceram cobertos estruturalmente pelo gate.

## Fechamento
A v23 está fechada como versão terminal desta esteira. Não iniciar v24 sem autorização explícita.
