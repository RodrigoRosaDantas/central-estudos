# CHECKPOINT — Workspace PRO v16 → v20

## Estado
- **Versão de origem:** 15.0.0
- **Versão validada:** 16.0.0
- **Stage:** BLOCKED
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

## Validação funcional v17 — 2026-09-27
- **Commit de implementação corrigida:** `88f998b52da91744ed91375b0d5965cdda8f41e1`.
- **Pipeline:** `36326686908` — quality SUCCESS + deploy SUCCESS.
- **Inbox:** filtros Tudo/Ações/Alertas + projeto implementados sobre contratos v12 já validados.
- **Provenance:** contrato publicado/cache recente/cache antigo explicitados.
- **Stale:** separado semanticamente como “Último estado”.
- **Ordenação:** ordem do catálogo; sem ranking/score.
- **Rede própria v17:** zero; camada operacional continua sem `fetch(`.
- **Fallback/no-JS:** estrutura estática preservada; inbox é progressive enhancement.
- **Guarda dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos.

## Bloqueio de release metadata v17
- Ao tentar rotacionar registry/app-shell para 17.0.0, o pipeline `36328690026` falhou no quality gate e o deploy foi corretamente skipped.
- Causa identificada no gate: `testReleaseDocumentationCoherence` ainda exige literalmente `central-shell-v16.0.0` para qualquer major >=16 e README/arquitetura ainda estão no estado documental v16.
- Não foi mascarado sucesso nem avançada a v18.
- Correção conservadora aplicada: registry restaurado para a versão validada `16.0.0` (`9172e826bb397df5c7723538d55459c38517c2d4`) e app-shell restaurado para `central-shell-v16.0.0` (`79b919738cbf11a5b2652c96d7d5469ba3f9b5b7`).
- **Estado atual:** BLOCKED até o quality gate voltar a verde nessa base e a coerência documental/testes de release ser preparada para o fechamento v17.
- **Regra:** continuar somente v17; não iniciar v18.
