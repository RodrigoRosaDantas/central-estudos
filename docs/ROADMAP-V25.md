# Roadmap v25 — cronograma semanal

**Release:** 25.0.0  
**Stage:** COMPLETE — v25.0.0 publicada no GitHub Pages
**Release commit:** `84c2d0ef3c130d9edc4bffcc7d1ff708ff8bab0f`
**Workflow:** [36360961076 — Quality gate + Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36360961076)

## Objetivo

Exibir na Central uma grade semanal de estudo que aplique a ordem de prioridades informada e os dias fixos do TCE-GO.

## Escopo

1. Destacar SEEDF (P1), TJDFT (P2) e TCE-GO (P3) sem mudar o foco de navegação.
2. Planejar SEEDF → TJDFT às segundas, quartas e sextas; TCE-GO às terças, quintas e sábados; domingo protegido.
3. Abrir a grade pela tela Hoje e por atalho com âncora direta.
4. Manter execução, progresso, revisões e filas dentro de cada projeto.

## Limites

- Nenhuma chamada de rede nova, armazenamento de execução ou write nos projetos-filhos.
- Sem ranking ou prioridade calculada; a ordem é manual e estática.
- O Dxx do TCE-GO continua sendo a fonte para checkpoints e exceções.

## Critérios de aceite

- A grade mostra os sete dias em ordem e as prioridades em ordem explícita.
- A âncora abre a tela Hoje inclusive quando o usuário parte de outra tela.
- A grade não apresenta estado de conclusão, falta ou progresso.
- CSS reorganiza os cartões em larguras móveis.
- Quality gate e publicação do GitHub Pages passam.
