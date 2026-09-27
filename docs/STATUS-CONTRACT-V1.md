# Contrato de status da Central — v1

A v12 define um contrato público, pequeno e opcional entre cada projeto e a Central.

## Objetivo

Permitir que um projeto publique somente o estado que autoriza a Central a consumir, sem expor banco, Supabase, Notion, progresso privado ou o schema interno completo do dashboard.

O contrato é servido em:

`<projeto>/central-status.json`

e validado conceitualmente por `config/status-contract.schema.json`.

## Campos

- `schemaVersion`: versão do contrato, atualmente `1`;
- `projectId`: ID estável igual ao registry;
- `publishedAt`: data de publicação do contrato;
- `source`: origem pública usada pelo próprio projeto;
- `state.phase`: fase operacional publicada;
- `state.cycle`: ciclo publicado, quando existir;
- `state.currentUnit`: unidade atual autorizada, quando existir;
- `state.nextAction`: próxima ação autorizada pelo projeto;
- `state.nextActionKind`:
  - `operational`: vem de estado operacional explícito;
  - `planned`: vem de calendário/plano público, não de progresso confirmado;
  - `manual`: publicado manualmente pelo projeto;
  - `none`: nenhuma ação publicada;
- `state.alerts`: avisos públicos curtos.

## Regras de segurança

- contrato é somente leitura para a Central;
- nenhum token, ID privado, e-mail, desempenho individual ou dado sensível;
- a Central nunca escreve de volta pelo contrato;
- contrato ausente, inválido ou indisponível não bloqueia o acesso ao projeto;
- cache local pode ser usado, mas deve ser marcado como cache/stale;
- a Central não deve inferir campos ausentes;
- a Central não deve ler snapshots grandes como fallback automático.

## Projetos v12

- TCE-GO: contrato baseado em calendário público; `nextActionKind=planned`, sem progresso privado;
- SEEDF: contrato baseado no `dashboard.next_action` já publicado no snapshot;
- TJDFT: contrato baseado no `dashboard.next_action` já publicado, com alerta de snapshot parcial.

## Separação v12 × v13

A v12 implementa **transporte, validação, cache e diagnóstico**.

A v13 poderá apresentar `nextAction`, `currentUnit` e demais campos na Visão Agora. Até lá, a Central não usa esses campos para orientar a Home.
