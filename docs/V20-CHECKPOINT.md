# CHECKPOINT — Workspace PRO v16 → v20

## Estado
- **Versão de origem:** 15.0.0
- **Versão validada:** 20.0.0
- **Stage:** COMPLETE
- **Active major:** none
- **Next major:** none
- **Projetos externos:** READ-ONLY
- **Automação:** encerrar/desativar após este fechamento terminal

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


## Release candidate v17 — validação final
- **Gate de coerência corrigido:** commit `5c60c8dbb59489e4519f03cea24d2a8097739578`.
- **Pipeline do gate:** `36329287429` — quality SUCCESS + deploy SUCCESS.
- **Release metadata:** registry e app shell passam a 17.0.0 de forma atômica com README, arquitetura e changelog.
- **Stage:** VALIDATING até quality + deploy + pós-deploy QA deste release candidate.
- **Guarda obrigatória:** conferir novamente os HEADs de TCE-GO/SEEDF/TJDFT antes do fechamento.
- **Regra:** não iniciar v18 nesta execução.


## Fechamento v17.0.0
- **Resultado:** PASS.
- **Commit de release validado:** `1dad7e93f708dd9fdb6361d1da6e65c7687cef64`.
- **Pipeline de release:** `36329426775` — quality SUCCESS + deploy SUCCESS.
- **Pós-deploy QA:** PASS sobre o artefato GitHub Pages `10934629623`, vinculado ao HEAD da release.
- **Digest do artefato:** `sha256:78f719be03520ab255b883896f949f299cb0f4154eccd3781cd42c51749d8540`.
- **Shell auditado no artefato:** 130.106 bytes <= 131.072 bytes.
- **Inbox:** Tudo/Ações/Alertas + filtro por projeto — PASS.
- **Provenance:** contrato publicado/cache recente/cache antigo — PASS.
- **Stale:** “Último estado”, separado de atual — PASS.
- **Ordenação:** catálogo, sem ranking/score/prioridade calculada — PASS.
- **Rede própria da inbox:** zero `fetch(` — PASS.
- **Fallback/no-JS e links diretos:** PASS.
- **Segredos óbvios no shell:** nenhum detectado.
- **Guarda final dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — iguais ao preflight; zero writes.
- **Próxima etapa autorizada:** v18.0.0 — Proveniência e frescor.
- **Estado após fechamento:** Stage=READY; Active major=none; Next major=18.0.0.
- **Regra:** não iniciar v18 nesta mesma execução.


## Preflight v18.0.0
- **Objetivo:** tornar origem, compatibilidade e frescor dos contratos read-only transparentes, sem inferir causa e sem criar nova autoridade de dados.
- **Versão de origem validada:** 17.0.0.
- **Central HEAD antes de qualquer write v18:** `1223c8e29bac578e8735c7ed6ebbee6c2a029b1d`.
- **Último deploy antes da v18:** workflow `36329643685` — completed / success.
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`.
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`.
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`.
- **Acceptance v18:** exibir idade do contrato e da fonte quando datas válidas estiverem publicadas; expor `source.kind`, `source.ref`, `source.status` e `schemaVersion`; indicar compatibilidade do schema sem inferir causa; oferecer refresh manual somente por ação explícita do usuário, reutilizando GET read-only, timeout, validação, cache e fallback stale já existentes; refresh não altera foco/retomada e não bloqueia links; zero writes externos; fallback/no-JS e mobile preservados; shell <= 131.072 bytes; quality + deploy + pós-deploy QA obrigatórios.
- **Riscos:** shell v17 = 130.106/131.072 bytes, apenas 966 bytes livres; a v18 deve recuperar espaço por compactação/refatoração das camadas existentes, sem remover contratos já validados. Datas dos filhos têm granularidades diferentes (date-only e timestamp), portanto idade deve ser descritiva e nunca usada como diagnóstico causal. Refresh manual não pode virar polling nem nova observabilidade automática.
- **Writes externos autorizados:** nenhum.
- **Regra:** processar somente v18 nesta execução; ideias de v19/v20 permanecem fora do escopo.


## Validação funcional v18 — 2026-09-27
- **Commit funcional:** `26863649a47859b5c3fda20b569599633b066ad7`.
- **Pipeline funcional:** `36330011572` — quality SUCCESS + deploy SUCCESS.
- **Artefato Pages:** `10934957909`, digest `sha256:d072481a179ceb6e3d5487cb0a4558b9548113331b084f5f94cc68b53793f158`.
- **Shell:** 130.986 bytes <= 131.072 bytes.
- **Idade do contrato/fonte:** PASS.
- **source/ref/status/schema + compatibilidade:** PASS.
- **Refresh manual:** PASS; evento local → consumidor v12 → GET read-only validado; sem polling.
- **Diagnóstico:** idade permanece descritiva; nenhuma causa é inferida.
- **Fallback/no-JS e links diretos:** PASS.
- **Guarda intermediária dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos.
- **Release metadata:** registry, app shell, README, arquitetura e changelog promovidos atomicamente para 18.0.0.
- **Estado:** VALIDATING até quality + deploy + pós-deploy QA do release candidate.
- **Regra:** não iniciar v19 nesta execução.


## Fechamento v18.0.0
- **Resultado:** PASS.
- **Commit de release validado:** `4f6c02c08045eb3a2022953f50af7c54dd0606a4`.
- **Pipeline de release:** `36330175487` — quality SUCCESS + deploy SUCCESS.
- **Pós-deploy QA:** PASS sobre o artefato GitHub Pages `10935502046`.
- **Digest do artefato:** `sha256:8c4f5fda633e62b3971a3128a5805cacfc1590a600f0ee53dbc201844e74702d`.
- **Shell final:** 130.986 bytes <= 131.072 bytes.
- **Idade do contrato/fonte:** PASS.
- **source.kind / source.ref / source.status / schemaVersion:** PASS.
- **Compatibilidade:** exibida somente após validação do schema — PASS.
- **Refresh manual:** PASS; ação explícita, GET read-only, no-store, timeout, validação, cache/fallback stale e deduplicação.
- **Sem polling / sem inferência causal por idade:** PASS.
- **Fallback/no-JS, mobile e links diretos:** PASS.
- **Coerência registry/README/arquitetura/changelog/app-shell:** PASS.
- **Segredos óbvios no shell:** nenhum detectado.
- **Guarda final dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — iguais ao preflight; zero writes.
- **Próxima etapa autorizada:** v19.0.0 — Views locais.
- **Estado após fechamento:** Stage=READY; Active major=none; Next major=19.0.0.
- **Regra:** não iniciar v19 nesta mesma execução.


## Preflight v19.0.0
- **Objetivo:** permitir views nomeadas e salvas somente neste navegador, compostas exclusivamente por preferências locais já existentes.
- **Versão de origem validada:** 18.0.0.
- **Central HEAD antes de qualquer write v19:** `729295d03da224e70246ec6379a62a206fd364ca`.
- **Último deploy antes da v19:** workflow `36330290685` — completed / success.
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`.
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`.
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`.
- **Acceptance v19:** salvar e nomear views locais; cada view pode capturar somente aba do Workspace, lente de roteamento e filtros da Inbox; aplicar view não altera foco, retomada, favoritos, histórico, contratos nem projetos; restaurar defaults dessas dimensões sem apagar histórico; views são limitadas e validadas; somente a chave allowlisted de views entra no backup de preferências; caches, último acesso e dados técnicos continuam excluídos; zero backend/fetch novo/write externo; fallback/no-JS/mobile preservados; shell <= 131.072 bytes; quality + deploy + pós-deploy QA obrigatórios.
- **Riscos:** shell v18 = 130.986/131.072 bytes, restando apenas 86 bytes. A implementação exige recuperar espaço por refatoração/compactação de código existente antes ou junto da feature; não é permitido elevar o budget. Views não podem virar novo estado global autoritativo nem carregar foco/retomada. Importação exige validação estrita de nomes e valores para não introduzir chaves arbitrárias.
- **Estratégia de estado:** view = snapshot local de `workspace-tab-v15`, `route-lens-v14`, `inbox-type-v19` e `inbox-project-v19`; aplicar view grava somente essas quatro preferências e recarrega a Central. A lista de views usa chave própria allowlisted e permanece limitada.
- **Writes externos autorizados:** nenhum.
- **Regra:** processar somente v19 nesta execução; v20 permanece fora do escopo.


## Validação funcional v19 — 2026-09-27
- **Commit funcional:** `800e9b33b002331d66d4f97b76a15ff9d2f3e5b3`.
- **Pipeline funcional:** `36331143365` — quality SUCCESS + deploy SUCCESS.
- **Artefato Pages:** `10934744543`, digest `sha256:104fa988f14cc71700f89652044583ccb0a47af72a5a8382dd62e87715ac8f36`.
- **Shell funcional:** 130.983 bytes <= 131.072 bytes.
- **Views:** nomeadas, limitadas a 8 e armazenadas somente no navegador — PASS.
- **Escopo da view:** Workspace tab + lente + Inbox type/project — PASS.
- **Foco/retomada/favoritos/histórico/contratos:** não capturados — PASS.
- **Defaults:** active + focus + all/all, sem apagar histórico — PASS.
- **Backup:** views e filtros entram somente pela allowlist; last-project/access-history/health/repo-meta/contracts permanecem excluídos — PASS.
- **Rede própria v19:** zero `fetch(` — PASS.
- **Compactação:** personalização, app, catálogo, PWA, timeline, service worker e manifest preservaram os contratos cobertos pelo quality gate.
- **Fallback/no-JS e links diretos:** PASS.
- **Guarda intermediária dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos.
- **Release metadata:** registry/app-shell/README/arquitetura/changelog preparados atomicamente para 19.0.0.
- **Estado:** VALIDATING até quality + deploy + pós-deploy QA do release candidate.
- **Regra:** não iniciar v20 nesta execução.


## Fechamento v19.0.0
- **Resultado:** PASS.
- **Commit de release validado:** `de8881589d8103c4b114f9cba7356a2559148b6b`.
- **Pipeline de release:** `36331287103` — quality SUCCESS + deploy SUCCESS.
- **Pós-deploy QA:** PASS sobre o artefato GitHub Pages `10935921078`.
- **Digest do artefato:** `sha256:748c8a39ce4d480615de5046aa387ef7a6aed86b4f8bdffda83ae78c23b6ccc2`.
- **Shell final:** 130.983 bytes <= 131.072 bytes.
- **Views locais:** nomeadas, limitadas a 8 e somente no navegador — PASS.
- **Escopo salvo:** Workspace tab + lente + Inbox type/project — PASS.
- **Foco/retomada/favoritos/histórico/contratos:** não capturados — PASS.
- **Defaults:** active + focus + all/all; histórico preservado — PASS.
- **Backup:** views/filtros explicitamente allowlisted; last-project/access-history/health/repo-meta/contracts excluídos — PASS.
- **Compactação semântica:** quality gate completo e funções críticas preservadas — PASS.
- **Rede própria v19:** zero — PASS.
- **Fallback/no-JS, mobile e links diretos:** PASS.
- **Coerência registry/README/arquitetura/changelog/app-shell:** PASS.
- **Segredos óbvios no shell:** nenhum detectado.
- **Guarda final dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — iguais ao preflight; zero writes.
- **Próxima etapa autorizada:** v20.0.0 — Workspace PRO estável / auditoria terminal.
- **Estado após fechamento:** Stage=READY; Active major=none; Next major=20.0.0.
- **Regra:** não iniciar v20 nesta mesma execução.


## Preflight v20.0.0 — auditoria terminal
- **Objetivo:** auditar e consolidar a geração v16→v20 sem adicionar nova responsabilidade funcional.
- **Versão de origem validada:** 19.0.0.
- **Central HEAD antes de qualquer write v20:** `058efaf7d7fac8a41f93d0dbc1556063cfbf43d5`.
- **Último deploy antes da v20:** workflow `36331412124` — completed / success.
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`.
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`.
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`.
- **Acceptance v20:** regressão histórica v10/v15 preservada; contracts v12→v19 preservados; mobile/teclado/a11y estruturalmente auditados; shell <= 131.072 bytes; PWA/offline restritos à Central; segurança/CSP/HTTPS/secrets/escape auditados; registry e documentação coerentes; quality precede deploy; artefato Pages corresponde ao HEAD; zero dependência obrigatória dos projetos externos; zero writes nos filhos; auditoria final integral documentada.
- **Riscos:** shell v19 = 130.983/131.072 bytes, restando apenas 89 bytes; v20 não pode adicionar payload funcional. A inspeção visual interativa real pode não estar disponível, portanto mobile/desktop/a11y/offline serão classificados como estrutural/automatizado quando aplicável, sem inventar validação visual. A rotação `19.0.0→20.0.0` deve manter registry, service worker e documentação sincronizados.
- **Writes externos autorizados:** nenhum.
- **Estratégia:** v20 é major de auditoria/consolidação. Alterações no shell limitam-se à rotação de versão/cache; testes/documentos podem ser ampliados sem entrar no budget de fonte própria.
- **Regra terminal:** não criar v21. Fechar somente após quality + deploy + pós-deploy QA + guarda final dos HEADs-filhos; então Stage=COMPLETE, Active major=none e Next major=none.


## Release candidate v20.0.0 — auditoria terminal
- **Preflight pipeline:** `36331917584` — quality SUCCESS + deploy SUCCESS.
- **Release metadata:** registry, app-shell, README, arquitetura e changelog promovidos de forma atômica para 20.0.0.
- **Auditoria terminal:** registrada em `docs/FINAL-AUDIT-V20.md`.
- **Escopo:** sem nova feature funcional; somente consolidação, auditoria e rotação de versão/cache.
- **Stage:** VALIDATING até quality + deploy + pós-deploy QA + guarda final dos filhos.
- **Regra terminal:** não iniciar v21.


## Bloqueio v20 — contrato textual do workflow
- **Commit:** `46af9817ae3f2199648cf137a9660d1fe6e5d68f`.
- **Pipeline:** `36332053454` — quality FAILURE; deploy SKIPPED.
- **Causa:** o novo teste terminal procurou literalmente `needs: quality`, enquanto o workflow vivo declara a dependência equivalente em YAML multilinha: `needs:` + `- quality`.
- **Evidência:** todos os gates anteriores v9→v19 passaram antes da asserção terminal.
- **Impacto funcional:** nenhum; o workflow continua com deploy dependente de quality.
- **Correção autorizada:** ajustar somente a asserção terminal para aceitar a sintaxe YAML viva; nenhum write em produto ou filhos.
- **Regra:** permanecer em v20; não marcar COMPLETE até novo quality + deploy + pós-deploy QA + guarda final.


## Fechamento terminal v20.0.0
- **Resultado:** PASS — esteira v16→v20 concluída.
- **Commit de release validado:** `8980ec3de229b85722556d5a9bc2ecc185965476`.
- **Pipeline de release:** `36332111657` — quality SUCCESS + deploy SUCCESS.
- **Pós-deploy QA:** PASS sobre o artefato GitHub Pages `10935679416`.
- **Digest do artefato:** `sha256:9f9d0a728fb8129bab5ddf0ef912594165ba5bcaed5cca3069fd2444bdfc3f27`.
- **Shell final:** 130.983 bytes <= 131.072 bytes; margem 89 bytes.
- **Regressão v10/v15:** PASS.
- **v16 Command Palette / v17 Inbox / v18 Proveniência / v19 Views locais:** PASS.
- **Mobile/teclado/a11y/offline:** PASS estrutural/automatizado; nenhuma inspeção visual real foi inventada.
- **Segurança/PWA/registry/documentação/contratos:** PASS.
- **Fallback/no-JS e links diretos:** PASS.
- **Rede própria nas camadas PRO/apresentação:** zero.
- **Contratos:** GET read-only; zero métodos de write.
- **Segredos óbvios no shell:** nenhum detectado.
- **Guarda final dos filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — iguais ao preflight; zero writes.
- **Estado terminal:** Stage=COMPLETE; Active major=none; Next major=none.
- **Regra terminal:** não criar v21 ou qualquer versão além do roadmap v20 sem nova esteira explicitamente definida.


## Manutenção UX pós-terminal — v20
- **Estado da esteira:** permanece COMPLETE; nenhuma v21 foi aberta.
- **Commit funcional:** `6692cfc6361a712131bb34f36ee3899413cd0607`.
- **Pipeline:** `36333688144` — quality SUCCESS + deploy SUCCESS.
- **Artefato Pages:** `10936411822`, digest `sha256:fea4f8b59ce3bd318150ce2c4e63e86143a4fbee9d66935ee880391fc7ae0562`.
- **Shell:** 130.973 bytes <= 131.072 bytes; margem 99 bytes.
- **UX:** navegação com rótulos mais claros (`Concursos` e `Status`), opções renomeadas e experiência mobile anterior preservada.
- **Horário:** saudação usa explicitamente `America/Sao_Paulo` e mostra horário de Brasília.
- **Evolução:** área operacional passa a apresentar fase/ciclo/unidade/próxima ação publicados pelos contratos; resumo usa unidade atual ou identificador da próxima ação, sem percentual inventado.
- **Projetos-filhos:** continuam read-only; nenhuma alteração realizada.


## Manutenção UX contínua — v20
- **Estado da esteira:** permanece COMPLETE; nenhuma v21 foi aberta.
- **Commit funcional:** `9d04c2efef0a78622333929e53f2a85f19dc0b18`.
- **Pipeline:** `36336455463` — quality SUCCESS + deploy SUCCESS.
- **Artefato Pages:** `10937705227`, digest `sha256:89391d7a5753e369b0d6947364b08a6823a8068fdd7aa52ee2510e054b0f0441`.
- **Shell:** 130.771 bytes <= 131.072 bytes; margem 301 bytes.
- **Cabeçalho:** botão `Opções` abre diretamente as preferências locais.
- **Horário:** cabeçalho mostra dia/data + horário de Brasília e atualiza a cada minuto.
- **Evolução:** resumo passa a mostrar quantos projetos possuem contrato válido acompanhado.
- **Navegação:** removidas regras antigas redundantes de 4 colunas; grade principal usa 5 itens.
- **Projetos-filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos; zero writes.


## Manutenção UX — Home e evolução v20
- **Estado da esteira:** permanece COMPLETE; nenhuma v21 foi aberta.
- **Commit funcional:** `9f4ab37745c85b23908fa29acedbabebbea34034`.
- **Pipeline:** `36337115700` — quality SUCCESS + deploy SUCCESS.
- **Artefato Pages:** `10936824711`, digest `sha256:6f3690203e4e4b3b73ba2f228d79d2e9a553f922aa9f920ea0d15b700a9958eb`.
- **Shell:** 130.989 bytes <= 131.072 bytes; margem 83 bytes.
- **Home mobile:** blocos completos de foco/retomada duplicados ficam ocultos; ações equivalentes permanecem na visão Agora.
- **Navegação:** rótulos simplificados para Acessos / Concursos / Histórico / Status; roteamento passa a “Como entrar”.
- **Prioridade visual:** Evolução dos projetos aparece antes do roteamento explicável.
- **Refresh global:** `Atualizar tudo` reutiliza somente eventos `central:contract-refresh`; a camada operacional continua sem `fetch`.
- **Projetos-filhos:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd` — intactos; zero writes.
