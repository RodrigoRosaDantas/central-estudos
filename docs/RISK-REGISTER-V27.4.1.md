# Riscos v27.4.1

| Risco | Mitigação | Estado |
|---|---|---|
| Colunas desktop apertarem o título ou a frase em telas intermediárias | Ativar a grade a partir de 900 px, limitar a largura mínima e verificar o layout em browser | A validar no QA visual |
| Layout desktop afetar a experiência em telas menores | Aplicar a grade apenas acima do breakpoint; manter o fluxo existente abaixo dele | Coberto pelo CSS e teste estrutural |
| Frase perder leitura, fonte ou atribuição | Manter contraste, aria-live, autoria, link da fonte e contratos existentes | Coberto pelo Quality gate |
| App shell ultrapassar o orçamento aprovado | Medir recursos de APP_SHELL e comprimir/reduzir antes de publicar | Gate local pendente de medição final |

