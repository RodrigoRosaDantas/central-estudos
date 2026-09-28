# Auditoria final — Central de Estudos V27.0.1

**Data:** 27/09/2026 (Brasília)  
**Repositório:** `RodrigoRosaDantas/central-estudos`  
**Commit funcional:** `ac25f7da2c2f7190b4c8fb70c85532df93c3056b`  
**Quality gate + Pages Deploy:** [36365672226 — SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36365672226)  
**Central publicada:** https://rodrigorosadantas.github.io/central-estudos/

## Achados e correções

1. **As mudanças não tinham desaparecido da `main`.** O histórico e os arquivos mostravam a V27 publicada. A página aberta no navegador informou que havia uma atualização do PWA pronta; depois de selecionar **Atualizar agora**, o aviso fechou e a Central permaneceu na tela Hoje com a versão publicada. Um aparelho que ainda guarda a shell anterior pode precisar dessa ação.
2. **A agenda móvel permanecia alta.** A regra anterior empilhava o título do dia e todas as tarefas dentro de cada cartão. A V27.0.1 mantém um cartão separado por dia, mas coloca o nome do dia ao lado da lista compacta e recolhe apenas o resumo redundante. Prioridades e atividades continuam explícitas.
3. **A verificação móvel estava incompleta.** O navegador de QA expõe 1363×936 e não forneceu viewport móvel. A estrutura responsiva e os contratos CSS foram testados; a inspeção visual em celular real segue pendente e não foi marcada como concluída.

## Conferências

- Sete dias na ordem segunda–domingo.
- SEEDF (P1) e TJDFT (P2): estudo segunda–sexta e revisão no sábado.
- TCE-GO (P3): terça, quinta e sábado.
- PRF Administrativo: segunda, quarta e sexta, como trilha complementar.
- Domingo protegido; D7/D20 somente quando previstos.
- Relógio de Brasília `HH:MM:SS`, com atualização segundo a segundo.
- Frases mantêm autoria e link de fonte; os quatro textos e atribuições foram conferidos.
- Agenda continua manual: não registra presença nem calcula execução ou progresso.
- Quality gate local passou; GitHub Actions concluiu Quality gate e Pages Deploy com sucesso.
- TCE-GO, SEEDF, TJDFT e Work Sites permaneceram fora do escopo de escrita.

## Limitação de validação

O deploy foi confirmado no GitHub Pages e o navegador conferiu a versão V27.0.1 em largura 1348×936, sem rolagem horizontal. Não houve inspeção visual em viewport de celular porque essa largura não está disponível no navegador de QA desta sessão.
