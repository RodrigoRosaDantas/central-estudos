# Roadmap v27.6.1 — alinhamento dos campos de duração

**Release:** 27.6.1  
**Stage:** PUBLISHED  
**Escopo:** corrigir a disposição dos campos de horas e minutos no formulário diário da v27.6.0.

## Correção

- Aplicar o estilo de campo empilhado aos inputs de horas/minutos, com rótulo acima do controle em desktop e mobile.
- Atualizar versões de runtime e cache PWA para renovar clientes instalados.
- Preservar os dados do registro, backups e cronograma semanal.

## Verificação

- Quality gate e `git diff --check` passam localmente e no workflow #382.
- Deploy do GitHub Pages e QA visual desktop concluídos; a tela publicada mostra rótulos acima dos campos.
- Auditoria final em `docs/FINAL-AUDIT-V27.6.1.md`.
