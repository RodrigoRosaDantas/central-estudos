# Roadmap — Nova geração v11 → v15

Esta é uma nova esteira, iniciada após o fechamento terminal da v10. A antiga esteira v1→v10 permanece congelada em `docs/V10-CHECKPOINT.md`.

## Princípio

> A Central observa, organiza e direciona. Os projetos executam, ensinam e decidem.

Nenhuma evolução desta esteira deve transformar a Central em banco mestre, mentor pedagógico global ou dependência obrigatória dos projetos.

## v11 — Central PRO / UX

Objetivo: transformar a Home em uma cabine de entrada mais simples e acionável.

Escopo:
- Visão Agora;
- navegação clara entre Agora, Projetos, Atividade e Diagnóstico;
- ações rápidas sem duplicar dashboards;
- hierarquia visual que reduz o peso dos dados técnicos;
- mobile-first;
- manter fallback/no-JS e links diretos;
- nenhuma leitura de estado pedagógico inexistente.

## v12 — Contratos read-only opcionais

Objetivo: a Central poder consumir um contrato versionado publicado por cada projeto.

Escopo previsto:
- suporte opcional a `statusUrl` no registry;
- schema público versionado e desacoplado;
- graceful degradation quando contrato não existe;
- nenhuma dependência do Supabase/schema interno do filho.

**Importante:** publicar o contrato dentro dos projetos-filhos exige autorização explícita para write neles. A Central pode preparar o consumidor, mas não deve editar os filhos por conta própria.

## v13 — Estado operacional

Objetivo: quando contratos v12 existirem, mostrar próxima ação, unidade atual, alertas e progresso autorizados pelo próprio projeto.

Sem contrato:
- não inferir próxima ação;
- não fabricar progresso;
- continuar funcionando como launcher/observabilidade.

## v14 — Roteamento

Objetivo: organizar sinais autorizados para facilitar escolha humana.

Permitido:
- destacar prazo/pendência/estado fornecido pelo projeto;
- filtros e agrupamentos;
- explicar por que um item aparece.

Fora de escopo:
- mentor pedagógico global;
- pontuação secreta;
- substituir decisões dos dashboards-filhos.

## v15 — Workspace de concursos

Objetivo: catálogo de projetos ativos, arquivados e futuros.

Previsto:
- status ativo/arquivado;
- histórico de concursos;
- inclusão de novos projetos via registry/contrato;
- exportação/importação local das preferências da Central;
- nenhuma base mestre obrigatória.
