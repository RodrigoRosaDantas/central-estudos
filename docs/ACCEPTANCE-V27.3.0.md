# Aceitação v27.3.0

- [x] O cartão do dia corrente recebe destaque visual usando `America/Sao_Paulo`.
- [x] A mudança de domingo 23:59 para segunda 00:01 em Brasília atualiza o cartão sem recarregar a página.
- [x] O dia corrente é exposto por `aria-current="date"`.
- [x] A comparação inclui fase, ciclo, unidade, próxima ação e alertas de contratos validados.
- [x] O resumo usa somente armazenamento local, e apenas um estado `live` atualiza a base salva.
- [x] Cache recente/antigo e ausência de histórico anterior são identificados sem alegar atualização ou mudança inexistente.
- [x] O PRF aparece como projeto independente e sem prioridade numérica; o destino atual do Notion é preservado.
- [x] Nenhuma escrita é feita nos projetos-filhos; a Plataforma de Questões continua ferramenta separada.
- [x] Versionamento de cabeçalho, selo Hoje, registry, runtime e service worker alinhado em v27.3.0.
- [x] `node tests/quality.mjs` passou localmente e no workflow #368.
- [x] App shell com 147.251 bytes brutos e 47.802 bytes gzip, abaixo dos tetos autorizados.
- [x] Quality gate e Deploy to GitHub Pages remotos concluídos com sucesso no workflow #368.
- [x] O artefato Pages `10970644399` corresponde ao commit da release `2de1734db18e21cfe94a91227af76d5185fe1031`.
- [ ] QA visual manual móvel — pendente até viewport móvel real/emulado estar disponível.
