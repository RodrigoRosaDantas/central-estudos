# Experiência de estudo — v28.7.0 / v28.7.1

Entrega de 02/10/2026.

## Escopo

1. Home com três projetos ativos em P1–P3, grade do dia, próximo passo publicado e atalhos reais.
2. Revisões e erros por projeto, com consulta manual dos estados publicados.
3. Navegação com Hoje, Projetos, Revisões e Mais; barra inferior no celular e lateral no computador.
4. Acesso ao formulário de tempo aberto no dia de hoje com o projeto escolhido; atualização da Home após alterações feitas pelo tracker existente.

Timer, comparação semanal, mudança de tema e sincronização de origem ficam para outra entrega. A regra automática de 1h por conclusão elegível permanece no tracker existente; abrir um atalho não gera sessão.

## Critérios de aceite

- P1 SEEDF, P2 TJDFT e P3 PRF Administrativo; TCE-GO e SEDES continuam no histórico.
- Grade extraída da agenda canônica: PRF na segunda, quarta e sexta; sábado de revisão; domingo de descanso.
- Minutos registrados, próxima ação e último bloco confirmado têm campos e fontes separados.
- Dado ausente é “Não informado”, nunca zero ou conclusão presumida. Cache anterior é identificado.
- Revisões/erros usam somente campos publicados nos contratos; nenhum erro individual é inventado.
- Material e questões da SEEDF/TJDFT abrem a unidade publicada quando o código é conhecido; fallback é a trilha. PRF abre a leitura no site, questões no Notion e a página existente de execução/erros.
- Links antigos, Mentor, Jornada, acesso rápido por teclado e views locais continuam funcionando.
- Formulário seleciona somente projeto ativo e não preenche confirmação ou duração.
- Sem mudança de banco, políticas de acesso, Notion, repositórios-filhos ou dados existentes.
- Contratos, manifesto, cache exato e orçamento PWA de 256 KiB bruto / 80 KiB gzip passam no gate.
- Sem rolagem horizontal nas telas principais em 320, 390, 768 e 1363 pixels; controles de toque com pelo menos 44 pixels.

## Base e isolamento

Central/main: `18cb6efce400153318e0b322c54e0f9249045710` (v28.6.3).

HEADs consultados, somente leitura:

- SEEDF: `64b1b6e68e7cc5de139ecc589f9c5bf30dbe8eb1`.
- TJDFT: `fbecaa2770a7c6641c383148db0413056ad12874`.
- PRF: `d08a4bc0da46303178344be03df731edb96e8d59`.
- TCE-GO: `db9b47956433b73b40477e2a2e76daee8d463372`.

Os destinos foram conferidos no código desses projetos. Alterações externas posteriores não fazem parte desta entrega.

## Validação

Gate determinístico: `node tests/quality.mjs`, incluindo cenários novos em `tests/daily-workspace.mjs`.

A verificação visual deve usar a aplicação real com contratos publicados. Nenhum registro de estudo de teste deve ser criado. A prévia local não é uma publicação e não é um endereço externo compartilhável.

### Resultado nesta entrega

- Gate completo e cenários funcionais novos: PASS.
- Material SEEDF L06 e material TJDFT P03: abertos e confirmados no navegador; âncora das questões da L06 conferida no DOM público.
- Prévia da aplicação local: bloqueada pelo navegador com `ERR_BLOCKED_BY_CLIENT`. Não há alegação de validação visual em 320/390/768/1363 nesta entrega. Essa verificação continua pendente antes de considerar o aceite visual completo.
- As telas de revisão apresentadas na conversa reproduzem a marcação gerada pelo código da branch, com dados públicos capturados em 02/10 e sem carregar o tempo pessoal. Não são um deploy.

### Publicação e conferência online

- v28.7.0 integrada pela PR #49, commit `7c7bec549fa2a728d30c14dc2691f2ab45f1cb23`.
- Workflow `37044141518`: Quality gate e Deploy concluídos com sucesso.
- Aplicação online conferida: Hoje, Revisões, Mais, Projetos e Histórico; atualização manual dos contratos concluída e somente a tela solicitada visível.
- Sem rolagem horizontal nas telas conferidas no viewport desktop de 1348/1363 pixels. Não houve ajuste de viewport para as larguras móveis.
- A conferência online detectou que Registrar tempo selecionava o projeto, mas mantinha o formulário recolhido. A v28.7.1 abre o painel, atualiza a data e retira o contexto guiado anterior; o novo cenário funcional cobre esse fluxo sem salvar registros.
- v28.7.1 integrada pela PR #50, commit `b380142d4ea3e3afd73c6a7cc6e77c1401e149e9`. Workflow `37045154849`: Quality gate e Deploy concluídos com sucesso.
- Fluxo corrigido confirmado online: registro guiado SEEDF, seleção de 29/09, retorno à Home e atalho PRF. O formulário ficou visível, projeto PRF selecionado, data 02/10, contexto anterior oculto, duração vazia e confirmação desmarcada. Nenhum bloco foi salvo.
- Atualização da PWA aplicada pelo aviso existente; Home carregada na v28.7.1 e atalhos medidos com 44 pixels de altura. Nenhum erro da aplicação observado no console; os erros presentes vieram da extensão do navegador de conferência.
- Orçamento final: 239.163 bytes bruto / 74.750 bytes gzip. Captura real da Home salva durante a conferência de 02/10/2026, 15:10 em Brasília.
