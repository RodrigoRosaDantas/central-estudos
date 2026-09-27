# Roadmap — Workspace PRO v16 → v20

Esta é uma nova esteira iniciada após o fechamento terminal da v15.

## Princípio

> A Central reduz atrito para acessar e compreender os projetos. Ela não substitui os projetos, não cria banco mestre e não decide pelo usuário.

Os projetos externos permanecem somente leitura nesta roadmap, salvo autorização explícita futura.

## v16 — Command Palette

**Budget da geração v16+:** <= 128 KiB. A v15 permanece registrada com seu fechamento <= 120 KiB.

Objetivo: acesso rápido por teclado e toque sem aumentar a complexidade visual da Home.

Escopo:
- abrir com Ctrl/Cmd+K;
- botão visível para toque/mobile;
- buscar projetos ativos, arquivados e futuros;
- navegar para Agora, Projetos, Workspace, Atividade e Diagnóstico;
- ações rápidas para foco e retomada quando existentes;
- teclado com ↑/↓/Enter/Escape;
- sem chamadas de rede;
- manter shell <= 128 KiB.

## v17 — Inbox operacional

Objetivo: reunir ações publicadas e alertas em uma caixa de entrada local e explicável.

Escopo previsto:
- filtros por ação/alerta/projeto;
- provenance explícita;
- stale separado de atual;
- sem ranking ou score;
- sem writes externos.

## v18 — Proveniência e frescor

Objetivo: tornar origem e idade dos contratos mais transparentes.

Escopo previsto:
- idade do contrato;
- source/ref/schema;
- compatibilidade do contrato;
- refresh manual seguro;
- diagnóstico sem inferir causa.

## v19 — Views locais

Objetivo: permitir views salvas no navegador sem backend.

Escopo previsto:
- salvar filtros/abas/lentes;
- nomear views;
- restaurar defaults;
- incluir somente preferências allowlisted no backup.

## v20 — Workspace PRO estável

Objetivo: auditoria terminal da geração v16→v20.

Escopo:
- regressão v10/v15;
- mobile/teclado/a11y;
- performance e shell budget;
- PWA/offline;
- segurança;
- contratos;
- documentação consolidada;
- zero dependência obrigatória dos projetos externos.

## Regra de avanço

Uma major por execução. A major seguinte só pode começar depois de quality + deploy + pós-deploy QA da atual.
