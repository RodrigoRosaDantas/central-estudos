# Registro de riscos v26 — ritmo, citações e agenda móvel

| Risco | Mitigação | Verificação |
|---|---|---|
| A grade parecer listar tarefas concluídas | Atividades planejadas; sem checkbox, presença, atraso ou progresso | Testes de DOM e contrato |
| Rotinas P1/P2 e PRF-ADM se sobreporem | SEEDF e TJDFT aparecem primeiro; PRF-ADM fica como trilha adicional | Ordem e dias testados |
| Sábado misturar revisão e TCE-GO | Revisões P1/P2 e sessão TCE-GO rotuladas separadamente | Conteúdo de sábado testado |
| Cache PWA antigo continuar servindo JavaScript V25 | URL versionada para `app.js` e registro, nova chave do shell e folha v26 | Navegador encontrou o script antigo antes da correção; após deploy, V26 e segundos verificados |
| Agenda voltar a ficar alta ou apertada em celular | Cartões compactos e grade de uma coluna em breakpoint móvel | CSS e contrato responsivo testados; inspeção visual real pendente |
| Citação receber atribuição imprecisa | Quatro fontes institucionais/primárias; mostrar autor e marcar traduções | URLs e autores conferidos |
| Atualização por segundo aumentar consumo | Atualizar somente texto local, sem operação de rede | Código e teste do intervalo |
| Alterar projeto-filho para refletir a agenda | Agenda editorial limitada à Central | Escopo dos commits limitado ao repositório Central |
