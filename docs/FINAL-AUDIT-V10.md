# Auditoria final — v10.0.0

Data: 2026-09-26

## Escopo

Auditoria terminal da Central de Estudos conforme `COMMAND-V10`, `ACCEPTANCE-V10` e `AUDIT-PROTOCOL`. A v10 não adiciona responsabilidade nova: consolida a arquitetura e valida a release estável.

## Resultado por domínio

| Domínio | Resultado | Evidência/observação |
| --- | --- | --- |
| Arquitetura | PASS | Central permanece camada de navegação/observabilidade; registry é fonte dinâmica; sem banco mestre/iframe/acoplamento obrigatório. |
| Independência | PASS | Projetos-filhos são links/metadata somente leitura; nenhum write executado. |
| UX/navegação | PASS estrutural | Ação principal abre ambiente; foco, retomada, favorito e recência permanecem separados. |
| Mobile | PASS estrutural | viewport, breakpoints 360/419/480/680/720/760, touch targets e wrapping cobertos pelo gate v9. |
| Desktop/teclado | PASS estrutural | skip link, `:focus-visible`, atalhos protegidos em controles editáveis. |
| Acessibilidade | PASS automatizado/estrutural | contraste crítico >= 4.5:1, forced-colors, relações ARIA e controles progressivos auditados. |
| Performance | PASS | shell permanece abaixo do orçamento automatizado de 120 KiB e sem dependências externas de JS/CSS. |
| Segurança frontend | PASS | CSP, HTTPS, escape de conteúdo, IDs seguros, varredura de secrets e ausência de inline/external script obrigatório. |
| PWA | PASS estrutural | service worker limitado à origem/escopo da Central; cache rotacionado para `central-shell-v10.0.0`. |
| Cache/offline | PASS estrutural | network-first; app shell local; APIs e projetos-filhos não são cacheados; offline não implica projeto offline. |
| Observabilidade | PASS | disponibilidade, publicação técnica e deploy separados; falha de rede é inconclusiva. |
| Rate limit | PASS | tratamento existente preserva navegação e permite stale/cache explícito. |
| Fallback | PASS | HTML/noscript mantém os três acessos diretos independentemente de JS/registry. |
| 404 | PASS estrutural | `404.html` presente e referenciado no inventário. |
| Documentação | PASS | README, arquitetura, changelog, checkpoint e auditoria final consolidados para v10. |
| Código morto/duplicação | PASS automatizado | gate v9 cobre JS/CSS órfãos e funções nomeadas mortas; duplicação mínima do fallback é intencional. |
| Registry | PASS | schema 1, IDs únicos, default existente, HTTPS e versão semântica 10.0.0. |
| Workflow | PASS | `quality` precede `deploy`; deploy depende de quality; Node 22; sem dependências npm. |
| Recuperação de falha | PASS | progressive enhancement, fallback estático, cache network-first e política de rollback documentada. |
| Histórico/changelog | PASS | majors v2→v9 registradas; v10 é a release terminal. |
| Projetos-filhos | PASS no preflight | TCE-GO `2986dabf...`; SEEDF `bb006c3b...`; TJDFT `8aa366c0...`; conferir novamente antes do fechamento. |

## Quality gate terminal

A release somente pode ser marcada COMPLETE quando o workflow do commit final concluir `quality: success` e `deploy: success`, o artefato corresponder ao HEAD final, os arquivos críticos forem revalidados na `main` e os três SHAs filhos forem conferidos novamente.

## Limitação explícita

Não foi inventada inspeção visual real em navegador quando a ferramenta disponível não oferece renderização interativa. Os itens de mobile, desktop, acessibilidade e offline são validados estruturalmente e pelos contratos automatizados existentes. Essa limitação não substitui nem reduz os gates automatizados.

## Critério terminal

Com os gates acima e o deploy final aprovados: `Status: COMPLETE — v10.0.0`, `Next major: none`, `Active major: none`, `Stage: COMPLETE`. Não iniciar v11.
