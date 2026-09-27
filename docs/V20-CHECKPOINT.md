# CHECKPOINT — Workspace PRO v16 → v20

## Estado
- **Versão de origem:** 15.0.0
- **Versão validada:** 16.0.0
- **Stage:** VALIDATING
- **Active major:** 17.0.0
- **Next major:** 18.0.0
- **Projetos externos:** READ-ONLY
- **Automação:** ativa até o fechamento terminal v20

## Baseline v16
- **Central HEAD inicial:** `d2854585560b58a86a13ae9d16c4061dd85436d9`
- **Último pipeline inicial:** `36295240838` — success
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`
- **SEDES/DF histórico:** `2250808a4d02b825c21c9382bf3ffb83150ce982`
- **Shell v15:** 122.134 bytes
- **Budget v16+:** <= 131.072 bytes (128 KiB)

## Fechamento v16.0.0
- **Resultado:** PASS
- **Commit validado:** `cfbac82a6bc1b9d924ef5b34f5f40884deb3be38`
- **Pipeline:** `36312910219` — quality success + deploy success
- **Shell final:** 129.424 bytes <= 131.072 bytes
- **Projetos externos:** zero writes; HEADs finais iguais ao preflight v16

## Preflight v17.0.0
- **Objetivo:** reunir ações publicadas e alertas em uma inbox local, filtrável e explicável.
- **Versão de origem validada:** 16.0.0.
- **Central HEAD antes de qualquer write v17:** `2a3d7d6a2a0ab372749480079060bf90a23ca787`.
- **Último deploy antes da v17:** workflow `36313034426` — success.
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`.
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`.
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`.
- **Acceptance v17:** inbox reúne somente ações/alertas vindos de contratos já validados; filtros por ação/alerta/projeto; provenance explícita; stale separado de atual; ordem sem ranking/score; zero fetch próprio; zero writes externos; fallback/mobile preservados; shell <= 128 KiB; quality + deploy + pós-deploy QA obrigatórios.
- **Riscos:** shell v16 encerrou em 129.424/131.072 bytes, deixando ~1,6 KiB; v17 deve priorizar reuso/refatoração da camada operacional. Contratos indisponíveis/stale não podem bloquear navegação.
- **Writes externos autorizados:** nenhum.

## Histórico de bloqueios v17
- `f208bd605aa7b43189daee707073d056747544dd` / pipeline `36319858954`: quality failure por teste legado dependente de espaçamento em `kind === "planned"`; deploy skipped.
- `53a04446a14481122004eff52b5d398e906e9dfb` / pipeline `36323085886`: novo bloqueio em contrato textual legado da v14.
- Correções foram mínimas e restritas à Central; nenhum projeto-filho foi alterado.

## Validação v17 — 2026-09-27
- **Commit de implementação corrigida:** `88f998b52da91744ed91375b0d5965cdda8f41e1`.
- **Pipeline:** `36326686908` — COMPLETED / SUCCESS.
- **Quality gate:** PASS.
- **Deploy GitHub Pages:** PASS.
- **Inbox:** filtros Tudo/Ações/Alertas + projeto implementados sobre contratos v12 já validados.
- **Provenance:** origem exibida como contrato publicado/cache recente/cache antigo.
- **Stale:** separado semanticamente como “Último estado”.
- **Ordenação:** ordem do catálogo; sem ranking/score.
- **Rede própria v17:** zero; `operational-v13.js` continua sem `fetch(`.
- **Fallback/no-JS:** estrutura estática preservada; inbox é progressive enhancement.
- **Guarda dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos.
- **Release metadata em validação:** registry alterado para `17.0.0` e app shell rotacionado para `central-shell-v17.0.0`.
- **Estado atual:** VALIDATING. A v17 só será fechada após o pipeline disparado pelos commits de release metadata concluir quality + deploy e o pós-deploy QA ser reconciliado.
- **Regra:** não iniciar v18 nesta execução.
