# Critérios de aceitação v27.8.0 — Mentor adaptativo sem API

## Inteligência local
- [x] Mentor calcula sugestão usando apenas grade vigente e blocos reais da Central.
- [x] Nenhuma chamada à OpenAI API, LLM externo ou serviço pago é adicionada.
- [x] O foco escolhido pelo usuário nunca é alterado automaticamente.
- [x] A recomendação informa nível de confiança e fatores utilizados.
- [x] Ausência de registro é descrita como “sem registro na Central”, sem afirmar que o estudo não ocorreu.
- [x] Acertos, erros, domínio e matéria fraca não são inferidos sem dados explícitos.

## Fechamento e UX
- [x] Fechamento do dia separa previsto, registrado, pendente no registro e Mentor.
- [x] Estado estático antigo de 28/09 não permanece como se fosse atual.
- [x] Interface funciona em desktop e mobile, com alvos de toque adequados.
- [x] O Mentor continua explicável por “Por que o Mentor sugeriu isso?”.

## Arquitetura e custo
- [x] central_study_logs e o log local permanecem as únicas fontes de tempo da Central.
- [x] Nenhuma tabela de TCE-GO/TJDFT/SEEDF/PRF é alterada.
- [x] operational-v13.js/CSS permanecem fora do APP_SHELL para preservar o teto offline.
- [x] Quality gate existente continua aprovado.
