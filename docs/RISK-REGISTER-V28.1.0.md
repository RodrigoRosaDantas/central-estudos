# Riscos v28.1.0

| Risco | Resposta |
|---|---|
| Catálogo da Central indisponível | Jornada continua navegável; mostra estado indisponível e conserva o acesso “Estudar agora”. |
| Contrato ausente, incompatível ou falha de rede | O cartão permanece com link próprio e informa o tipo de falha; sem zero ou progresso inventado. |
| Data do contrato tem granularidade de dia | A interface exibe a data declarada. Só chama de antiga quando a publicação está pelo menos dois dias de calendário atrás em Brasília. |
| P3/TCE-GO tem progresso privado | O painel lê apenas o contrato público de calendário e não lê o campo opcional `study`. |
| GitHub Pages entrega resposta antiga via CDN | `publishedAt` e `source.updatedAt` aparecem como proveniência; estado antigo recebe aviso. |
| Branch de trabalho publicada por engano | Workflow de Pages só publica push/manual em `main`; pull requests rodam apenas qualidade. |
| Tokens Notion ou Supabase em frontend | Nenhuma central consulta Notion/Supabase; scanners e revisão do diff verificam ausência de credenciais. |

Não há mudança nas rotinas privadas de sincronização dos projetos filhos.
