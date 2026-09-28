# Riscos v27.5.0

| Risco | Mitigação | Estado |
|---|---|---|
| Um sinal de publicação ser confundido com sessão concluída | Rotular execução como registro na fonte; dizer que origem/data do estado publicado não confirmam estudo individual | Coberto pelo texto e pelos testes |
| Pendência editorial do PRF virar atraso ou dívida | Marcar material incompleto como bloqueio; retomar o mesmo PRFADMxx no próximo slot seg/qua/sex | Coberto pelo texto e pelos testes |
| Fechamento induzir mudança na grade semanal | Testar cada dia, projeto, prioridade P1–P4, foco e sequência PRF | Quality gate local PASS |
| Página ou PWA continuar exibindo versão antiga | Atualizar registry, URLs de runtime e nome do cache para v27.5.0 | Aguarda deploy e QA publicado |
| App shell exceder o teto aprovado | Medir os recursos listados em APP_SHELL no Quality gate | 147.360/147.456 bytes bruto; 48.083/49.152 bytes gzip |
| PRF parecer disponível no Radar sem contrato | Manter Notion como fonte canônica e declarar que PRF não possui contrato de status | Coberto; sem contrato ou chamada nova |
