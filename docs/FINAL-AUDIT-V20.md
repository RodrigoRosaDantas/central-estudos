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
| Performance | PASS | artefato final: 130.983 bytes <= 131.072 bytes; margem de 89 bytes. |
| Segurança | PASS automatizado | CSP, HTTPS, IDs, escaping, ausência de scripts externos obrigatórios e varredura de secrets cobertos. |
| PWA | PASS estrutural/automatizado | network-first, cache limitado à origem/path da Central, rotação de cache e isolamento de URLs externas. |
| Offline | PASS estrutural | shell pode abrir em cache; projetos-filhos não são apresentados como offline nem entram no APP_SHELL. |
| Contratos | PASS automatizado | schema v1, timeout, cache curto, stale, GET read-only, validação e falha não bloqueante preservados. |
| Observabilidade | PASS automatizado | disponibilidade, atualização técnica, deploy e contrato permanecem sinais distintos. |
| Registry | PASS automatizado | schema v3, IDs únicos, lifecycle explícito, URLs HTTPS e default ativo. |
| Documentação | PASS estrutural | README, arquitetura, changelog, roadmap, checkpoints e esta auditoria reconciliados para v20. |
| Workflow | PASS automatizado | quality precede deploy por dependência explícita; deploy não ocorre com gate vermelho. |
| Projetos-filhos | PASS final | TCE-GO `889017ba83143be268a84358229882a2b3ef9289`; SEEDF `b68431e2aa4944199705400c8821bf28505299d1`; TJDFT `99877771dcd008594d6855c08f077e1563e609bd`; iguais ao preflight, zero writes. |

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

Os critérios acima foram satisfeitos pelo release candidate validado em produção.

## Evidência terminal

- **Release:** 20.0.0
- **Commit validado:** `8980ec3de229b85722556d5a9bc2ecc185965476`
- **Workflow:** `36332111657` — quality `success` + deploy `success`
- **Artefato Pages:** `10935679416`
- **Digest:** `sha256:9f9d0a728fb8129bab5ddf0ef912594165ba5bcaed5cca3069fd2444bdfc3f27`
- **Shell:** 130.983 bytes / 131.072 bytes
- **Registry:** 20.0.0
- **Cache PWA:** `central-shell-v20.0.0`
- **Fallback/no-JS:** PASS
- **Links diretos:** PASS
- **Secrets óbvios:** nenhum detectado
- **Filhos:** HEADs finais iguais ao preflight; zero writes

### Resultado final

**PASS — v20.0.0 apta para COMPLETE.**

A inspeção visual interativa real não foi alegada. Mobile, desktop, acessibilidade visual e offline foram validados estruturalmente/automaticamente quando aplicável.
