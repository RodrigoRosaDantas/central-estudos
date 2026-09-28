# Roadmap v27 — cronograma dia a dia

**Release:** 27.0.0  
**Stage:** PUBLISHED — patch 27.0.1 reduz densidade móvel; inspeção visual em viewport móvel pendente  
**Baseline:** v26.0.0, main em `e4fec4083baa803b93bcd0148dda74fbadfc10d0`  
**Release commit:** `58dde5355839f138e5f87f509939aa1396c9c03a`  
**Workflow:** [36363954600 — Quality gate + Pages Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36363954600)

## Objetivo

Deixar o planejamento semanal legível dia a dia e tornar PRF Administrativo claramente visível na Central.

## Escopo entregue

1. Sete cartões individuais, em ordem de segunda-feira a domingo.
2. SEEDF (P1) e TJDFT (P2): estudo de segunda a sexta e revisão no sábado.
3. TCE-GO (P3): sessões terça, quinta e sábado.
4. PRF Administrativo com destaque próprio como trilha complementar e nos cartões de segunda, quarta e sexta.
5. Continuidade da sequência PRFADM01→PRFADM30, sem prioridade numérica nova ou salto de unidade.
6. Domingo protegido, com D7/D20 somente quando estiverem previstos.
7. CSS de uma coluna em telas estreitas, sem agrupamento dos dias ou rolagem horizontal.

## Limites preservados

- Alterações restritas a `RodrigoRosaDantas/central-estudos`; projetos-filhos permanecem READ-ONLY.
- Não foram inventados prioridade 4, duração, horário ou avanço da trilha PRF.
- A agenda continua editorial: não registra presença, conclusão, atraso, desempenho ou progresso.
- Foco da Central, filas, navegação, frases e relógio permanecem independentes da agenda.

## Verificação

- Quality gate local e GitHub Actions Quality + Pages Deploy: PASS/SUCCESS.
- Página publicada conferida: V27, sete dias explícitos, PRF Administrativo e relógio em segundos.
- Breakpoint móvel de uma coluna está automatizado; inspeção visual em viewport móvel permanece pendente porque o navegador só expõe 1363×936.
- Clientes com shell anterior recebem o aviso controlado “Atualizar agora” do PWA.

## Patch 27.0.1 — agenda compacta em celular

- Reorganizar cada cartão para manter o dia à esquerda e as tarefas à direita em larguras móveis.
- Recolher apenas o rótulo-resumo redundante; manter prioridade, tarefa, PRF Administrativo e marcador de descanso.
- Renovar o número do cache e as URLs do runtime/registry para distinguir o app shell novo.
- A inspeção de navegador continua limitada à largura 1363×936; a aceitação visual móvel permanece explicitamente pendente.
