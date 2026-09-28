# Registro de riscos v26 — ritmo, citações e agenda móvel

| Risco | Mitigação | Verificação |
|---|---|---|
| A grade aparentar listar tarefas concluídas | Usar nomes de atividade planejada; nenhum checkbox, presença, atraso ou indicador de progresso | Teste de DOM e contrato manual |
| Rotinas P1/P2 mais PRF-ADM se sobreporem | Exibir SEEDF e TJDFT primeiro; PRF-ADM como trilha adicional sem inventar duração | Ordem e dias conferidos nos testes |
| Sábado mostrar conflito entre revisão e TCE-GO | Rotular revisões P1/P2 e sessão TCE-GO separadamente no mesmo cartão | Conteúdo de sábado testado |
| Agenda voltar a quebrar em celular por CSS antigo em cache | Nova folha `workspace-v26.css` e nova chave do shell PWA | App shell contém a folha v26; inspeção móvel pendente |
| Citação receber atribuição imprecisa | Usar quatro referências institucionais/primárias; mostrar autoria e fonte; marcar traduções | URLs e autores verificados e testados |
| Atualização por segundo aumentar consumo | Atualizar somente o texto local do relógio; nenhuma operação de rede | Código do relógio sem `fetch`; teste do intervalo |
| Um projeto-filho ser modificado para refletir a agenda | A grade é somente editorial na Central | Escopo do commit limitado ao repositório Central |
