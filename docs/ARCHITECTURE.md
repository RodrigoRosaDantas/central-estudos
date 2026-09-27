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

O service worker é limitado à origem e ao pathname da Central. O cache da release atual é `central-shell-v15.0.0` e contém somente o app shell da Central.

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
