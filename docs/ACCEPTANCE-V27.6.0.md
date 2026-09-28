# Critérios de aceite — Central de Estudos v27.6.0

- [x] Um bloco exige data, projeto, trilha/matéria, duração positiva e confirmação de que foi estudado.
- [x] Tópico é opcional; durações são armazenadas em minutos e exibidas como horas/minutos.
- [x] Visão mostra total de hoje, total da semana (segunda a domingo), resumo por projeto e agrupamento por trilha/tópico.
- [x] Registro permite excluir blocos recentes (até 20 apresentados) e exportar/restaurar backup JSON com validação e deduplicação por ID.
- [x] Interface informa que os dados ficam neste navegador e não sincroniza com o Notion.
- [x] Nenhum lançamento é criado a partir da grade, visita, data de publicação ou status do projeto.
- [x] Dias, projetos, foco, ordem P1–P4 e demais horários da grade v27.5 foram preservados.
- [x] Registro e estilos estão no app shell offline; não houve aumento do teto aprovado.
- [x] `node tests/quality.mjs` passa localmente; QA publicado e CI ficam pendentes do deploy.
