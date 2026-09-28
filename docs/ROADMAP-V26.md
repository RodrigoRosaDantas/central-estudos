# Roadmap v26 — ritmo, citações e agenda móvel

**Release:** 26.0.0  
**Stage:** IMPLEMENTATION READY — quality/deploy pending  
**Baseline:** v25.0.0, `70725ee52122766c4e1e13599fdd144f61e7f60b`

## Objetivo

Corrigir a leitura da agenda em celular, representar todos os dias de estudo indicados e dar mais clareza à frase diária e ao relógio de Brasília.

## Escopo

1. Exibir o horário de Brasília em `HH:MM:SS`, atualizar a cada segundo e manter a data no fuso `America/Sao_Paulo`.
2. Alternar frases sobre educação e aprendizagem, exibindo autor, referência e link para a fonte; identificar traduções livres.
3. Manter SEEDF como P1 e TJDFT como P2, com estudo de segunda a sexta e revisão no sábado.
4. Manter TCE-GO como P3, com sessões terça, quinta e sábado.
5. Incluir a trilha PRF-ADM às segundas, quartas e sextas, seguindo PRFADM01→PRFADM30 sem pular unidade.
6. Agrupar rotinas iguais em cartões compactos, responsivos, sem rolagem horizontal e sem listas numeradas expostas.

## Limites

- Alterar somente `RodrigoRosaDantas/central-estudos`; projetos-filhos permanecem READ-ONLY.
- PRF-ADM aparece como trilha adicional, sem inventar uma nova prioridade ou um ambiente publicado.
- A grade continua manual; não registra sessão, frequência, conclusão, atraso nem desempenho.
- Citações ficam no bundle local e abrem sua fonte apenas quando o usuário toca no link; sem busca ou requisição automática.
- O foco da Central, suas filas e seus contratos não mudam.

## Critérios de aceite

- A hora inclui segundos e é determinada por Brasília, mesmo que o aparelho use outro fuso.
- Cada frase mostra autor e referência; links apontam para fontes que sustentam a atribuição.
- A agenda cobre P1/P2 de segunda a sexta, revisão de ambos no sábado, TCE-GO ter/qui/sáb e PRF-ADM seg/qua/sex.
- A grade não mostra bullets ou números inesperados e cabe em largura estreita sem overflow horizontal.
- Quality gate e GitHub Pages concluem com sucesso; visual QA móvel registra viewport e resultado observados.
