# Contrato público de status da Central — v1

## Objetivo e escopo

O contrato `central-status.json` permite que cada projeto publique um resumo pequeno, sanitizado e explícito para consumo da Central de Estudos e da Jornada. Ele não replica dashboards, bancos, cronogramas internos ou dados pessoais.

A versão do contrato é `schemaVersion: 1` e seu schema está em `config/status-contract.schema.json`. O catálogo compartilhado usa `schemaVersion: 3` em `config/projects.json`; o número de versão do catálogo não altera a versão do contrato.

## Prioridades e projetos

A ordem operacional da Central é fixa por prioridade:

| Prioridade | Projeto | Motivo informado |
| --- | --- | --- |
| P1 | SEEDF | Concurso autorizado no DF, onde o estudante mora. É o foco padrão. |
| P2 | TJDFT | Meta de médio/longo prazo ligada à União, com o estudante em Brasília. |
| P3 | TCE-GO | Primeiro contato com materiais específicos e preparação exploratória para possível atuação em auditoria. |
| P4 | PRF Administrativo | Concurso federal no radar para acompanhar e conhecer o conteúdo se houver edital. |

P3 e P4 ocupam dias diferentes na grade. O catálogo e as integrações não reordenam, juntam, compensam ou recalculam a agenda. A Plataforma de Questões é uma ferramenta transversal e não recebe prioridade de concurso. SEDES/DF permanece arquivada; sua presença em radares institucionais não a reativa como trilha de estudo.

## Quem publica e quem consome

- Cada dashboard de projeto é responsável por produzir e validar seu próprio contrato em `/central-status.json`.
- A Central e a Jornada são consumidoras somente de leitura. Consultam o catálogo e os contratos públicos; não escrevem de volta, não conectam ao Notion e não recebem acesso a progresso privado.
- A Central é a superfície operacional do estudo. A Jornada é um painel estratégico de transição e acompanhamento; não substitui os dashboards dos projetos nem altera sua execução.
- Ausência, erro de rede, JSON inválido ou versão incompatível do contrato não bloqueiam o acesso direto ao projeto. Dados em cache devem ser identificados como antigos.

## Campos de topo

O schema é deliberadamente estrito e não aceita propriedades extras.

- `schemaVersion`: inteiro `1`.
- `projectId`: identificador estável que coincide com o catálogo.
- `publishedAt`: data em que este contrato foi publicado, no formato ISO `YYYY-MM-DD`.
- `source`: origem pública usada pelo próprio projeto. `source.updatedAt` é a data/hora da fonte; pode ser `null` se desconhecida e pode diferir de `publishedAt`.
- `state`: fase, ciclo, unidade atual, próxima ação e alertas curtos.
- `study`: resumo opcional e sanitizado da evidência de estudo; ausente quando o projeto não publica esse tipo de dado.

Em `state.nextActionKind`:

- `operational`: ação derivada de estado operacional explicitamente confirmado.
- `planned`: ação baseada em plano ou calendário; não prova que houve execução.
- `manual`: link ou instrução para consultar o projeto.
- `none`: nenhuma próxima ação disponível.

## Evidência de estudo e valores desconhecidos

Quando existir, `study.evidence` distingue `confirmed`, `partial`, `planned` e `unavailable`. Os campos de estudo descrevem somente o que a fonte autorizada demonstra.

- Unidade atual, última unidade integralmente concluída e próxima unidade são fatos diferentes. Uma sessão concluída em uma unidade não conclui automaticamente leitura, material ou todos os passos daquela unidade.
- `null` significa desconhecido, indisponível ou não comprovado. Não converter ausência em zero, data atual, conclusão ou previsão.
- Contagens só são publicadas quando a fonte fornece valores numéricos válidos. Duração, total planejado, revisões e outros campos sem cobertura permanecem `null`.
- `source.updatedAt` e `study.updatedAt` acompanham a atualização real da fonte usada. Não usar o horário do workflow como se o conteúdo tivesse mudado.

## Regras por projeto

- **SEEDF (P1):** o contrato é gerado automaticamente a partir dos snapshots sincronizados com o Notion. O registro de sessão, os registros de questões, erros e dias completos são coleções diferentes. Uma sessão de questões concluída em L05 pode atualizar a unidade atual e as métricas acumuladas sem marcar L05 integralmente concluída quando leitura/material ou D0 continuam pendentes. Não editar `public/central-status.json` manualmente nem inventar dados; corrigir o parser ou o gerador e deixar o sync reproduzir a fonte.
- **TJDFT (P2):** estado parcial deve permanecer marcado como parcial; métricas sem evidência e progresso não coberto preservam `null`.
- **TCE-GO (P3):** publicar somente a próxima ação do calendário público. Usar `nextActionKind: "planned"`; `currentUnit`, última conclusão, data de estudo, métricas, sessões e revisões ficam `null` porque o contrato não recebe progresso privado. O momento de publicação acompanha `snapshot.generatedAt`, não o horário de execução do workflow.
- **PRF Administrativo (P4):** separar conteúdo editorial disponível de execução pessoal. Se o projeto não publicar sessões de estudo confirmadas, métricas e datas de execução permanecem desconhecidas; não inferir progresso a partir de materiais ou questões preparados.

## Segurança, cache e falhas

- Publicar apenas dados aprovados para consumo público. Não incluir tokens, IDs privados, e-mails, respostas individuais ou conteúdo interno do Notion.
- O contrato é saída unidirecional do projeto. Central e Jornada fazem GET público e não escrevem na origem.
- Contrato ausente, schema inválido, timeout, indisponibilidade ou conteúdo incompatível resulta em estado indisponível, não em progresso presumido.
- Cache local é uma cópia de último conhecimento, não evidência atual; a interface deve identificá-lo como cache antigo.
- Não buscar snapshots grandes como fallback automático e não fazer scraping de páginas do dashboard para reconstruir progresso.
- Atualizar workflow, builder e testes junto com o contrato. Os workflows devem usar permissões mínimas para sua função e não podem conter JWT ou tokens fixos.

