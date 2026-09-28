# Riscos v27.4.1

| Risco | Mitigação | Estado |
|---|---|---|
| Colunas desktop apertarem o título ou a frase em telas intermediárias | Ativar a grade a partir de 900 px e conferir em browser | QA desktop 1363×936 aprovado; painel 588×154 px, sem overflow |
| Layout desktop afetar telas menores | Aplicar grade desktop somente acima do breakpoint e manter fluxo vertical abaixo | Coberto pelo CSS e pelo Quality gate; QA móvel manual continua pendente |
| Frase perder leitura, fonte ou atribuição | Manter contraste, aria-live, autoria, link da fonte e contratos existentes | Aprovado no Quality gate e QA publicado |
| App shell ultrapassar o orçamento aprovado | Medir os recursos declarados em APP_SHELL | 147.255/147.456 bytes bruto e 47.857/49.152 bytes gzip; dentro do limite |
