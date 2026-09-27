# Critérios de aceitação — v21.0.0

## Experiência inicial
- A abertura apresenta saudação, frase de incentivo, relógio de Brasília e foco em hierarquia clara, sem exigir rolagem para encontrar o primeiro acesso principal em telas comuns.
- A frase é original, não atribuída a pessoa real e escolhida de forma estável usando a data de `America/Sao_Paulo`; não muda a cada recarga.
- O texto não garante aprovação, não afirma que a pessoa estudou e não apresenta progresso fictício.
- O foco continua sendo configurável pelo usuário; retomada continua significando apenas o último ambiente aberto pela Central.

## Data e horário
- O relógio usa exclusivamente `America/Sao_Paulo`, exibe hora e minuto sem segundos e uma data legível em português brasileiro.
- A data e a frase acompanham a virada do dia em Brasília mesmo se o fuso do dispositivo for diferente.
- O relógio atualiza no minuto seguinte e recalcula ao retomar uma aba suspensa; usa leitura acessível sem anunciar a cada segundo.
- Falha de JavaScript ou indisponibilidade de recurso não remove os links estáticos dos projetos.

## Visual, acessibilidade e responsividade
- A nova abertura tem contraste suficiente, foco visível, ordem de leitura coerente, rótulos compreensíveis e alvos de toque adequados.
- Conteúdo reflow sem rolagem horizontal em larguras pequenas; navegação móvel não cobre controles nem texto importante.
- Respeita `prefers-reduced-motion`, zoom e alto contraste.
- Inspecionar visualmente desktop e mobile em viewport real após o deployment, e registrar a evidência usada.

## Integridade e compatibilidade
- Regressões v10–v20 passam; registry, README, changelog, arquitetura, versão e cache do service worker ficam coerentes no fechamento da release.
- Não há novos serviços externos, scripts/fontes remotos, telemetria, endpoints ou writes a dados dos projetos.
- TCE-GO, SEEDF, TJDFT e histórico SEDES/DF mantêm conteúdo, endereços e estado; os três repositórios ativos permanecem sem writes e com os mesmos HEADs do preflight.
- Cache PWA permanece restrito ao shell próprio, navegação segue network-first e requisições fora do escopo/métodos não-GET não são interceptados.
- Shell first-party continua <= 131.072 bytes; reportar tamanho medido e margem.
- `node tests/quality.mjs` passa antes da publicação; workflow de quality e deploy passa; o artefato publicado corresponde ao HEAD validado; pós-deploy QA conclui sem erros críticos.

## Fechamento
Registrar versão, commit, workflow, artefato/digest quando disponível, tamanho/margem do shell, evidência visual, itens não executados, resultados e HEADs finais dos repositórios-filhos. Só então marcar a esteira como `COMPLETE`.
