# Qualidade e testes — v7

A v7 transforma a auditoria essencial da Central em um gate automatizado e sem dependências de terceiros.

## Princípios

- o quality gate roda antes do deploy;
- se o job `quality` falhar, o job `deploy` não é executado;
- os testes não escrevem nem dependem de escrita em TCE-GO, SEEDF ou TJDFT;
- os testes não dependem de rede externa;
- o gate usa apenas Node.js e módulos nativos;
- a auditoria automatizada complementa, não substitui, o protocolo humano/documental.

## Suite

Arquivo: `tests/quality.mjs`.

Validações automatizadas:
- sintaxe de `app.js`, catálogo, personalização, PWA e service worker;
- schema básico e integridade do registry;
- IDs únicos;
- URLs HTTPS;
- `defaultProject` existente;
- fallback estático de todos os projetos;
- referências locais do HTML;
- IDs estáticos duplicados;
- presença de `noscript`;
- manifest, escopo, start URL e ícones;
- inventário do app shell;
- isolamento do service worker;
- ausência de cache de projetos-filhos e GitHub API;
- detecção simples de secrets/tokens no frontend;
- contratos críticos de PWA;
- funções críticas reais do `app.js` em sandbox Node:
  - `validateConfig`;
  - `chooseFocus`;
  - `readLastVisit`;
  - rejeição de ID duplicado;
  - rejeição de URL HTTP;
  - preferência de foco válida;
  - limpeza de estado local corrompido.

## Workflow

`.github/workflows/pages.yml` contém dois jobs:

1. `quality`;
2. `deploy`, com `needs: quality`.

Portanto, um erro no gate impede a publicação do commit.

## Limitações

A suite é intencionalmente leve e determinística. Ela não substitui:
- inspeção visual em navegador real;
- auditoria de acessibilidade completa;
- testes offline reais do service worker;
- auditoria de performance e segurança aprofundada.

Esses pontos permanecem para hardening e auditoria final das majors posteriores.
