# Roadmap v26 — ritmo, citações e agenda móvel

**Release:** 26.0.0  
**Stage:** PUBLISHED — inspeção visual em viewport móvel pendente  
**Baseline:** v25.0.0, `70725ee52122766c4e1e13599fdd144f61e7f60b`  
**Release commit:** `8b848a7e8b644471aa401642e52cb333730266e3`  
**Workflow:** [36363168347 — Quality gate + Pages Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36363168347)

## Objetivo

Corrigir a leitura da agenda em celular, representar todos os dias de estudo indicados e dar mais clareza à frase diária e ao relógio de Brasília.

## Escopo entregue

1. Horário de Brasília em `HH:MM:SS`, atualizado a cada segundo, com data no fuso `America/Sao_Paulo`.
2. Citações sobre educação e aprendizagem com autor, referência, link de fonte e indicação de tradução livre.
3. SEEDF P1 e TJDFT P2: estudo de segunda a sexta e revisão no sábado.
4. TCE-GO P3: sessões terça, quinta e sábado.
5. Trilha PRF-ADM às segundas, quartas e sextas, seguindo PRFADM01→PRFADM30 sem pular unidade.
6. Rotinas agrupadas em cartões compactos; grade de uma coluna em largura estreita.
7. URLs versionadas para o script principal e registro local, após a validação publicada detectar o script V25 servido a clientes com cache PWA anterior.

## Limites preservados

- Alterações restritas a `RodrigoRosaDantas/central-estudos`; projetos-filhos permanecem READ-ONLY.
- PRF-ADM permanece como trilha adicional, sem prioridade inventada ou ambiente publicado.
- A grade não registra sessão, frequência, conclusão, atraso nem desempenho.
- Citações ficam no bundle local; a fonte só abre por ação explícita, sem chamada automática de rede.
- O foco da Central, filas e contratos permanecem inalterados.

## Verificação

- Quality gate local e GitHub Actions Quality + Pages Deploy: PASS/SUCCESS.
- A página publicada foi verificada em V26; o relógio avançou por segundo e a grade contém os padrões definidos.
- A CSS móvel é verificada automaticamente. A inspeção visual em viewport móvel permanece pendente porque o navegador de validação só expôs 1363×936 e bloqueou a prévia local.
