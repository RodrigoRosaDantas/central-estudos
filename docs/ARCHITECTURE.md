# Arquitetura — Central de Estudos

## Responsabilidade

A Central é uma camada de **navegação e observabilidade leve**.

> A Central observa e direciona. Os projetos executam e decidem.

Ela lista ambientes, destaca foco, recorda último acesso, oferece organização local, testa disponibilidade sem bloquear navegação e direciona ao site real. Não edita dados internos, não altera Supabase, não importa dashboards, não assume regras pedagógicas e não cria dependência obrigatória entre ambientes.

## Registry

A fonte dinâmica de verdade é `config/projects.json` (`schemaVersion: 1`). Campos de projeto: `id`, `name`, `description`, `phase`, `status`, `priority`, `icon`, `url`, `repository`.

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

O service worker é limitado à origem e ao pathname da Central. O cache da release estável é `central-shell-v10.0.0` e contém somente o app shell da Central.

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
