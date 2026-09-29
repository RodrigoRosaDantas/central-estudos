# Critérios de aceitação v28.0.1 — Foco e fechamento diário

## Foco da Central

- [x] TCE-GO permanece como `central.defaultProject` e no fallback inicial sem JavaScript.
- [x] A preferência de foco escolhida no aparelho continua prevalecendo.
- [x] PRF Administrativo continua P4 na grade de segunda, quarta e sexta.
- [x] A Central lê o contrato do PRF pelo endpoint próprio, sem cruzar status com TCE-GO.

## Fechamento diário

- [x] O fechamento hidrata mesmo sem o antigo `routing-panel` do Mentor na Home.
- [x] A data corrente usa `America/Sao_Paulo` e é recalculada após a meia-noite, ao retornar à aba e quando chegam eventos de registro/contrato.
- [x] Tempo registrado na Central aparece separado de execução explicitamente confirmada pelo projeto.
- [x] Uma confirmação externa exige `evidence: confirmed` e `lastStudiedAt` correspondente ao dia atual.
- [x] Campo ausente permanece desconhecido; ausência de registro não é prova de que não houve estudo.
- [x] A Home mantém um fechamento breve e envia a orientação completa para `/mentor/`.

## Compatibilidade

- [x] PWA mantém cache invalidado para a versão 28.0.1 e fallback dedicado do Mentor.
- [x] Projetos-filhos permanecem read-only para a Central.
- [x] Nenhuma credencial, OpenAI API ou endpoint privado novo é introduzido.

## Validação

- Suíte local `node tests/quality.mjs`: pendente nesta etapa.
- Workflow principal e publicação Pages: confirmar após merge.
