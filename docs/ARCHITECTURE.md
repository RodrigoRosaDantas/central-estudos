# Arquitetura — Central de Estudos

## Responsabilidade

A Central é uma camada de **navegação e observabilidade leve**.

> A Central observa e direciona. Os projetos executam e decidem.

Ela lista ambientes, destaca foco, recorda último acesso, oferece organização local, testa disponibilidade sem bloquear navegação e direciona ao site real. Não edita dados internos, não altera Supabase, não importa dashboards, não assume regras pedagógicas e não cria dependência obrigatória entre ambientes.

## Registry

A fonte dinâmica de verdade é `config/projects.json` (`schemaVersion: 3`). O lifecycle é explícito em `status`: `active`, `archived` ou `future`. Projetos ativos/arquivados possuem URL e repositório HTTPS; futuros podem existir sem URL até o ambiente ser criado. `statusUrl` continua opcional e destinado ao contrato read-only.

## Fallback e progressive enhancement

`index.html` contém uma cópia mínima dos três acessos diretos. Essa duplicação é intencional e restrita ao fallback. Se JavaScript ou registry falharem, TCE-GO, SEEDF e TJDFT continuam acessíveis. JavaScript melhora foco, retomada, catálogo, preferências, diagnóstico e observabilidade, mas nunca é requisito para abrir um projeto.

## Estado local e separação semântica

A Central usa `localStorage` somente para preferências e continuidade da própria Central. **Foco**, **retomada/último acesso**, **favorito**, **acesso local** e **recência técnica** são conceitos independentes. Nenhum altera automaticamente outro. Nenhum dado acadêmico, duração, desempenho ou progresso é gravado ou inferido.

Todo acesso a armazenamento local degrada com segurança; conteúdo inválido é ignorado/limpo e defaults previsíveis são usados.

## Observabilidade

Somente leitura, não bloqueante e separada de estudo. Disponibilidade, publicação técnica e deploy são dados distintos. Falha de rede é inconclusiva; metadados públicos usam cache controlado/stale explícito; rate limit não bloqueia navegação. Contrato detalhado em `docs/OBSERVABILITY-V3.md`.

## Catálogo e personalização

Busca, favoritos, ordenação, atalhos e ordem manual são camadas locais sobre o registry. Preferências de densidade/apresentação são reversíveis. Nada disso altera `projects.json`, dados técnicos ou projetos-filhos. A ação principal continua **Abrir ambiente**.

## PWA e resiliência

O service worker é limitado à origem e ao pathname da Central. O cache da release atual é `central-shell-v24.0.0` e contém somente o app shell da Central.

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

`tests/quality.mjs` é uma suite local, determinística e sem dependências externas. O workflow Pages executa `quality` antes de `deploy`, com dependência explícita `deploy needs: quality`. O gate cobre registry, referências, fallback, manifest, service worker, segurança básica, funções críticas, contratos de diagnóstico, acessibilidade estrutural, mobile e orçamento de payload.

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
