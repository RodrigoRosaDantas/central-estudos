# Roadmap v27.5.0 — fechamento do dia

**Release:** 27.5.0  
**Stage:** PUBLISHED  
**Escopo:** melhorar a leitura da execução diária na Central sem alterar a grade semanal.

## Objetivos concluídos

1. Mostrar previsto, feito, bloqueio editorial e retomada em um fechamento curto junto ao cronograma.
2. Orientar a confirmação do feito na fonte de cada projeto; apontar Evolução para origem e data do estado publicado e Notion para a fonte PRF.
3. Distinguir publicação técnica de execução individual e não criar presença, progresso ou dívida fictícios.
4. Preservar dias, projetos, prioridades P1–P4, foco e rotina PRFADM01–33.
5. Versionar runtime e cache PWA, testar a regressão da grade e manter o app shell dentro do teto autorizado.

## Limites preservados

- Central continua sendo camada de entrada/observabilidade, somente leitura.
- Nenhum estado pessoal de estudo é importado, inferido ou armazenado nesta tela.
- O PRF não tem contrato de status na Central; Notion continua como fonte de verdade.
- Nenhuma escrita em TCE-GO, SEEDF, TJDFT, PRF ou Plataforma de Questões.

## Verificação

A implementação `ff19fb7fd6113dd7dfcadbd098043125814bec6b` passou no workflow **Validate and deploy Central de Estudos**, run [36486528901](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36486528901) (#379). O deploy publicou o artifact Pages `10999012799`. A página aberta em `#agenda-semanal` exibiu v27.5.0, o cronograma preservado e o fechamento do dia.
