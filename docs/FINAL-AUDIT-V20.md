# Auditoria final — v20.0.0

Data: 2026-09-27

## Escopo

Auditoria terminal da geração Workspace PRO v16→v20. A v20 não adiciona responsabilidade funcional; consolida a arquitetura, revalida regressões e prepara o encerramento terminal somente após quality, deploy, artefato Pages e guarda final dos projetos-filhos.

## Resultado por domínio

| Domínio | Resultado | Evidência / critério |
| --- | --- | --- |
| Arquitetura | PASS estrutural | Central permanece camada de navegação/observabilidade/preferências; sem banco mestre, iframe ou backend compartilhado. |
| Regressão v10 | PASS automatizado | checkpoint v10 permanece COMPLETE; fallback, segurança, PWA e observabilidade continuam cobertos pelo quality gate. |
| Regressão v15 | PASS automatizado | checkpoint v15 permanece COMPLETE; lifecycle, Workspace e backup allowlisted continuam cobertos. |
| v16 Command Palette | PASS automatizado | teclado/touch, busca, foco/retomada e zero fetch próprio preservados. |
| v17 Inbox | PASS automatizado | ações/alertas/filtros/provenance/stale e ordem de catálogo preservados. |
| v18 Proveniência | PASS automatizado | source/ref/schema, idade e refresh manual GET read-only preservados. |
| v19 Views locais | PASS automatizado | views limitadas/validadas e backup allowlisted; foco/retomada/caches excluídos. |
| Mobile | PASS estrutural/automatizado | viewport, breakpoints, coarse pointer/touch targets e layout responsivo continuam cobertos. |
| Teclado | PASS automatizado | skip link, focus-visible, Ctrl/Cmd+K, setas, Enter e Escape cobertos. |
| Acessibilidade | PASS estrutural/automatizado | contraste crítico, forced-colors, ARIA e controles progressivos cobertos. |
| Performance | PASS condicionado ao artefato final | budget terminal <= 131.072 bytes; valor final registrado após deploy do release candidate. |
| Segurança | PASS automatizado | CSP, HTTPS, IDs, escaping, ausência de scripts externos obrigatórios e varredura de secrets cobertos. |
| PWA | PASS estrutural/automatizado | network-first, cache limitado à origem/path da Central, rotação de cache e isolamento de URLs externas. |
| Offline | PASS estrutural | shell pode abrir em cache; projetos-filhos não são apresentados como offline nem entram no APP_SHELL. |
| Contratos | PASS automatizado | schema v1, timeout, cache curto, stale, GET read-only, validação e falha não bloqueante preservados. |
| Observabilidade | PASS automatizado | disponibilidade, atualização técnica, deploy e contrato permanecem sinais distintos. |
| Registry | PASS automatizado | schema v3, IDs únicos, lifecycle explícito, URLs HTTPS e default ativo. |
| Documentação | PASS estrutural | README, arquitetura, changelog, roadmap, checkpoints e esta auditoria reconciliados para v20. |
| Workflow | PASS automatizado | quality precede deploy por dependência explícita; deploy não ocorre com gate vermelho. |
| Projetos-filhos | PENDENTE guarda final | TCE-GO, SEEDF e TJDFT permanecem read-only; HEADs finais serão registrados após QA do release candidate. |

## Limitação explícita

Quando não há navegador gráfico interativo disponível, mobile, desktop, acessibilidade visual e comportamento offline são classificados como validação estrutural/automatizada. Nenhuma inspeção visual real é inventada.

## Critério terminal

A v20 somente pode ser marcada COMPLETE quando:
1. o quality gate do release candidate passar;
2. o deploy Pages do mesmo HEAD passar;
3. o artefato publicado respeitar o budget e os contratos críticos;
4. registry, app-shell e documentação estiverem coerentes;
5. os HEADs de TCE-GO, SEEDF e TJDFT forem reconferidos e iguais ao preflight;
6. o commit final de fechamento também passar em quality + deploy.

Até lá, o checkpoint permanece VALIDATING.
