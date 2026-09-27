# Registro de riscos v24

| Risco | Mitigação | Evidência de aceite |
|---|---|---|
| Navegação por telas esconder conteúdo útil em hash legado | Aliases para Workspace, Radar, Mentor, preferências e diagnóstico | testes de mapeamento e navegação |
| Inbox filtrada contaminar a visão geral do Radar | Listas e renderizadores separados, ambos usando contratos já validados | teste confirma filtros isolados |
| Views v19 tornarem-se inválidas com o campo novo | `screen` opcional e default Hoje na leitura | teste de compatibilidade antiga e nova |
| Retomada parecer medida de estudo | Copy distingue foco escolhido de último acesso e diz que acesso não é progresso | critérios de aceitação + strings verificadas |
| Shell ultrapassar 128 KiB | Medir o payload e minificar o runtime depois de implementar; manter limite existente | quality gate e audit final |
| Mudança afetar projetos-filhos | Repositório alvo único, zero operações de escrita neles | hashes dos filhos ficam fora deste commit |
