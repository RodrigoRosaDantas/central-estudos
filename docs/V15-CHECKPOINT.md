# CHECKPOINT — Nova geração v11 → v15

## Estado
- **Versão de origem:** 10.0.0
- **Versão validada:** 13.0.0
- **Stage:** IN_PROGRESS
- **Active major:** 14.0.0
- **Next major:** 15.0.0
- **Projetos-filhos:** READ-ONLY na v14; contratos v12 já publicados
- **Automação:** nenhuma

## Baseline
- Central HEAD inicial: `fe643fb4d56f8dcba823f340ce4e9f5fbe0fe579`
- Último Pages inicial: `36283766228` — success
- TCE-GO: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Acceptance v11
- Visão Agora prioriza ação e não métricas.
- Foco, retomada e catálogo continuam semanticamente separados.
- Navegação interna funciona por âncoras e teclado.
- Dados técnicos permanecem secundários.
- Nenhuma próxima ação pedagógica é inventada.
- Links diretos dos três projetos permanecem no HTML.
- Sem JavaScript, os três projetos continuam acessíveis.
- Mobile mantém alvos de toque e largura segura.
- Quality gate passa antes de deploy.
- Zero writes nos projetos-filhos.


## QA v11
- Visão Agora: implementada.
- Navegação interna: implementada.
- Eventos locais: implementados.
- Rede adicional da camada v11: zero.
- Fallback/no-JS: preservado.
- App shell: `central-shell-v11.0.0`.
- Quality gate de implementação: PASS — run `36284354940`.
- Deploy de implementação: PASS — run `36284354940`.
- Estado: aguardando pipeline final já com versão/documentação 11.0.0.


## Fechamento v11.0.0
- **Resultado:** PASS
- **Commit validado:** `7090e201e82192fd53703f5d5e35637f20bbf5f7`
- **Pipeline:** `36284442637` — quality success + deploy success
- **Visão Agora:** PASS
- **Navegação PRO:** PASS
- **Eventos locais / zero polling:** PASS
- **Rede adicional na camada v11:** zero
- **Fallback/no-JS:** PASS
- **PWA:** `central-shell-v11.0.0`
- **Projetos-filhos:** SHAs finais iguais ao baseline; zero writes
- **Próxima etapa autorizada:** v12.0.0 — contratos read-only opcionais
- **Regra:** publicar contrato dentro dos projetos-filhos continua exigindo autorização explícita para write neles.


## Snapshot v12.0.0
- **Objetivo:** contratos read-only opcionais, versionados e desacoplados.
- **Autorização desta execução:** publicar somente `public/central-status.json` em TCE-GO, SEEDF e TJDFT.
- **Child HEADs antes do write:** TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`; SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`; TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`.
- **Contratos publicados:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd`.
- **Limite:** nenhum outro arquivo dos filhos pode ser alterado nesta major.
- **Acceptance v12:** registry aceita `statusUrl`; schema v1 documentado; fetch com timeout/cache; contrato inválido/ausente não bloqueia; Diagnóstico indica disponibilidade do contrato; Home v11 ainda não consome `nextAction`; quality + deploy passam.


## QA v12
- Registry schema v2 + statusUrl: implementado.
- Schema de contrato v1: implementado.
- Consumer read-only: implementado.
- Timeout/cache/stale: implementados.
- Diagnóstico: integrado sem expor próxima ação.
- Child contracts: publicados e validados pelos pipelines próprios.
- TCE-GO: quality `36284728160` + Pages `36284741821` — success.
- SEEDF: quality `36284732377` + Pages `36284732375` — success.
- TJDFT: Pages `36284736984` + smoke `36284780388` + visual/E2E `36284736987` — success.
- Estado: aguardando pipeline final da Central v12.0.0.

- **Bloqueio operacional v12:** o run `36285092201` permaneceu `in_progress` no job Quality gate sem steps/logs disponíveis, segurando o run final `36285097988` em `pending`. Código/contratos-filhos já validados estruturalmente; não fechar v12 até um pipeline final da Central concluir `quality + deploy success`.


## Fechamento v12.0.0
- **Resultado:** PASS
- **Commit validado:** `554063372968b6e128ccf7dc70d22f14b564bd1a`
- **Pipeline Central:** `36285194809` — quality success + deploy success
- **Contratos publicados:** PASS nos três projetos
- **Graceful degradation:** PASS
- **Home v11 não antecipou v13:** PASS
- **Projetos-filhos no fechamento:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd`
- **Próxima etapa autorizada:** v13.0.0 — estado operacional na Visão Agora
- **Regra v13:** Central-only; nenhum write adicional nos filhos.


## Snapshot v13.0.0
- **Objetivo:** apresentar estado operacional autorizado na Visão Agora e nos projetos, sem inferência.
- **Central HEAD inicial:** `4b72c99264092a657830049a9c15c362208d8f4b`
- **Último deploy de release validado:** `36285194809` — v12 quality success + deploy success.
- **Child HEADs:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd`.
- **Writes nos filhos:** proibidos nesta v13.
- **Acceptance v13:** exibir phase/cycle/currentUnit/nextAction/alerts somente quando contrato válido existir; distinguir `operational` de `planned`; contrato ausente/invalid/stale não bloquear; foco continua escolha humana; sem ranking, score ou mentor global; mobile/fallback preservados; quality + deploy passam.


## QA v13
- Estado operacional na Visão Agora: implementado.
- Cards operacionais por projeto: implementados.
- Distinção operational/planned/stale: implementada.
- Alertas públicos: implementados.
- Foco humano permanece independente: PASS.
- Rede própria da camada v13: zero.
- Ranking/score/mentor global: ausentes.
- App shell: `central-shell-v13.0.0`.
- Pipeline de implementação: `36285812564` — quality success + deploy success.
- Estado: aguardando pipeline final já com versão/documentação 13.0.0.


## Fechamento v13.0.0
- **Resultado:** PASS
- **Commit validado:** `83696d8471fc24c84fdb72c965bcffd5a2fa58ea`
- **Pipeline:** `36285904184` — quality success + deploy success
- **Estado operacional publicado:** PASS
- **Distinção operational/planned/stale:** PASS
- **Foco humano independente:** PASS
- **Rede adicional da camada v13:** zero
- **Ranking/score/mentor global:** ausentes
- **Projetos-filhos:** sem novos writes na v13; HEADs mantidos nos contratos v12
- **Próxima etapa autorizada:** v14.0.0 — roteamento explicável, sem decidir pelo usuário.


## Snapshot v14.0.0
- **Objetivo:** roteamento explicável por sinais autorizados, sem decidir pelo usuário.
- **Central HEAD inicial:** `0b2f9ec7e0b9ec4bdaa57b075764d785f65818a0`
- **Último deploy validado:** `36285960169` — quality success + deploy success.
- **Child HEADs:** TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd`.
- **Writes nos filhos:** proibidos nesta v14.
- **Acceptance v14:** usuário escolhe a lente; lentes Foco/Retomada/Ações publicadas/Alertas; cada item explica por que aparece; sem ranking/score/recomendação automática; ordem de múltiplos itens segue o catálogo; stale explicitamente marcado; camada sem fetch; fallback/mobile preservados; quality + deploy passam.
