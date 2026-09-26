# CHECKPOINT — Evolução até v10

## Estado da esteira

- **Versão validada:** 9.0.0
- **Meta:** 10.0.0
- **Next major:** 10.0.0
- **Active major:** 10.0.0
- **Stage:** IN_PROGRESS
- **Status:** IN PROGRESS
- **Último deploy conhecido no preflight:** workflow run 36280117734 — success — HEAD `2df04a7b76dfc960e2eb7879e4a5e865b596e712`
- **Commit de release validado anterior:** `5a243c24447c39eaaae85fd8183e599be5ac9c81` (v9.0.0)
- **Repositório:** RodrigoRosaDantas/central-estudos
- **Projetos-filhos:** READ-ONLY / NO WRITES

## Snapshot da major ativa — v10.0.0

- **Started at:** 2026-09-26 20:52 America/Sao_Paulo
- **Source version:** 9.0.0
- **Central HEAD inicial:** `2df04a7b76dfc960e2eb7879e4a5e865b596e712`
- **Último deploy inicial:** workflow run `36280117734` — success
- **Child SHAs no início:**
  - TCE-GO: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
  - SEEDF: `bb006c3bc896534716e6b568849669a7fe4424c8`
  - TJDFT: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`
- **Acceptance aplicável:** gates globais + v10 release estável + auditoria especial integral.
- **Riscos:** regressão de fallback/navegação; cache PWA antigo; divergência de versão/documentação; dependência de rede para observabilidade; inspeção visual real limitada pelas ferramentas; não confundir Pages success com aceite.

## Baseline de referência dos projetos-filhos — 2026-09-26
- TCE-GO main: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF main: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT main: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Máquina de estado
- `READY`: pode iniciar Next major.
- `IN_PROGRESS`: continuar a major ativa.
- `VALIDATING`: implementação pronta; faltam gates/deploy.
- `BLOCKED`: corrigir/reconciliar antes de avançar.
- `COMPLETE — v10.0.0`: esteira encerrada.

## Última major concluída — v9.0.0
- **Origem:** v8.0.0
- **Objetivo:** hardening antes da auditoria final v10.
- **Resultado:** PASS.
- **Acceptance v9:** PASS nos gates estruturais/lógicos verificáveis.
- **Acessibilidade:** skip link, foco visível, relações de controle, atalhos protegidos durante digitação, touch targets, forced-colors e contraste automatizado dos tokens críticos >= 4.5:1.
- **Mobile:** auditoria estrutural cobre 360/419/480/680/720/760 px.
- **Segurança frontend:** CSP, IDs seguros no registry, default válido, versão semântica, URLs normalizadas e conteúdo dinâmico/local escapado.
- **Rede:** metadata GitHub com cache; health com cache curto; deploy lookup direcionado.
- **Performance:** shell bruto 91.658 bytes; orçamento <= 120 KiB.
- **Código:** zero JS/CSS órfãos e zero funções nomeadas mortas detectadas.
- **PWA:** `central-shell-v9.0.0`.
- **Quality/deploy:** workflow run `36280042225` — success.
- **Projetos-filhos:** zero writes; SHAs finais iguais ao preflight.
- **Commit validado:** `5a243c24447c39eaaae85fd8183e599be5ac9c81`.
- **Limitação:** inspeção visual real em navegador não foi inventada.

## Histórico de majors
- 2026-09-26 — v2.0.0 — fundação consolidada — `e3cfacdf6e3784ca0236065cf34ac14c2900dd97` — Pages `36264383202` — success
- 2026-09-26 — v3.0.0 — observabilidade confiável — `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c` — Pages `36270559732` — success
- 2026-09-26 — v4.0.0 — catálogo operacional — `42ee59a34ebb34ecaa858da77b03646f25c21304` — Pages `36271496568` — success
- 2026-09-26 — v5.0.0 — personalização local — `cf8cdb818449d020923f50d63e67689b635abc96` — Pages `36272168251` — success
- 2026-09-26 — v6.0.0 — PWA e resiliência — `0c57c967e277764d1938f3a6fc91fc03f73a74e5` — Pages `36277789554` — success
- 2026-09-26 — v7.0.0 — qualidade e testes — `e47e94341c21219936133762bf3675a0251f4c79` — Pages `36278662494` — success
- 2026-09-26 — v8.0.0 — linha do tempo e diagnóstico — `e1b118a502927256029ae855f39d88fb4fd46a9b` — Pages `36279346345` — success
- 2026-09-26 — v9.0.0 — hardening — `5a243c24447c39eaaae85fd8183e599be5ac9c81` — Pages `36280042225` — success

## Regra de avanço
A v10 só fecha após auditoria especial integral, acceptance, quality gate, Pages success, post-deploy QA verificável, documentação consolidada e confirmação de zero writes nos projetos-filhos.

## Parada
Ao concluir v10.0.0: `Status: COMPLETE — v10.0.0`; `Next major: none`; `Active major: none`; `Stage: COMPLETE`; não iniciar v11; desativar automação.
