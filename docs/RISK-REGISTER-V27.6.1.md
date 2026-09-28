# Registro de riscos — Central v27.6.1

| Risco | Mitigação | Estado |
|---|---|---|
| Campos horas/minutos ficarem pouco claros por rótulos na mesma linha | Reutilizar o estilo acessível de campos empilhados; conferir no navegador | Coberto por teste estrutural; QA visual após deploy |
| Patch de visual alterar lógica ou cronograma | Patch restrito às classes dos dois labels; quality gate cobre formulário e grade | Coberto e testado |
| Cache instalado reter HTML anterior | Renovar URLs e nome do cache para v27.6.1 | Aguardando workflow e verificação PWA |
| Limite offline ser ultrapassado | Medir APP_SHELL no gate; manter os tetos em 147.456 bruto e 49.152 gzip | 146.235/147.456 bytes bruto; 46.624/49.152 bytes gzip |
