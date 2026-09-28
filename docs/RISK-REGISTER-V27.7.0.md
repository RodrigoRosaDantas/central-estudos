# Registro de riscos v27.7.0

| Risco | Efeito | Controle |
|---|---|---|
| O catálogo pode ficar desatualizado em relação ao Notion. | Nome, unidade ou liberação pode mudar. | Identificar a data da fotografia e informar que sequência e progresso devem ser conferidos no projeto. |
| Camada guiada ainda não está em cache na primeira visita offline. | Dia/matéria não aparecem. | Manter o formulário manual no app shell e cachear os três recursos same-origin após primeiro acesso online. |
| Previsto pode ser confundido com realizado. | Tempo falso ou progresso presumido. | Não pré-marcar a confirmação; só salvar após duração e confirmação explícita. |
| Resumo de semana antiga pode continuar mostrando a semana atual. | Totais parecem inconsistentes após navegar no histórico. | O seletor recalcula dia/semana, projetos e matérias com os registros locais; atualizar ao mudar a lista recente. |
| Entrada pode ser interpretada como avanço oficial da trilha. | Duplicação ou divergência entre Central e projeto. | Explicar que a Central só registra tempo e não escreve nem sincroniza com Notion. |
| Shell está próximo do teto bruto aprovado nesta versão. | Mudanças futuras em arquivo pré-cacheado podem exceder o orçamento. | Recursos guiados permanecem fora do app shell; qualquer mudança futura precisa liberar espaço ou permanecer em cache runtime. Medição atual: 147.407/147.456 bytes bruto e 46.881/49.152 gzip. |
| A validação visual não usou viewport de aparelho móvel. | Um problema de layout restrito a um navegador/dispositivo poderia passar. | Breakpoint narrow-screen (≤360px) e alvos de toque mínimos de 42px passaram na suíte; a tela publicada foi inspecionada em viewport amplo. |