# Registro de riscos v25 — cronograma semanal

Riscos da grade por prioridade e dias da semana da Central.

| Risco | Mitigação | Verificação |
|---|---|---|
| A ordem de prioridades mudar | A grade é editorial e independente do foco; editar explicitamente as posições P1–P3 | Teste verifica a ordem e o registry conserva seu foco padrão |
| Um dia sem estudo parecer atraso | A nota manda retomar a próxima unidade lógica sem compensação automática | Teste confere o texto e a ausência de controles de conclusão |
| Checkpoint do TCE-GO cair fora de terça/quinta/sábado | O Dxx da central do TCE-GO controla exceções | Nota de exceções presente na agenda e roadmap |
| Atalho deixar a agenda oculta em outra tela | Resolver o hash da agenda para Hoje e manter a seção como filha direta de main | Teste de alias, hierarquia e link |
| Grade apertar em mobile | Passar de quatro para duas e uma coluna em larguras menores | Regras responsivas no CSS; inspeção visual geral pendente |
| Shell ultrapassar 128 KiB | Manter o limite existente e medir no quality gate; otimizar somente após a rodada de funcionalidades | Quality gate e auditoria geral posterior |
| Escrita afetar projeto-filho | Alterar somente `central-estudos`; contratos e filhos continuam read-only | Lista de arquivos e repositórios do commit |

