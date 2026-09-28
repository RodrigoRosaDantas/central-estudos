# Roadmap v27 — cronograma dia a dia

**Release:** 27.0.0  
**Stage:** IMPLEMENTATION READY — quality/deploy pending  
**Baseline:** v26.0.0, main em `e4fec4083baa803b93bcd0148dda74fbadfc10d0`

## Objetivo

Deixar o planejamento semanal legível dia a dia e tornar PRF Administrativo claramente visível na Central.

## Escopo

1. Exibir sete cartões individuais, em ordem de segunda-feira a domingo.
2. Manter SEEDF (P1) e TJDFT (P2) com estudo de segunda a sexta e revisão no sábado.
3. Manter TCE-GO (P3) na terça, quinta e sábado.
4. Mostrar PRF Administrativo como trilha complementar, sem prioridade numérica nova, em uma identificação própria e nos cartões de segunda, quarta e sexta.
5. Preservar a sequência PRFADM01→PRFADM30: cada dia planejado continua da próxima unidade, sem pular código.
6. Manter domingo protegido, com D7/D20 apenas quando estiverem previstos.
7. Refluxo responsivo para celular, sem lista agrupada por padrões de dias nem rolagem horizontal.

## Limites

- Alterar somente `RodrigoRosaDantas/central-estudos`; projetos-filhos permanecem READ-ONLY.
- Não inventar prioridade 4, duração, horário ou avanço da trilha PRF.
- A agenda continua editorial: não registra presença, conclusão, atraso, desempenho ou progresso.
- Foco da Central, filas, navegação e frases/relógio da v26 permanecem independentes da agenda.

## Critérios de aceite

- DOM contém um cartão único para cada dia, em ordem segunda–domingo.
- Cada cartão mostra exatamente as atividades atribuídas ao dia.
- PRF Administrativo aparece em destaque como trilha complementar e nos dias seg/qua/sex.
- Grade mantém todos os contratos P1/P2/P3 e não cria prioridade adicional.
- CSS apresenta uma coluna em largura móvel e não força overflow horizontal.
- Quality gate local e GitHub Actions Quality + Pages Deploy passam.
