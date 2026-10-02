# Central de Estudos

Camada de entrada dos projetos ativos SEEDF (P1), TJDFT (P2) e PRF Administrativo (P3). TCE-GO permanece arquivado para consulta histórica, sem apagar seu repositório ou seus registros.

## Estado atual — v28.7.1

A v28.7.1 reúne o plano do dia por projeto, os atalhos de material/questões/erros e uma tela de revisões com dados publicados. A navegação principal passa a Hoje, Projetos, Revisões e Mais; Mentor, Retomada, Histórico, alertas, preferências e Jornada continuam acessíveis. Registrar tempo abre diretamente o formulário, seleciona o dia de hoje e o projeto escolhido. A camada nova não escreve nos projetos e não gera lançamentos de estudo. Escopo, critérios e limites da validação: `docs/UX-V28.7.md`.

A v28.6.3 corrige a preservação de blocos históricos nos lançamentos automáticos, aplica a data de Brasília aos timestamps de estudo e restabelece a atualização do Mentor entre abas. As versões dos recursos do Mentor e do registro de horas agora coincidem com as entradas do cache offline. O fallback do foco SEEDF informa Pré-edital. As prioridades e a grade continuam P1 SEEDF, P2 TJDFT e P3 PRF Administrativo.

A carteira ativa agora é SEEDF (P1), TJDFT (P2) e PRF Administrativo (P3). TCE-GO foi arquivado em 30/09/2026: saiu da agenda, do foco ativo, dos cartões e do Mentor, mas continua no Workspace com acesso histórico. Preferências antigas de foco TCE-GO migram uma vez para SEEDF; a última visita TCE-GO continua registrada como histórico. Ordens locais personalizadas mantêm a sequência relativa dos projetos que seguem ativos.

A Jornada consulta somente os contratos públicos dos três projetos ativos. O cartão TCE-GO fica em uma seção histórica separada e não tem o endpoint de status consultado. O registro local de horas continua disponível e pode sincronizar entre aparelhos. A v28.4.0 havia substituído as frases por 14 lembretes de estudo ligados à agenda; a v28.6.1 restaura a quantidade solicitada com fontes individuais e troca a formulação mais genérica por uma linha do perfil oficial. A v28.3.0 lança 1h por conclusão confirmada com data de estudo publicada igual ao dia de Brasília. O P3 ainda não publica essa data no contrato e continua manual até isso existir; produção de material não é sessão concluída. O Mentor não lê o estado privado do TCE-GO.

A v28.0.3 aprimora a página `/mentor/` com um panorama visual dos quatro projetos: SEEDF (P1), TJDFT (P2), TCE-GO (P3) e PRF Administrativo (P4). O painel reúne a próxima etapa e a situação da fonte, exibe questões/precisão somente quando publicadas e mantém o tempo de 7 dias identificado como registro local da Central. As abas agora seguem o padrão acessível de teclado. TCE-GO continua como foco padrão; o Mentor segue somente leitura e sem OpenAI API paga.

A v28.0.2 mantém PRF Administrativo como P4 nas segundas, quartas e sextas. O resumo rápido do PRF lê a próxima ação publicada em central-status.json, indica quando o contrato está em cache antigo e usa um fallback sem unidade inventada quando o contrato não está disponível. A Central continua consumindo o contrato por GET; a sincronização Notion → Actions → site do PRF permanece no repositório do PRF.


A v28.0.0 transforma o **Mentor em uma página filha própria** (`/mentor/`). A Home volta a ser um centro de comando enxuto; o Mentor ganha espaço dedicado para recomendação atual, confiança, motivos, grade do dia, leitura individual dos quatro projetos, revisões/riscos e metodologia transparente. A página usa os contratos read-only de SEEDF/TJDFT/PRF, o histórico local da Central e o TCE-GO privado apenas quando há sessão Supabase válida. Continua sem OpenAI API paga. O app shell foi ampliado por autorização explícita para **256 KiB bruto / 80 KiB gzip**, permitindo publicar o Mentor completo também como parte do PWA.

A v27.9.0 conecta o Mentor aos **sinais reais publicados pelos projetos**. SEEDF, TJDFT e PRF Administrativo passam a fornecer um contrato read-only com unidade atual/próxima, execução, questões, erros e revisões quando esses dados existem. O TCE-GO preserva o progresso privado: a Central só o lê quando o usuário está autenticado no Supabase, por RLS de leitura do próprio usuário. Campo ausente continua desconhecido e nunca vira zero. O Mentor continua sem OpenAI API paga.

A v27.8.0 adiciona um **Mentor adaptativo local, sem OpenAI API paga**. Ele cruza a grade do dia com os blocos de estudo realmente registrados na Central, observa recência e distribuição dos últimos dias, calcula uma sugestão explicável e mostra o nível de confiança da base. A sugestão nunca muda o foco escolhido pelo usuário e não afirma desempenho, domínio, erro ou progresso quando esses dados não existem. O fechamento do dia deixa de congelar estados manuais e passa a ser preenchido a partir do registro real quando a camada operacional está disponível.

A v27.7.0 torna o registro diário guiado pela grade: escolha a semana e o dia, selecione uma atividade prevista, depois a matéria/unidade e a duração real. O lançamento manual só entra no histórico após confirmação explícita. Os catálogos cobrem as leis e trilhas SEEDF, P01–P18/RL01–RL13/REV01–REV06 do TJDFT, as 36 matérias atuais de estudo do TCE-GO e PRFADM01–PRFADM33. Dia e semana selecionados atualizam os totais locais.

O cronograma permanece intacto. Nenhuma opção selecionada é tratada como estudo concluído, e nenhum projeto avança automaticamente. Os registros ficam neste navegador, com exportação e restauração JSON, e podem sincronizar entre aparelhos depois de entrar na mesma conta Supabase já cadastrada. Essa sincronização é opcional, não conversa com o Notion e não altera projetos-filhos. Os catálogos são uma fotografia de 28/09/2026: confira ordem, liberação de materiais e progresso no projeto de origem. O registro manual continua disponível se a camada guiada não carregar. Horas informadas medem tempo, não domínio ou progresso. A grade de domingo continua protegida.

O fechamento do dia continua separando grade prevista, registro e orientação. Os contratos em Evolução mostram origem e atualização do estado publicado. Só evidência confirmada, unidade concluída e data de estudo publicada formam um lançamento automático; a atualização técnica do contrato não vale como data da sessão. O PRF mantém o Notion como fonte de verdade e publica um contrato sanitizado read-only pelo próprio site.

O teto do app shell da v28 passa a **256 KiB bruto e 80 KiB gzip**, autorizado em 29/09/2026 e registrado em [`docs/APP-SHELL-BUDGET-CHANGE-2026-09-29.md`](docs/APP-SHELL-BUDGET-CHANGE-2026-09-29.md). Os limites históricos permanecem registrados nas releases anteriores; novos aumentos continuam exigindo autorização explícita.

A V27 apresenta um cartão para cada dia da semana e a V27.0.1 compacta a grade em celulares sem esconder tarefas nem mudar a ordem de prioridades.

- Retomada mostra separadamente o foco escolhido e o último acesso local; acesso não representa estudo ou progresso.
- Projetos reúne os três projetos ativos; TCE-GO fica na aba Arquivados e a Plataforma de Questões tem cartão próprio, fora da contagem de concursos.
- Inbox tem filtros próprios por tipo e projeto; o Radar mantém a visão completa dos contratos disponíveis.
- Evolução mantém Radar, preferências e estado técnico; o Mentor possui página própria em `/mentor/`.
- Views locais salvam também a tela atual; views anteriores sem esse campo continuam abrindo em Hoje.
- Prioridades: SEEDF (P1), TJDFT (P2) e PRF Administrativo (P3). SEEDF e TJDFT estudam de segunda a sexta e revisam no sábado; PRF mantém seus blocos de segunda, quarta e sexta.
- PRF-ADM segue segunda, quarta e sexta, na sequência PRFADM01→PRFADM33, sem pular códigos quando uma sessão é perdida.
- As frases do Major Cadar alternam automaticamente a cada cinco minutos, com autoria e link da fonte, sem chamada externa automática.
- Relógio de Brasília usa `America/Sao_Paulo` e atualiza a cada segundo.
- O cronograma apresenta os sete dias em cartões individuais e usa linhas compactas em telas estreitas.
- A grade não muda o foco. O registro manual exige confirmação explícita. O automático só lança 1h quando o contrato confirma uma unidade concluída e a data real de estudo é hoje em Brasília; grade, material produzido, acesso e horário de sincronização não geram horas.
- O cartão do PRF abre o site GitHub Pages e mantém link separado para o Notion; o site publica `central-status.json` sanitizado para a Central sem expor a integração do Notion.
- A Plataforma de Questões abre o site independente e não entra na prioridade nem nos indicadores dos concursos.
- Cada tela possui âncora direta; sem JavaScript, os links diretos dos três projetos ativos, do histórico e da ferramenta continuam disponíveis.
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
- PWA network-first e shell offline com o registro local; a sincronização opcional via Supabase exige conexão. Status publicado e controles avançados do catálogo continuam carregando pela rede; o cache fica restrito à Central;
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

A esteira histórica v1→v10 permanece congelada em `docs/V10-CHECKPOINT.md` e `docs/FINAL-AUDIT-V10.md`. A geração v11→v15 permanece congelada em `docs/ROADMAP-V15.md` e `docs/V15-CHECKPOINT.md`. A geração v16→v20 é encerrada pela auditoria terminal em `docs/FINAL-AUDIT-V20.md`. A esteira terminal v21 Presença e Ritmo está registrada em `docs/ROADMAP-V21.md` e `docs/V21-CHECKPOINT.md`. As releases recentes estão registradas em seus respectivos roadmaps, critérios de aceitação e auditorias: v27.1.1 (catálogo e ferramenta), v27.2.2 (rotação das frases do Major Cadar), v27.3.0 (destaque do dia e comparação local de contratos), v27.4.0 (site GitHub Pages do PRF com acesso ao Notion preservado) e v27.4.1 (redesenho desktop da frase do Major Cadar) e v27.4.2 (PRF P4) e v27.4.3 (correção do ciclo PRF e manifesto PWA), v27.5.0 (fechamento do dia) e v27.6.0 (registro local de tempo por projeto/trilha/tópico) e v27.6.1 (ajuste visual dos campos de duração) e v27.7.0 (registro guiado por dia e matéria, com sincronização Supabase opcional documentada em `docs/STUDY-HOURS-SUPABASE.md`).
