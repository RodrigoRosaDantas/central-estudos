# Arquitetura — Central de Estudos

## Interface do lembrete diário — v28.4.0

A abertura exibe uma mensagem original da Central, selecionada pelo dia da semana e pela paridade da semana usando o calendário `America/Sao_Paulo`. São 14 textos concretos ligados à grade P1 SEEDF, P2 TJDFT e P3 PRF ADM; cada mensagem permanece estável até a virada do dia em Brasília. O componente não atribui frases a terceiros nem consulta serviços externos.

Em larguras abaixo de 900 px, o cabeçalho vira grade: Jornada e Opções permanecem na primeira linha; título, saudação e lembrete usam a largura total. O cartão usa acento turquesa, sem lavanda, e fica no shell offline da PWA.

## Responsabilidade

A Central é uma camada de **navegação, observabilidade leve e registro local de tempo estudado**.

> A Central observa e direciona. Os projetos executam e decidem.

Ela lista ambientes, destaca foco, recorda último acesso, oferece organização local, testa disponibilidade sem bloquear navegação e direciona ao site real. Não edita dados internos dos projetos-filhos nem importa seus dashboards. O registro de tempo pertence à própria Central e pode sincronizar opcionalmente na tabela isolada `central_study_logs`; isso não transforma dados dos projetos em uma base mestre.

## Registry

A fonte dinâmica de verdade é `config/projects.json` (`schemaVersion: 3`). O lifecycle é explícito em `status`: `active`, `archived` ou `future`. Projetos de site ativo/arquivado possuem URL e repositório HTTPS; destinos exclusivamente Notion podem existir sem repositório. PRF Administrativo aponta para o GitHub Pages, conserva `notionUrl` como acesso à fonte de verdade e publica `statusUrl` sanitizado pelo próprio workflow de sincronização. A Central consome esse contrato read-only sem receber token do Notion.

## Fallback e progressive enhancement

O fallback estático de index.html contém links mínimos para os três projetos ativos, o arquivo histórico e a Plataforma de Questões. Se JavaScript ou registry falharem, SEEDF, TJDFT, painel PRF, TCE-GO histórico e plataforma continuam acessíveis.

## Estado local e separação semântica

A Central usa `localStorage` para preferências/continuidade e para registros de estudo manuais ou automáticos a partir de conclusões confirmadas dos projetos. **Foco**, **retomada/último acesso**, **favorito**, **acesso local**, **recência técnica** e **tempo estudado** são conceitos independentes.

O registro usa a chave `central-estudos:study-log-v1` e guarda data, ID do projeto, trilha/matéria, tópico opcional, minutos líquidos e confirmação. O lançamento manual exige confirmação explícita. O automático registra 60 minutos quando o contrato read-only está sincronizado, a evidência é `confirmed`, há `lastCompletedUnit` e `lastStudiedAt` corresponde ao dia atual em Brasília. A deduplicação usa projeto, unidade e data. Grade, próxima unidade, produção de materiais, visitas e `updatedAt` de sincronização não geram horas; os registros não medem domínio, desempenho ou progresso.

Os dados continuam local-first no `localStorage`. Quando o usuário entra em uma conta Supabase já cadastrada, a Central pode sincronizar apenas os registros de tempo na tabela isolada `central_study_logs`, com RLS por usuário. Não há sincronização com Notion nem escrita nos projetos-filhos. Exportar/restaurar backup JSON continua disponível como portabilidade manual.

Todo acesso a armazenamento local degrada com segurança; conteúdo inválido é ignorado/limpo e defaults previsíveis são usados.

## Observabilidade

Somente leitura, não bloqueante e separada de estudo. Disponibilidade, publicação técnica e deploy são dados distintos. Falha de rede é inconclusiva; metadados públicos usam cache controlado/stale explícito; rate limit não bloqueia navegação. Contrato detalhado em `docs/OBSERVABILITY-V3.md`.

## Catálogo e personalização

Busca, favoritos, ordenação, atalhos e ordem manual são camadas locais sobre o registry. Preferências de densidade/apresentação são reversíveis. Nada disso altera `projects.json`, dados técnicos ou projetos-filhos. A ação principal continua **Abrir ambiente**.

## PWA e resiliência

O service worker é limitado à origem e ao pathname da Central. Na v28, o cache `central-shell-v28.0.0-mentor-page-20260929` inclui a Home e a página filha `/mentor/`, junto com seu CSS, motor e cronograma canônico. O catálogo guiado continua em cache de runtime. Sites de projeto, ferramentas e serviços externos não são incluídos. A navegação offline para `/mentor/` usa `mentor/index.html` como fallback próprio, em vez de cair na Home.

Estratégia:
- navegações e assets conhecidos usam **network first**;
- cache local serve apenas como fallback de rede;
- caches antigos com prefixo `central-shell-` são removidos na ativação;
- projetos-filhos e APIs externas não são interceptados/cacheados;
- atualização de worker é controlada por `SKIP_WAITING` e `controllerchange`;
- instalação é opcional;
- remover worker/caches restaura a experiência web normal.

Abrir a shell offline não afirma disponibilidade offline dos projetos.

## Qualidade e deploy

`tests/quality.mjs` é uma suite local, determinística e sem dependências externas. A v28 usa o teto explicitamente autorizado de **262.144 bytes bruto (256 KiB) e 81.920 bytes gzip (80 KiB)** para comportar o Mentor dedicado no PWA. O workflow Pages executa `quality` antes de `deploy`, com dependência explícita `deploy needs: quality`. O gate cobre registry, referências, fallback, manifest, service worker, segurança básica, funções críticas, contratos de diagnóstico, acessibilidade estrutural, mobile e orçamento do app shell.

## Linha do tempo e diagnóstico

Acesso local, atividade técnica pública e disponibilidade são fontes separadas. Diagnósticos descrevem observações e incerteza; nunca atribuem causa não comprovada. A linha do tempo reutiliza sinais existentes e não cria chamadas de rede próprias. Contrato em `docs/DIAGNOSTICS-V8.md`.

## Segurança e hardening

A plataforma usa CSP compatível com a observabilidade, HTTPS, validação/escape de conteúdo dinâmico, IDs seguros, ausência de scripts/estilos externos obrigatórios, orçamento de shell, tratamento de edge cases, contraste/teclado/forced-colors/touch targets e cache de rede limitado. Detalhes em `docs/HARDENING-V9.md`.

## Contrato terminal — v10

A v10 congela esta arquitetura para a esteira atual. A auditoria integral está em `docs/FINAL-AUDIT-V10.md`. Integrações futuras, se aprovadas fora desta esteira, devem continuar somente leitura, opcionais, versionadas e desacopladas do schema interno dos projetos-filhos.

Não fazem parte desta arquitetura: iframe dos projetos, banco mestre, autenticação compartilhada, Supabase compartilhado, lógica pedagógica global, escrita nos projetos-filhos ou dependência externa obrigatória.


## Nova geração — v11

A v11 inicia uma nova esteira após o fechamento terminal da v10. A v10 continua sendo o baseline auditado; a nova evolução não altera retroativamente o checkpoint antigo.

### Visão Agora

A Home passa a organizar três conceitos operacionais:

- **Foco:** projeto atualmente priorizado na Central;
- **Retomada:** último ambiente aberto pela Central neste navegador;
- **Ambientes:** catálogo de projetos disponíveis.

A Visão Agora não conhece unidades de estudo, questões, revisões ou progresso interno. Sem contrato explícito de um projeto, ela não deve inventar “próxima ação”.

### Navegação

A navegação principal usa âncoras internas:

- Agora;
- Projetos;
- Atividade;
- Diagnóstico.

No desktop ela permanece sticky; no mobile vira navegação inferior fixa. Isso não cria rotas novas nem dependência de JavaScript para acessar os projetos.

### Integração

A v11 reutiliza eventos locais:

- `central:app-ready`;
- `central:focus-changed`;
- `central:project-opened`;
- `central:history-cleared`;
- `central:catalog-refresh`.

A camada `pro-v11.js` não faz chamadas de rede. Ela apenas reflete estado já existente da Central.

### Futuro

A evolução v12→v15 está descrita em `docs/ROADMAP-V15.md`. Contratos read-only publicados dentro dos projetos-filhos continuam exigindo autorização explícita para qualquer write nesses repositórios.


## Contratos read-only — v12

A v12 adiciona um canal operacional explícito e opcional entre projetos e Central.

O registry passa para `schemaVersion: 2` e pode declarar `statusUrl`. O contrato publicado nesse endpoint segue `config/status-contract.schema.json` e o documento `docs/STATUS-CONTRACT-V1.md`.

### Fluxo

`projeto → central-status.json → validação v1 → cache local → evento central:contract-state → diagnóstico`

Regras:
- transporte GET somente leitura;
- timeout de 3,5 s;
- cache local de 5 min;
- stale cache é explicitamente marcado;
- ID do contrato deve corresponder ao ID do registry;
- schema desconhecido é rejeitado;
- contrato ausente, inválido ou indisponível não bloqueia links nem observabilidade;
- a Central não usa snapshots grandes como fallback;
- o service worker da Central não intercepta os contratos dos filhos;
- `nextAction` e `currentUnit` ainda não são usados pela Visão Agora na v12.

### Publicação nos filhos

Cada projeto recebeu somente `public/central-status.json`, por autorização específica desta etapa. Nenhum banco, Supabase, Notion, componente, pipeline ou lógica interna foi alterado.

A v13 poderá usar os campos operacionais já autorizados pelo contrato.


## Estado operacional — v13

A v13 transforma o contrato v12 em informação visível, sem alterar a fonte de autoridade.

### Regra central

A Central **apresenta**, mas não calcula o estado operacional.

Campos consumidos:
- `phase`;
- `cycle`;
- `currentUnit`;
- `nextAction`;
- `nextActionKind`;
- `alerts`.

### Semântica

- `operational`: estado operacional explícito publicado pelo projeto;
- `planned`: ação prevista em calendário/plano público, sem afirmar progresso confirmado;
- `manual`: publicação manual autorizada;
- `stale-cache`: mostrado como **Último estado conhecido**.

O foco continua sendo uma escolha local do usuário e não é recalculado a partir desses estados.

A camada `operational-v13.js` não realiza fetch. Ela consome somente eventos `central:contract-state` já validados pela v12.

Não fazem parte da v13:
- ranking;
- pontuação;
- prioridade secreta;
- mentor global;
- inferência de progresso;
- writes nos projetos-filhos.


## Roteamento explicável — v14

A v14 está documentada em `docs/ROUTING-V14.md`.

O roteamento é **selecionado pelo usuário**, nunca calculado pela Central.

Lentes:
- Foco;
- Retomada;
- Ações publicadas;
- Alertas.

Cada item explica por que aparece. Múltiplos resultados preservam a ordem do catálogo.

A camada v14 reutiliza o mesmo mapa de contratos e inventário de projetos da v13 e foi consolidada em `operational-v13.js`/CSS para reduzir duplicação. Não há novo fetch, score, ranking, recomendação automática ou prioridade calculada.


## Workspace de concursos — v15

A v15 conclui a esteira v11→v15 transformando o catálogo em um workspace com lifecycle explícito, sem criar banco mestre.

### Lifecycle

O registry usa `schemaVersion: 3` e cada projeto declara um estado:

- `active`: participa de foco, retomada, catálogo principal, observabilidade e contratos;
- `archived`: preservado para consulta histórica, fora de foco/retomada/health ativo;
- `future`: reservado para projetos ainda não publicados; pode existir sem URL até o ambiente ser criado.

Projetos não ativos nunca devem virar foco, retomada ou alvo de observabilidade ativa.

### Workspace

A interface possui uma área **Workspace** com filtros:

- Ativos;
- Arquivados;
- Futuros.

SEDES/DF — TDAS é o primeiro projeto arquivado verificado e permanece acessível apenas como histórico.

### Portabilidade local

A Central pode exportar/importar somente preferências allowlisted da própria Central.

O backup:
- não contém último acesso;
- não contém histórico;
- não contém caches técnicos;
- não contém contratos/cache operacional;
- não contém tokens ou dados sensíveis;
- possui limite de 64 KB na importação.

### Limites arquiteturais

A v15 não introduz:
- banco mestre;
- autenticação compartilhada;
- Supabase compartilhado;
- escrita em dados internos dos projetos;
- roteamento obrigatório;
- mentor global.

O app shell da v15 é `central-shell-v15.0.0` e permanece dentro do orçamento de 120 KiB definido pelo quality gate.


## Command Palette — v16

A v16 inicia a roadmap `docs/ROADMAP-V20.md`.

### Objetivo

Reduzir o atrito de navegação sem adicionar uma nova fonte de dados.

A Command Palette:
- abre por `Ctrl+K` ou `Cmd+K` fora de campos editáveis;
- possui um botão flutuante para toque/mobile;
- usa o estado já carregado pelo workspace;
- pesquisa projetos ativos, arquivados e futuros;
- navega para seções internas;
- reutiliza foco e retomada já existentes;
- registra último acesso somente ao abrir projeto ativo, seguindo a semântica existente;
- não realiza `fetch`;
- não altera foco automaticamente;
- não escreve em projetos externos.

### Teclado e acessibilidade

- ↑/↓ percorrem resultados;
- Enter executa o item selecionado;
- Escape fecha;
- resultados usam semântica `role=option`;
- `dialog` nativo fornece foco modal;
- o atalho ignora input, textarea, select e conteúdo editável.

### Performance

A v15 encerrou em 122.134 bytes, muito próxima do teto antigo de 120 KiB. A v16 adiciona aproximadamente 7 KiB de produto real.

A nova geração adota conscientemente teto de **128 KiB** (131.072 bytes), bloqueado pelo quality gate. O aumento é limitado e explícito; não há framework, bundle externo ou nova dependência.


## Inbox operacional — v17

A v17 reutiliza a camada operacional da v13/v14 para reunir, no mesmo painel, ações e alertas já publicados pelos contratos read-only validados na v12.

### Regras

- a inbox consome somente eventos `central:contract-state` já validados;
- não realiza `fetch` próprio;
- permite filtros por tipo (**Tudo / Ações / Alertas**) e por projeto;
- provenance é explícita: contrato publicado, cache recente ou cache antigo;
- `stale-cache` é apresentado como **Último estado**, nunca como estado atual;
- a ordenação segue o catálogo e não cria ranking, score ou prioridade calculada;
- foco e retomada continuam conceitos separados;
- contratos indisponíveis não bloqueiam navegação nem links diretos;
- nenhum write é realizado nos projetos-filhos.

A v17 é progressive enhancement: sem JavaScript, o fallback estático e os acessos diretos continuam disponíveis. O orçamento do shell permanece em **128 KiB**.


## Proveniência e frescor — v18

A v18 torna explícitos dados que já existem no contrato validado, sem criar nova autoridade nem alterar os projetos-filhos.

### Apresentação

A inbox exibe:
- idade descritiva de `publishedAt`;
- idade descritiva de `source.updatedAt`, quando publicada;
- `source.kind`, `source.ref` e `source.status`;
- `schemaVersion` e compatibilidade somente após validação bem-sucedida.

Idade é informação temporal, não diagnóstico. Contrato antigo não implica falha, abandono, atraso ou causa específica.

### Refresh manual

A camada operacional não faz rede. O botão **Atualizar contrato** emite `central:contract-refresh` com o ID do projeto. O consumidor v12 aceita apenas IDs já carregados do registry e executa o mesmo fluxo GET read-only com timeout, validação, `no-store`, cache local e fallback stale.

Refresh simultâneo do mesmo projeto é deduplicado. Não há polling, `setInterval`, write externo, alteração automática de foco/retomada nem bloqueio dos links diretos.

### Limites

A v18 não altera schema dos filhos, não exige atualização de contratos externos, não cria score de frescor e não converte idade em prioridade.


## Views locais — v19

A v19 permite salvar combinações de preferências locais sem criar backend, banco mestre ou novo estado autoritativo.

### Conteúdo de uma view

Cada view pode conter somente:
- aba do Workspace (`active / archived / future`);
- lente de roteamento (`focus / resume / published / alerts`);
- filtro de tipo da Inbox (`all / action / alert`);
- filtro de projeto da Inbox (`all` ou projeto ativo válido).

A view não contém foco, retomada/último acesso, favoritos, histórico, contratos, caches técnicos, progresso ou desempenho.

### Persistência e aplicação

As views usam `central-estudos:views-v19`, ficam limitadas a 8 itens e possuem nome de até 40 caracteres. Aplicar uma view grava apenas as quatro preferências autorizadas e recarrega a Central para que cada módulo reaplique seu próprio estado.

Salvar, aplicar e restaurar defaults reutiliza a Command Palette da v16, evitando nova camada de navegação. A restauração de defaults não apaga histórico nem altera foco.

### Portabilidade

A chave de views e os filtros da Inbox entram no backup somente porque foram adicionados explicitamente à allowlist de preferências da v15. Último acesso, histórico, observabilidade e cache de contratos continuam excluídos.

A v19 não realiza `fetch`, não cria sincronização entre dispositivos e não escreve nos projetos-filhos.


## Workspace PRO estável — v20

A v20 não acrescenta uma nova camada funcional. Ela consolida e audita a arquitetura da geração v16→v20.

### Invariantes terminais

- a Central permanece camada de navegação, preferências e observabilidade leve;
- registry continua sendo a fonte dinâmica local de catálogo;
- foco e retomada permanecem semanticamente separados;
- contratos externos continuam opcionais, read-only e não bloqueantes;
- Inbox, proveniência, refresh manual e Views locais permanecem progressive enhancement;
- projetos-filhos continuam independentes e acessíveis diretamente;
- service worker limita-se ao app shell da Central e não transforma filhos em offline;
- não existe backend, banco mestre, autenticação compartilhada, ranking global ou decisão automática;
- o shell da geração v16+ permanece limitado a 128 KiB.

A evidência terminal está consolidada em `docs/FINAL-AUDIT-V20.md`.


## Presença e Ritmo — v21

A v21 reorganiza a recepção da Central em torno de saudação, frase original do dia, relógio e foco atual. A frase é selecionada de forma estável pela data de America/Sao_Paulo e não declara progresso, estudo realizado ou resultado.

O relógio exibe hora/minuto sem segundos, dia da semana e data por extenso em português brasileiro. A leitura e a escolha da frase usam o fuso America/Sao_Paulo; o timer atualiza por minuto e recalcula quando a aba volta a ficar visível. Nenhuma API adicional é usada para esta apresentação.

A mudança é progressive enhancement: fallback estático, links diretos, foco/retomada, contratos read-only, navegação, cache PWA e independência dos projetos-filhos permanecem preservados. O app shell continua limitado a 128 KiB.

## Centro de Comando — v22

A v22 mantém a arquitetura navigation-first e read-only e reorganiza a primeira dobra como cockpit operacional. Usa somente foco local, fase do registry, disponibilidade técnica, retomada local e estado publicado pelos contratos. Não calcula progresso, nota, ranking, contagem regressiva ou prioridade pedagógica.

A implementação permanece em HTML/CSS/JavaScript nativos, sem backend, telemetria ou dependência externa, preservando IDs/eventos históricos e a independência dos projetos-filhos.

## Hoje + Radar + Mentor — v23

A v23 não cria um motor pedagógico global. Ela reorganiza capacidades já existentes em três superfícies: **Hoje**, **Radar operacional** e **Mentor de execução**.

**Hoje** usa foco local, fase do registry, saúde técnica, retomada e a próxima ação publicada pelo contrato. Quando não existe ação publicada, a interface explicita a ausência e oferece navegação, sem completar a lacuna com inferência.

O **Radar operacional** continua sendo uma leitura ordenada dos contratos validados. O **Mentor** reaproveita as lentes escolhidas pelo usuário — foco, retomada, ações publicadas e alertas — e explica por que cada projeto aparece. A ordem continua sendo a do catálogo e não existe score, ranking ou troca automática de prioridade.

A arquitetura permanece read-only, sem backend, telemetria, polling novo ou dependência externa.


## Seis telas de trabalho — v24

A navegação v24 expõe Hoje, Retomada, Projetos, Inbox, Histórico e Evolução como telas com âncoras diretas. O estado ativo é local, pode ser reaberto por URL e não exige JavaScript para os links diretos existentes.

- Retomada separa o foco escolhido do último ambiente acessado; nenhum deles representa estudo ou progresso.
- Projetos mantém catálogo e lifecycle de concursos no mesmo contexto.
- Inbox apresenta filtros próprios sobre eventos de contratos já validados; Radar preserva a lista geral sem herdar esses filtros.
- Evolução reúne Radar, Mentor, preferências e estado técnico.
- Views existentes aceitam opcionalmente o campo `screen`; registros v19 sem ele são interpretados como Hoje.
- A lista local de views permite abrir e excluir sem prompt; o backup continua limitado à allowlist e não leva histórico, foco ou contratos.
- Cada seção `data-screen` precisa ser filha direta de `<main>` para o roteador alternar a tela; o diagnóstico fica dentro de Evolução. O quality gate verifica essa hierarquia.
- `workspace-v24.js` não faz rede. A renderização do Inbox reutiliza eventos da camada read-only v12.
- Scripts de runtime são distribuídos minificados em UTF-8 para manter o app shell dentro do limite de 128 KiB; verificações de sintaxe, contratos e execução seguem no quality gate.


## Cronograma semanal — v25

A tela Hoje contém uma grade editorial estática, mantida na Central e baseada na ordem de estudo informada: SEEDF (prioridade 1), TJDFT (prioridade 2) e TCE-GO (prioridade 3). Segunda, quarta e sexta organizam SEEDF antes de TJDFT; terça, quinta e sábado reservam a sessão regular do TCE-GO; domingo fica protegido, com revisões somente quando previstas.

Essa ordem de estudo é independente do foco de navegação escolhido no topo. A Central não recalcula prioridades, não registra presença, não infere execução ou progresso e não altera as filas próprias dos projetos. O atalho usa uma âncora resolvida para a tela Hoje; a agenda não adiciona requests nem dependências, e as exceções do TCE-GO continuam no calendário Dxx do próprio projeto.

## Ritmo de estudo e presença — v26

A v26 introduziu o cronograma semanal, a trilha PRF-ADM em dias fixos, citações atribuídas e o relógio de Brasília com segundos. A grade era agrupada por padrão de dias.

## Cronograma dia a dia — v27

A v27 apresenta sete cartões separados, um por dia. Segunda, quarta e sexta mostram SEEDF, TJDFT e PRF Administrativo; terça e quinta mostram SEEDF, TJDFT e TCE-GO; sábado mostra as revisões P1/P2 e TCE-GO; domingo permanece protegido. PRF Administrativo é uma trilha complementar, não uma prioridade numerada.

Na nomenclatura da v27.0, “trilha complementar” descrevia somente os dias de estudo do PRF na grade. Desde v27.1, o PRF está registrado no catálogo como projeto ativo independente, sem prioridade numérica. A rotina v27.3 usa o rótulo **Projeto PRF** para eliminar a ambiguidade.

O shell `central-shell-v27.0.1` inclui `workspace-v27.css`; runtime e registro usam URLs `v27.0.1` para renovar clientes com cache anterior. Em celular, cada dia mantém a própria linha, com tarefas ao lado do dia e rótulos redundantes recolhidos. Foco, filas e dados dos projetos-filhos permanecem independentes; a agenda não mede execução ou progresso.

## Catálogo de projetos e ferramenta transversal — v27.1.0

- PRF Administrativo aparece em `config/projects.json` como projeto ativo, com `destinationType: "notion"`, URL direta para o plano e prioridade `normal`; portanto, não recebe número nem altera SEEDF P1, TJDFT P2 e TCE-GO P3.
- A Central não envia `HEAD` para a página Notion e não consulta GitHub por ela. O card declara que o conteúdo fica no Notion e que a Central não mede sua execução.
- Plataforma de Questões abre em uma área própria de Ferramentas de estudo, com a mesma linguagem visual dos cards de projeto; não participa do lifecycle, da busca de concursos, da prioridade ou do pulso técnico dos dashboards.
- Links de projeto e da ferramenta também estão no HTML estático para fallback sem JavaScript. Os destinos mantêm seus próprios dados e rotinas.
- Quality gate mede todos os 23 recursos únicos em `APP_SHELL`: 144.642 bytes brutos (limite 147.456) e soma gzip 46.807 bytes (limite 49.152), incluindo folhas v26/v27, registry, 404 e ícone. A auditoria detectou que o gate antigo omitia alguns recursos; agora a lista é derivada diretamente do app shell.

O teto de **144 KiB bruto / 48 KiB gzip** para a linha pós-v20 foi autorizado explicitamente pelo usuário em 28/09/2026 após a reauditoria; o limite de 128 KiB continua registrado como histórico da geração v16→v20. `docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md` mantém a decisão e as margens da release atual. Novos aumentos continuam sujeitos a autorização explícita.

## Contexto anterior — v27.3.0

O cartão da frase do dia usa fundo mais definido, tipografia maior e cor de alto contraste; autoria e fonte continuam visíveis. A rotação permanece automática a cada cinco minutos.


O cronograma marca o cartão correspondente ao dia em `America/Sao_Paulo`, recalcula ao mudar de minuto e ao retornar à aba, e o identifica visualmente e com `aria-current="date"`. Essa seleção não altera o conteúdo nem a ordem semanal.

A Inbox mostra mudanças entre o último snapshot local salvo e um contrato válido recém-observado. Compara fase, ciclo, unidade, próxima ação e alertas; usa texto seguro no DOM; e exibe a publicação/frescor quando disponível. Somente um contrato recebido como `live` substitui o snapshot local. `cached` e `stale-cache` podem aparecer como último estado conhecido, mas não sobrescrevem a base nem são apresentados como atualização ao vivo. A primeira leitura do usuário é registrada como base, sem fabricar histórico.

A chave `central-estudos:published-snapshot-v1` fica somente neste navegador e não entra no backup de preferências. A comparação é read-only, não é telemetria, não mede estudo/progresso e não escreve nos projetos-filhos.

## Contexto anterior — v27.4.0

O cartão PRF abre o painel em GitHub Pages e mantém Notion como acesso separado à fonte de verdade. A Central associa somente o repositório próprio do PRF para frescor e estado do workflow de publicação. Como o painel publica um snapshot e não tem `central-status.json`, não aparece no Radar operacional nem fornece progresso de estudo.

## Contexto anterior — v27.4.1

A frase do Major Cadar continua alternando a cada cinco minutos com autoria e fonte. No desktop, ela ocupa um painel horizontal ao lado do título e da saudação, eliminando o vazio no cabeçalho; em telas menores, permanece em fluxo vertical, sem alterar as citações nem o calendário de rotação.

## Contexto atual — v27.4.2

A ordem semanal agora inclui SEEDF (P1), TJDFT (P2), TCE-GO (P3) e PRF Administrativo (P4). O P4 aponta diretamente para o GitHub Pages do PRF; a grade usa quatro colunas em telas amplas e duas colunas abaixo de 720 px. O PRF mantém suas sessões de segunda, quarta e sexta e o Notion como fonte de verdade. A mudança não troca o projeto padrão da Central nem atribui ao site PRF um contrato de status operacional.


## Correção visual e cache PWA — v27.1.1

QA visual encurtou o CTA do cartão PRF para evitar que a seta quebre sozinha junto do botão de foco. O cache do service worker e as URLs do runtime/registry também foram versionados como `27.1.1`, renovando o app shell instalado. O contrato do registry e a separação entre projetos e ferramentas não mudam.


## Frases do Major Cadar — v27.2

As seis frases curtas atribuídas ao Major Cadar alternam automaticamente a cada cinco minutos enquanto a página está aberta. Texto, autoria e link individual da origem são atualizados juntos; ao voltar para a aba, o relógio e a frase recalculam o estado atual. O fallback sem JavaScript preserva uma frase, autoria e fonte coerentes. A rotação não adiciona chamadas externas; o usuário abre a fonte somente ao ativar o link. O relógio de Brasília e a saudação continuam independentes da escolha da frase.

## Fechamento do dia — v27.5.0

A tela Hoje oferece um fechamento curto com quatro leituras: **previsto** (o cartão marcado HOJE na grade existente), **feito** (confirmado no projeto de origem), **bloqueado** (pendência editorial, como material PRF ainda incompleto) e **retomada** (continuação no próximo slot, sem deslocar a grade).

O fechamento não registra presença nem cria um segundo histórico. Os contratos read-only em Evolução mostram o estado publicado, a origem e as datas publishedAt/source.updatedAt; esses timestamps descrevem a publicação do projeto e não comprovam execução individual. O PRF não publica contrato de status; o link do Notion permanece como fonte de verdade. Se um material PRF impedir a sessão, o mesmo PRFADMxx volta no próximo dia previsto, sem pular códigos ou compensar em outro projeto.

A mudança é somente de apresentação e documentação na Central: sem novo fetch, backend, armazenamento de execução ou escrita nos projetos-filhos. A grade P1–P4 e o foco de navegação permanecem independentes.


## Registro local de estudo — v27.7.0

O registro é uma exceção estreita à regra de observabilidade somente leitura: ele grava apenas o que a pessoa lançar e confirmar no próprio navegador. Não há chamada de rede, backend, login ou escrita em fonte acadêmica. Dados podem ser exportados/restaurados em JSON; tópicos desconhecidos, duração inválida e lançamentos sem confirmação são rejeitados. A camada guiada lê a grade estática ``#agenda-semanal`` e um catálogo versionado da Central; esses metadados não replicam o avanço dos projetos. Resumos acompanham o dia e a semana selecionados. Nenhum bloco é salvo sem duração positiva e confirmação explícita. O esquema do histórico local permanece inalterado.


## Mentor adaptativo local — v27.8

A v27.8 introduz uma camada de recomendação determinística e explicável no Mentor. Ela **não é um LLM**, não chama OpenAI API e não gera custo por tokens.

Entradas autorizadas:
- grade semanal já publicada na Central;
- blocos reais do `central-estudos:study-log-v1` (incluindo os sincronizados pela tabela isolada da Central);
- recência e distribuição desses próprios registros;
- foco escolhido pelo usuário somente como sinal auxiliar de desempate.

Regras de integridade:
- a recomendação é separada do foco e nunca grava um novo foco automaticamente;
- ausência de registro é tratada como **sem registro na Central**, nunca como ausência de estudo comprovada;
- tempo registrado não confirma conclusão, domínio, nota, erro ou progresso no projeto de origem;
- o Mentor expõe nível de confiança e os motivos da sugestão;
- acertos, erros, desempenho e matéria fraca só poderão participar quando houver um contrato de dados explícito e confiável para isso;
- a camada fica em `operational-v13.js`/CSS, carregada online e fora do `APP_SHELL`, preservando o orçamento offline.

O fechamento diário usa a mesma semântica: previsto, registrado e pendente **no registro**, sem fabricar execução. Os projetos-filhos continuam soberanos sobre seu próprio progresso.


## Sinais pedagógicos dos projetos — v27.9

A v27.9 amplia o contrato read-only sem transformar a Central em fonte de verdade. O campo opcional `study` pode publicar somente sinais sanitizados que o projeto de origem consegue comprovar: última unidade, próxima unidade, data de execução, questões, acertos, erros, dúvidas, precisão, revisões, erros ativos e contagens de sessões. Campo ausente é desconhecido, não zero.

Fluxos:
- **SEEDF:** Notion → workflow do projeto → snapshots sanitizados → `public/central-status.json` → Central.
- **TJDFT:** Notion → Study OS/snapshots sanitizados → `public/central-status.json` → Central.
- **PRF Administrativo:** Notion → `content/prf-notion.json` → `central-status.json` → Central. O token permanece no GitHub Actions.
- **TCE-GO:** contrato público continua sem progresso privado. Quando a Central está autenticada no Supabase, ela lê `tce_progress_state` sob RLS `owner_id = auth.uid()` e transforma o resultado em sinal somente em memória no navegador.

A recomendação do Mentor pode considerar revisão vencida, precisão publicada, erros ativos, próxima unidade, recência e grade do dia. Ela não altera o foco e não cria escrita nos projetos-filhos. O TCE não perde a separação entre calendário público e execução privada.


## Mentor dedicado — v28

A v28 separa a orientação adaptativa da Home. A página `mentor/index.html` é uma filha da Central, na mesma origem, e por isso compartilha apenas o estado local que já pertence à Central.

Fontes autorizadas:
- `config/projects.json` e `config/study-schedule-v1.json`;
- blocos confirmados em `central-estudos:study-log-v1`;
- contratos read-only `central-status.json` de SEEDF, TJDFT e PRF Administrativo;
- progresso privado do TCE-GO via Supabase somente quando existe sessão válida, com RLS por `owner_id`.

A página não escreve em nenhum projeto-filho. Seu motor é determinístico e explica os sinais usados. Revisões vencidas, precisão e erros só entram quando publicados por uma fonte validada. Campo ausente permanece desconhecido. O foco humano continua separado da recomendação. Não há chamada à OpenAI API.

A Home preserva Radar/estado técnico e apenas direciona ao Mentor. O comando rápido `Ir para Mentor` e o sexto item da navegação principal abrem a página filha, evitando duplicação do painel completo dentro da Home.

### Panorama visual P1–P4 — v28.0.3

Na aba “Agora”, um painel resume SEEDF (P1), TJDFT (P2), TCE-GO (P3) e PRF Administrativo (P4) na ordem de prioridade. Cada cartão expõe a situação da fonte, execução prevista/confirmada, próxima etapa publicada e questões/precisão quando existem. Um indicador distingue o tempo dos últimos sete dias registrado localmente na Central dos dados publicados pelos projetos. Ausência de contrato, amostra ou progresso permanece explicitamente desconhecida.

As quatro abas usam `tablist`/`tab`/`tabpanel`, seleção única e navegação por setas, Home e End. O status de sincronização explica que “Atualizar dados” relê contratos; sincronizações de origem continuam nos projetos. O layout reflowa para duas colunas em telas menores e uma coluna em telas muito estreitas. O Mentor continua read-only e não altera o foco padrão TCE-GO nem os projetos-filhos.

## Jornada e registry compartilhado — v28.1.0

`config/projects.json` é o catálogo de navegação das duas centrais. Para P1–P4, ele declara código, nome curto, ordem, site e endpoint de estado; a ordem desse catálogo não substitui a prioridade operacional. TCE-GO continua como foco padrão da Central e a grade semanal é outra configuração, preservada em `config/study-schedule-v1.json`.

O Painel Estratégico, servido pelo repositório independente `plano-de-transicao`, consulta o catálogo público da Central e, em seguida, faz somente `GET` nos `statusUrl` declarados para P1–P4. Ele valida `schemaVersion: 1` e o `projectId`, mostra fase/ação/proveniência e identifica publicação antiga ou indisponível. O widget não lê o objeto opcional `study`; assim ele não transforma o progresso privado do TCE-GO em dado público nem duplica indicadores detalhados já expostos pelos outros projetos.

A Central aponta para a Jornada por link. Não há chamada da Central ao Painel Estratégico, do Painel ao Notion dos projetos, nem dependência operacional entre as duas páginas. Se o catálogo ou um endpoint falhar, os módulos existentes e os links diretos continuam disponíveis.


## Carteira ativa P1–P3 e arquivo TCE-GO — v28.3.0

A Central mantém SEEDF (P1), TJDFT (P2) e PRF Administrativo (P3) como projetos ativos. TCE-GO muda para status archived e disponibilidade archive-only; o registry retém seu link, repositório e nota histórica, mas não o usa para agenda, foco, catálogo de matérias, monitoramento ou leitura de progresso privado. O Workspace continua expondo o link de histórico.

O foco salvo tcego migra uma única vez para o foco ativo padrão, SEEDF. A chave de última visita permanece intacta e a tela de retomada a rotula como histórico, sem oferecer reabertura como ação ativa. Preferências de ordenação removem IDs arquivados e preservam a ordem relativa dos IDs ativos.

Os logs locais continuam aceitando tcego como ID conhecido para ler, exportar e importar registros históricos; os totais atuais consideram apenas projetos ativos. A sincronização opcional continua restrita à tabela genérica central_study_logs. O Mentor e o painel operacional não consultam tce_progress_state; a Jornada lista projetos arquivados separadamente e só consulta statusUrl de projetos ativos.

Na SEEDF, o normalizador aceita IDs de sessão L, R e Q. Uma sessão de questões L05 pode aparecer como atividade mais recente sem avançar lastCompletedUnit; leitura e D0 permanecem pendentes até serem confirmados na fonte. O workflow de sincronização publica o estado sanitizado a partir do Notion após a alteração do contrato.

## Plano do dia e revisões — v28.7

`daily-workspace-v1.js` deriva a Home e Revisões dos eventos existentes `central:workspace-ready` e `central:contract-state`. O modelo filtra os projetos ativos, valida os registros pelo motor do tracker e mantém números não publicados como ausência de dado. A grade é lida da marcação canônica da agenda, sem uma segunda regra semanal. Nenhuma nova chamada de rede ou escrita em storage é criada pela camada de apresentação. O botão de consulta delega ao carregador de contratos existente.

O router v24 mantém os hashes antigos e adiciona `#revisoes` e `#mais`. As telas secundárias mantêm Mais selecionado. Views locais aceitam também as duas novas telas. O observador antigo de scroll não substitui mais a seleção do router.

`central:study-log-updated` é emitido após uma gravação bem-sucedida do tracker; `central:study-log-select-project` seleciona apenas um projeto ativo para o formulário manual. A regra automática de conclusão e a retenção dos históricos são preservadas.
