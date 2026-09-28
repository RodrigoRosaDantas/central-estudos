# Registro de riscos v27 — cronograma dia a dia

| Risco | Mitigação | Verificação |
|---|---|---|
| PRF Administrativo continuar difícil de encontrar | Banner próprio e itens nomeados nos dias planejados | Testes de DOM conferem banner e segunda/quarta/sexta |
| Cartões repetidos por dia divergirem das prioridades | Gerar o mesmo padrão de conteúdo explicitamente por dia e testar cada cartão | Matriz semanal validada no quality gate |
| PRF ser interpretado como prioridade 4 | Usar rótulo “trilha complementar” sem número | Teste confirma apenas P1/P2/P3 |
| Unidade PRF ser pulada ou avanço presumido | Usar “próxima PRFADMxx da sequência” sem fixar código por data | Texto e regra de continuidade testados |
| Grade diária ficar comprida em celular | Cartões compactos em uma coluna, sem bullets ou colunas largas | Breakpoint móvel testado; inspeção publicada pendente |
| Agenda aparentar registrar execução | Exibir atividade planejada e preservar aviso de não rastreamento | Teste de conteúdo/contrato |
| Projetos-filhos serem alterados | Limitar escrita à Central | Commit limitado ao repositório central |
