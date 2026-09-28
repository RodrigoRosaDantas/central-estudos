# Riscos v27.4.2

| Risco | Mitigação | Estado |
|---|---|---|
| A nova prioridade apertar os rótulos em celulares | Refluxo para duas colunas abaixo de 720 px e teste estrutural | Quality gate e deploy aprovados; inspeção visual manual pendente |
| P4 substituir por engano o foco de navegação | Manter TCE-GO como projeto padrão e validar no registry/teste | Coberto localmente |
| Agenda PRF sair dos dias ou sequência definidos | Preservar seg/qua/sex e PRFADM01–PRFADM30 | Coberto pelo Quality gate |
| Site público ser tratado como status operacional | Manter PRF fora do Radar até existir contrato publicado | Sem alteração de contrato |
| App shell ultrapassar o teto vigente | Medir todos os recursos de APP_SHELL e otimizar se necessário | Aprovado: 147.257/147.456 bytes bruto e 47.839/49.152 bytes gzip |
