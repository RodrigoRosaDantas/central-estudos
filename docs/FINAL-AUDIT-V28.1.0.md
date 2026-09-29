# Auditoria final v28.1.0 — Central ↔ Jornada

**Status:** integração P1–P4 publicada e verificada. O pequeno ajuste de título da aba da Jornada passou nos gates e foi integrado, mas ainda não havia deploy associado observado no momento desta auditoria.  
**Data:** 29/09/2026.  
**Escopo:** auditoria somente leitura dos seis repositórios; mudanças de código restritas às duas centrais. Os quatro projetos individuais não receberam commits.

## Arquitetura encontrada e implantada

Antes da mudança, a Central já mantinha catálogo de projetos e contratos públicos v1, enquanto os projetos individuais permaneciam donos das próprias integrações. A Jornada já mantinha histórico, provas e decisões, mas não apresentava o estado operacional agregado dos quatro projetos.

Depois da mudança, a Central preserva a função diária de responder “o que devo estudar agora?” e evolui o registry existente para schema v3 com códigos P1–P4. A Jornada lê o registry público da Central e faz `GET` nos `statusUrl` declarados para os projetos. Ela exibe fase, ciclo, unidade publicada quando disponível, próxima ação, proveniência e idade do contrato.

Os links entre as duas centrais são atalhos de navegação. A Jornada funciona com seus dados estratégicos se o catálogo ficar indisponível; a Central não depende da Jornada para carregar o plano diário. Os quatro projetos continuam funcionando sem as centrais. Nenhuma das centrais consulta diretamente o Notion, o Supabase ou o campo privado `study`.

## Repositórios, branches, PRs e merges

| Repositório | Branch / PR | Commit integrado | Resultado |
|---|---|---|---|
| `central-estudos` | `ecosystem-integration-v1`, PR #28 | `ad9032a4f56b0e9087972a576a5e906c523ad6cd` | Merge após quality gate e auditoria de segurança; registry `28.1.0` publicado. |
| `plano-de-transicao` | `journey-ecosystem-v1`, PR #27 | `050912c1da87929152baee99507fe9d9596fa764` | Merge após suíte de qualidade e UI. |
| `plano-de-transicao` | `fix/journey-renderer-cache-bust-20260929`, PR #28 | `1192837c129123f852bfeefad0e5cc49670792e7` | Merge após atualizar a URL cache-busted do renderizador. |
| `plano-de-transicao` | `fix/journey-tab-title-20260929`, PR #29 | `5f3a55a2644d0a381f1fe67c2c63bf26a26aff43` | Merge após suíte completa; ajuste cosmético do título, aguardando confirmação de Pages. |

## Checks, segurança e publicação

- Central PR #28: quality run #437 / `36617960575` passou. Pages no merge da Central: run `36619039505` passou.
- Jornada PR #27: quality/UI run #525 / `36618628710` passou. A sincronização Notion `36619195972` passou e o Pages atualizado passou no run `36619225567`.
- Jornada PR #28: quality/UI run #527 / `36620552550` passou. No merge, a quality run `36620854463` e a sincronização Notion `36620854404` passaram; o sync criou somente `data/snapshot.json`, commit `390094ebe647c37165a5d3b24c62f693fceef700`. Pages para esse estado passou no run `36620886883`.
- Jornada PR #29: audit e UI run #529 / `36621491486` passaram. O merge está em `main`, mas não foi observado um Pages build/deploy para o SHA `5f3a55a2644d0a381f1fe67c2c63bf26a26aff43` nesta checagem.
- O scan estático não encontrou secrets, tokens ou chaves administrativas nos arquivos frontend alterados. Os testes verificam uso de DOM seguro, ausência de leitura de progresso privado e ausência de credenciais no cliente. Permissões de workflow e publicações existentes foram preservadas.
- Nenhum histórico, cronograma ou contrato dos projetos-filhos foi alterado. Nenhum segredo foi lido ou replicado.

## Estado vivo dos contratos P1–P4

Os dados abaixo foram lidos na Jornada publicada em 29/09/2026. Campos sem publicação aparecem como “Não publicada”, nunca como zero ou atividade inexistente.

| Código / projeto | Estado do contrato | Sinais públicos observados |
|---|---|---|
| **P1 — SEEDF** | `synced`, publicado em 29/09 | Pré-edital; Fase 1; ciclo Leis Primeiro; unidade L04; próxima ação L05 — LC DF nº 840/2011. |
| **P2 — TJDFT** | `partial`, publicado em 28/09 | Preparação; F-TJ-01 Núcleo comum; ciclo Português Primeiro + RLM Preventivo; unidade P01; próxima P02. O cartão avisa que o snapshot é parcial. |
| **P3 — TCE-GO** | `published`, publicado em 27/09 | Edital publicado; ciclo D001–D100 · S01–S47; unidade atual não publicada; próxima ação D008. Sinal de publicação antiga: 2 dias de calendário em Brasília. `study` privado não é consumido. |
| **P4 — PRF Administrativo** | `synced`, publicado em 29/09 | Pré-edital; ciclo Roda contínua PRF Administrativo; volta 1; unidade atual não publicada; próxima sessão PRFADM01. |

Esses cartões representam contratos públicos, não confirmam estudo individual nem substituem a fonte de verdade de cada projeto.

## QA e regressões

- Central: `node tests/quality.mjs` aprovado localmente e no workflow do PR #28. A regressão manteve o foco TCE-GO e a grade semanal; os links e o catálogo de projetos passaram.
- Jornada: auditorias estáticas e workflow `quality.yml` aprovados. Playwright percorreu os quatro contratos, ações planejadas/operacionais, contrato parcial e antigo, ausência de unidade, falha de catálogo, erro HTTP, atualização manual e as larguras desktop/mobile de 390 px.
- Inspeção pública em desktop confirmou os quatro cartões, links individuais, título, atualização de status e o atalho “Estudar agora”. O Painel estratégico usa cache PWA `plano-transicao-v53-ecosystem-v1`.
- No momento da checagem, o Pages ainda servia `work-app.js?v=39&home=38`, embora o PR #29 com `v40&home=38` esteja integrado. Assim, o título atualizado está **não comprovado em produção**; a integração P1–P4 continua publicada no renderer v39.

## URLs publicadas

- [Central Operacional](https://rodrigorosadantas.github.io/central-estudos/)
- [Registry público P1–P4](https://rodrigorosadantas.github.io/central-estudos/config/projects.json)
- [Jornada — Painel Estratégico](https://rodrigorosadantas.github.io/plano-de-transicao/#journey)

## Pendências reais

- Confirmar o Pages do merge PR #29. A publicação da integração não está bloqueada: os quatro cartões e os contratos estão live; somente a atualização cosmética para o título de aba “Jornada · Painel Estratégico” ainda não foi observada em produção.
- Os sinais parciais/antigos e as unidades não publicadas em TJDFT, TCE-GO e PRF representam o estado declarado pelas fontes. Esta integração os expõe claramente e não tenta inferir valores privados ou fabricar progresso.
