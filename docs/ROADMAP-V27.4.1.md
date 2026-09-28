# Roadmap v27.4.1 — frase do Major Cadar no desktop

**Release:** 27.4.1  
**Stage:** RELEASED  
**Escopo:** reorganizar o cabeçalho da Central em telas desktop para usar o espaço vazio ao lado do título e dar mais presença ao cartão da frase.

## Objetivos

1. Exibir título, saudação e frase num cabeçalho desktop equilibrado, sem uma grande área vazia à direita.
2. Ampliar a frase e manter autoria e fonte legíveis.
3. Preservar as seis citações verificadas e o rodízio de cinco minutos.
4. Manter o fluxo vertical em telas menores, sem alterar navegação, foco, dados ou destinos externos.
5. Renovar o cache da PWA sem ultrapassar os tetos vigentes de 147.456 bytes brutos e 49.152 bytes gzip.

## Verificação

- O Quality gate local cobre o novo layout desktop, as URLs versionadas, a atribuição e a rotação existente.
- Workflow #374, Quality gate e Pages Deploy concluídos com sucesso no commit `e4c82409a75b56a0c30b93ac57441acd0f042e8a`.
- QA visual publicado em 1363×936 confirmou o painel de 588×154 px, sem rolagem horizontal; atualizar a PWA concluiu e a versão permaneceu em v27.4.1.
- Shell medido em 147.255/147.456 bytes bruto e 47.857/49.152 bytes gzip.
