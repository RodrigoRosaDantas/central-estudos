# Central de Estudos

Camada de entrada para os projetos de estudo TCE-GO, SEEDF, TJDFT e PRF Administrativo, com uma seção separada para a Plataforma de Questões e um registro local de tempo estudado.

> **A Central observa e direciona. Os projetos executam e decidem.**

A Central não altera nem replica o conteúdo dos projetos. O registro de estudo é preenchido pelo usuário e fica neste navegador; não sincroniza com os projetos nem com o Notion.

## Estado atual — v27.6

A v27.6.0 acrescenta o registro diário de estudo por bloco: data, projeto, trilha/matéria, tópico opcional, duração em horas e minutos e confirmação explícita. Hoje e semana mostram o tempo somado; cada projeto detalha as horas por trilha e tópico. A grade semanal permanece intacta. O registro é salvo localmente neste navegador, com exportação e restauração de backup JSON; não há sincronização automática com Notion nem com outros aparelhos. Horas registradas medem tempo informado, não domínio ou progresso. A v27.6.1 ajusta a disposição dos campos de horas e minutos.

O fechamento do dia da v27.5.0 continua separando grade prevista, bloqueio editorial e retomada. Os contratos em Evolução mostram a origem e a atualização do estado publicado; esses sinais não confirmam uma sessão individual. O PRF continua sem contrato de status e mantém o Notion como fonte de verdade.

O teto do app shell para a linha pós-v20 é 144 KiB bruto e 48 KiB gzip, autorizado em 28/09/2026 e registrado em [`docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md`](docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md). O limite histórico v16→v20 permanece 128 KiB; novos aumentos exigem autorização explícita.

A V27 apresenta um cartão para cada dia da semana e a V27.0.1 compacta a grade em celulares sem esconder tarefas nem mudar a ordem de prioridades.

- Retomada mostra separadamente o foco escolhido e o último acesso local; acesso não representa estudo ou progresso.
- Projetos reúne os quatro projetos ativos; a Plataforma de Questões tem cartão próprio, fora da contagem de concursos.
- Inbox tem filtros próprios por tipo e projeto; o Radar mantém a visão completa dos contratos disponíveis.
- Evolução reúne Radar, Mentor, preferências e estado técnico.
- Views locais salvam também a tela atual; views anteriores sem esse campo continuam abrindo em Hoje.
- Prioridades: SEEDF (P1), TJDFT (P2), TCE-GO (P3) e PRF Administrativo (P4). SEEDF e TJDFT estudam de segunda a sexta e revisam no sábado; TCE-GO tem sessões terça, quinta e sábado.
- PRF-ADM segue segunda, quarta e sexta, na sequência PRFADM01→PRFADM33, sem pular códigos quando uma sessão é perdida.
- As frases do Major Cadar alternam automaticamente a cada cinco minutos, com autoria e link da fonte, sem chamada externa automática.
- Relógio de Brasília usa `America/Sao_Paulo` e atualiza a cada segundo.
- O cronograma apresenta os sete dias em cartões individuais e usa linhas compactas em telas estreitas.
- A grade não muda o foco. O tempo estudado só aparece após lançamento e confirmação explícitos; a Central não infere sessão, duração, domínio ou progresso a partir do cronograma ou de sinais técnicos.
- O cartão do PRF abre o site GitHub Pages e mantém um link separado para a fonte de verdade no Notion; a Central só verifica disponibilidade do site e metadados públicos do repositório.
- A Plataforma de Questões abre o site independente e não entra na prioridade nem nos indicadores dos concursos.
- Cada tela possui âncora direta; sem JavaScript, os links diretos dos quatro projetos e da ferramenta continuam disponíveis.
- contratos read-only, sem chamadas novas, sem ranking ou progresso inferido;
- TCE-GO, SEEDF, TJDFT, painel e repositório do PRF, Notion e Plataforma de Questões permanecem fora de qualquer escrita pela Central.

### Base v23 — Hoje, Radar e Mentor

A v23 consolidou o Centro de Comando em execução diária, com foco escolhido, Radar Operacional e Mentor de execução.

### Base v22 — Centro de Comando

A v22 consolidou a primeira dobra como cockpit operacional com linguagem visual inspirada no TDAS.

### Base v21 — Presença e Ritmo

A v21 introduziu saudação, frase diária e relógio de Brasília, preservados na v22.

### Base v20 — Workspace PRO estável

A v20 fechou a geração **Workspace PRO v16→v20** e preservou o shell central-shell-v20.0.0 como baseline histórico.

- regressões históricas v10/v15 e contratos v16→v19 preservados;
- navegação e cartões consolidados para foco e retomada;
- mobile, teclado, acessibilidade, PWA e segurança cobertos pelo gate existente;
- observabilidade read-only e dependências dos projetos-filhos opcionais;
- a v20 terminou com Stage COMPLETE; a v21 foi aberta depois por autorização explícita do usuário.
## Base v19 — Views locais

A v19 adiciona **Views locais** nomeadas sem backend, usando somente preferências allowlisted da própria Central.

Evoluções da v19:
- salvar e nomear até 8 views neste navegador;
- cada view captura somente aba do Workspace, lente de roteamento e filtros da Inbox;
- salvar/aplicar/restaurar views pela Command Palette existente;
- aplicar view não altera foco, retomada, favoritos, histórico ou contratos;
- filtros da Inbox passam a persistir localmente para compor as views;
- restaurar defaults volta para Ativos + Foco + Tudo/Todos;
- views e filtros entram no backup apenas por allowlist explícita;
- último acesso, histórico, caches técnicos e contratos continuam fora do backup;
- zero backend, zero chamada de rede adicional e zero write externo;
- app shell `central-shell-v19.0.0`;
- shell funcional auditado em **130.983 bytes / 131.072 bytes**.

## Base v18 — Proveniência e frescor

A v18 torna **proveniência e frescor** dos contratos read-only visíveis sem transformar idade em diagnóstico.

Evoluções da v18:
- idade descritiva do contrato e da fonte publicada;
- exposição de `source.kind`, `source.ref`, `source.status` e `schemaVersion`;
- compatibilidade mostrada somente para contratos que passaram pela validação existente;
- refresh manual por projeto, acionado explicitamente pelo usuário;
- refresh reutiliza GET read-only, timeout, validação, cache e fallback stale da v12;
- deduplicação de refresh simultâneo e zero polling;
- camada de apresentação continua sem `fetch`;
- nenhum write em projetos externos;
- fallback/no-JS, links diretos, foco e retomada preservados;
- app shell `central-shell-v18.0.0`;
- shell funcional auditado em **130.986 bytes / 131.072 bytes**.

## Base v17 — Inbox operacional

A v17 adicionou uma **Inbox operacional** local e explicável sobre os contratos read-only já validados pelos projetos.

Evoluções da v17:
- reúne ações publicadas e alertas no mesmo painel operacional;
- filtros por **Tudo / Ações / Alertas** e por projeto;
- provenance explícita para contrato publicado, cache recente e cache antigo;
- estado stale aparece como **Último estado**, separado do estado atual;
- ordem preserva o catálogo, sem ranking, score ou prioridade calculada;
- nenhuma chamada de rede adicional na camada da inbox;
- nenhum write em projetos externos;
- fallback/no-JS e links diretos permanecem intactos;
- app shell `central-shell-v17.0.0`;
- orçamento da geração permanece em **128 KiB**.

## Base v16 — Command Palette

A v16 iniciou a geração **Workspace PRO v16→v20** com acesso rápido por teclado e toque.

Evoluções da v16:
- **Command Palette** aberta por Ctrl/⌘+K;
- botão flutuante visível, inclusive no mobile;
- busca por projetos ativos, arquivados e futuros;
- navegação rápida para Agora, Projetos, Workspace, Atividade e Diagnóstico;
- ações rápidas para foco e retomada quando válidos;
- navegação por ↑/↓, Enter e Escape;
- nenhuma chamada de rede adicional;
- nenhum write em projetos externos;
- app shell atualizado para `central-shell-v16.0.0`;
- orçamento da nova geração limitado a **128 KiB**; shell atual ~126,4 KiB.

A v15 permanece como baseline terminal da geração anterior e transforma a Central em um workspace de concursos sem criar banco mestre.

Evoluções da v15:
- lifecycle explícito `active / archived / future` no registry;
- TCE-GO, SEEDF e TJDFT permanecem ativos;
- SEDES/DF — TDAS aparece como histórico arquivado com link verificado;
- arquivados e futuros ficam fora de foco, retomada e observabilidade ativa;
- nova área **Workspace** com filtros Ativos / Arquivados / Futuros;
- exportação/importação local de preferências com allowlist explícita e limite de 64 KB;
- backup não inclui último acesso, histórico nem caches técnicos/operacionais;
- registry atualizado para schema v3;
- app shell atualizado para `central-shell-v15.0.0`;
- shell final auditado dentro do orçamento de 120 KiB;
- nenhuma base mestre ou autenticação compartilhada foi introduzida.

A v14 continua fornecendo roteamento explicável sem decidir pelo usuário.

Evoluções da v14:
- quatro lentes escolhidas explicitamente: **Foco, Retomada, Ações publicadas e Alertas**;
- cada resultado possui **Por que aparece aqui?**;
- quando há vários projetos, a ordem continua sendo a do catálogo;
- a lente selecionada fica apenas neste navegador;
- estado stale aparece como **Último estado conhecido**;
- nenhuma chamada de rede adicional;
- sem ranking, score, prioridade calculada, recomendação automática ou mentor global;
- camada v13/v14 consolidada para manter o shell dentro do orçamento original de 120 KiB.

A v13 continua apresentando na interface o estado operacional autorizado pelos contratos v12.

Evoluções da v13:
- nova seção **Próximas ações publicadas**;
- fase, ciclo e unidade atual exibidos quando publicados;
- próxima ação aparece exatamente como fornecida pelo projeto;
- `operational`, `planned` e `stale-cache` são visualmente distintos;
- o foco humano continua independente do estado operacional;
- alertas públicos do contrato podem ser mostrados;
- estado stale é apresentado como **Último estado conhecido**, nunca como atual;
- a camada v13 não faz chamadas de rede próprias;
- não existe ranking, score, mentor global ou prioridade calculada.

A v12 continua fornecendo contratos operacionais read-only opcionais entre a Central e cada projeto.

Evoluções da v12:
- registry schema v2 com `statusUrl` opcional;
- contrato público versionado em `central-status.json`;
- schema v1 documentado em `docs/STATUS-CONTRACT-V1.md`;
- consumidor com timeout, cache curto e fallback stale;
- contrato inválido/indisponível nunca bloqueia o projeto;
- Diagnóstico informa disponibilidade do contrato sem exibir ainda `nextAction`;
- service worker não intercepta/cacheia contratos dos projetos-filhos;
- TCE-GO, SEEDF e TJDFT publicam somente um arquivo leve autorizado para a Central.

A v11 permanece como a camada PRO/UX sobre a base estável da v10.

Evoluções da v11:
- **Visão Agora** com foco, retomada e quantidade de ambientes;
- navegação direta entre **Agora, Projetos, Atividade e Diagnóstico**;
- navegação fixa no mobile e sticky no desktop;
- foco e retomada atualizam a Visão Agora por eventos locais, sem polling;
- nenhum dado pedagógico é inferido ou inventado;
- informação técnica continua disponível, mas fica visualmente secundária;
- zero chamadas de rede adicionais na camada v11;
- nova esteira documentada em `docs/ROADMAP-V15.md` e `docs/V15-CHECKPOINT.md`.

A v10 permanece registrada como baseline estável e auditada em `docs/FINAL-AUDIT-V10.md`.

Capacidades consolidadas:

- shell mobile-first com fallback estático e 404 própria;
- foco atual separado de último acesso/retomada;
- catálogo com busca, favoritos, ordenação e atalhos locais;
- personalização local reversível, sem backend e sem dados sensíveis;
- observabilidade somente leitura, não bloqueante, com disponibilidade, publicação técnica e deploy separados;
- falhas de rede/rate limit tratadas sem falso estado offline;
- linha do tempo local de acessos separada de atividade técnica e sem inferência pedagógica;
- PWA network-first e shell offline com o registro local de estudo; a interface de status publicada e os controles avançados do catálogo continuam carregando pela rede; cache `central-shell-v27.6.1-study-log-20260928` restrito à Central;
- quality gate automatizado antes de todo deploy;
- CSP, escape de conteúdo, HTTPS, contraste, teclado, forced colors e touch targets auditados;
- orçamento de shell <= 128 KiB na geração v16+ (v15 fechou <= 120 KiB) e zero dependências externas de JS/CSS;
- registry único em `config/projects.json`;
- GitHub Pages automático após quality gate;
- zero framework e zero etapa de build.

## Offline não significa projetos offline

O cache PWA guarda somente arquivos da Central. TCE-GO, SEEDF e TJDFT continuam ambientes externos independentes e exigem a própria conectividade. A Central nunca apresenta um projeto como disponível offline apenas porque sua shell abriu do cache.

## Separação de conceitos

**Foco**, **retomada/último acesso**, **favorito**, **acesso local**, **recência técnica**, **disponibilidade** e **deploy** são sinais distintos. Commit ou acesso não é interpretado como estudo, duração, progresso ou desempenho.

## Publicação

GitHub Pages, diretamente da branch `main`. O workflow executa `quality` antes de `deploy`; falha no gate impede publicação.

## Segurança e independência

A Central nunca é requisito para os projetos funcionarem. TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e acessíveis pelas próprias URLs. A Central não escreve em dados internos dos projetos-filhos e não armazena informação sensível. Na v12, cada filho publica explicitamente um único contrato público `central-status.json`, consumido somente em leitura.

## Adicionar um projeto

A fonte dinâmica de verdade é `config/projects.json` (schema v3). Cada item declara lifecycle `active`, `archived` ou `future`. O `index.html` mantém fallback mínimo para acessos reais; consulte `docs/ARCHITECTURE.md` antes de adicionar ou arquivar um projeto.

## Governança e auditoria

A esteira histórica v1→v10 permanece congelada em `docs/V10-CHECKPOINT.md` e `docs/FINAL-AUDIT-V10.md`. A geração v11→v15 permanece congelada em `docs/ROADMAP-V15.md` e `docs/V15-CHECKPOINT.md`. A geração v16→v20 é encerrada pela auditoria terminal em `docs/FINAL-AUDIT-V20.md`. A esteira terminal v21 Presença e Ritmo está registrada em `docs/ROADMAP-V21.md` e `docs/V21-CHECKPOINT.md`. As releases recentes estão registradas em seus respectivos roadmaps, critérios de aceitação e auditorias: v27.1.1 (catálogo e ferramenta), v27.2.2 (rotação das frases do Major Cadar), v27.3.0 (destaque do dia e comparação local de contratos), v27.4.0 (site GitHub Pages do PRF com acesso ao Notion preservado) e v27.4.1 (redesenho desktop da frase do Major Cadar) e v27.4.2 (PRF P4) e v27.4.3 (correção do ciclo PRF e manifesto PWA), v27.5.0 (fechamento do dia) e v27.6.0 (registro local de tempo por projeto/trilha/tópico) e v27.6.1 (ajuste visual dos campos de duração).
