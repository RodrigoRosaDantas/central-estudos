# Hardening — v9

A v9 prepara a Central para a auditoria final da v10 sem alterar sua responsabilidade arquitetural.

## Segurança frontend

A página usa uma Content Security Policy por `meta` compatível com o GitHub Pages:

- `default-src 'self'`;
- scripts e estilos somente da própria Central;
- `connect-src 'self' https://api.github.com`;
- worker e manifest somente da própria origem;
- `object-src 'none'`;
- `base-uri 'none'`;
- `form-action 'none'`;
- `frame-src 'none'`;
- `upgrade-insecure-requests`.

Não há scripts inline nem dependências externas de JS/CSS.

O registry agora:
- exige IDs em `[A-Za-z0-9_-]`;
- exige todos os campos operacionais;
- exige `defaultProject` existente;
- exige versão semântica;
- normaliza URLs HTTPS antes do uso.

Conteúdo do registry usado em `innerHTML` é escapado. A personalização e a linha do tempo também escapam conteúdo local antes da renderização.

## Rede e observabilidade

Chamadas externas continuam opcionais e não bloqueantes.

Hardening:
- metadata GitHub mantém cache de 15 minutos;
- disponibilidade ganha cache local curto de 2 minutos;
- se o navegador está offline, health não inicia nova requisição;
- health em cache é explicitamente marcado e nunca descrito como estado atual;
- busca de deploy prefere `deploy-pages.yml/runs?per_page=1`;
- somente se o workflow padrão não puder ser usado ocorre fallback para uma busca genérica de até 30 runs;
- a linha do tempo v8 continua sem chamadas de rede próprias.

## Acessibilidade e teclado

Revisado estruturalmente:
- skip link;
- foco visível por `:focus-visible`;
- controles de catálogo associados a `projects-grid`;
- `clear-history` nasce desabilitado até o enhancement confirmar histórico;
- atalhos `Alt+1..9` ignoram inputs, textareas, selects e conteúdo editável;
- favoritos expõem `aria-pressed`;
- regiões dinâmicas essenciais usam live region sem atomicidade total;
- `summary` técnico e controles touch têm alvo mínimo reforçado;
- modo `forced-colors` recebe bordas explícitas.

Contraste automatizado dos tokens `text`, `muted`, `success`, `warning` e `danger` contra `bg` e `surface` deve permanecer >= 4.5:1.

## Mobile

Auditoria estrutural cobre os breakpoints já existentes e o novo hardening de 360 px:

- 360 px;
- 419 px;
- 480 px;
- 680 px;
- 720 px;
- 760 px.

Em telas muito estreitas:
- shell reduz margem lateral;
- hero/resume/cards reduzem padding;
- ações respeitam largura disponível;
- texto dinâmico usa `overflow-wrap:anywhere`;
- controles por toque recebem pelo menos 44 px quando aplicável.

Não foi inventada inspeção visual em navegador real quando a ferramenta não a fornece.

## Performance e payload

O shell de primeira parte auditado na v9 possui 91.658 bytes de fonte não minificada somando HTML, CSS, JS, manifest e service worker.

O quality gate impõe orçamento máximo de 120 KiB para esse conjunto.

Não há framework, bundle externo, fonte externa ou etapa de build.

## Código morto e duplicação

Auditoria estática da v9:
- 5 arquivos JS ativos;
- 4 arquivos CSS ativos;
- zero JS/CSS órfãos no HTML/app shell;
- zero funções nomeadas detectadas com apenas a própria declaração como referência.

Helpers defensivos pequenos permanecem locais a cada módulo quando isso evita acoplamento entre enhancements.

## Edge cases cobertos

- registry com ID inválido;
- `defaultProject` inexistente;
- URL HTTP;
- estado local corrompido;
- `localStorage` indisponível;
- histórico local adulterado;
- navegador offline;
- health recente em cache;
- health antigo em cache após falha;
- GitHub API com rate limit;
- workflow de deploy padrão ausente;
- metadados stale;
- JavaScript desativado;
- service worker ausente/falhando;
- atualização PWA em espera;
- atalhos durante digitação;
- largura de 360 px;
- forced colors.

Todos devem degradar sem tornar a Central requisito para acessar TCE-GO, SEEDF ou TJDFT.
