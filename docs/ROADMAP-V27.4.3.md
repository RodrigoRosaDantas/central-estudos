# Roadmap v27.4.3 — consistência da roda PRF

**Release:** 27.4.3  
**Stage:** PUBLISHED
**Escopo:** corrigir dados da Central após conferência com a fonte atual do PRF no Notion.

## Objetivos

1. Refletir na agenda as 33 sessões canônicas PRFADM01–33.
2. Corrigir a descrição do manifesto PWA para incluir PRF Administrativo e Plataforma de Questões.
3. Atualizar registry, URLs runtime, cache PWA, README, changelog e testes para v27.4.3.
4. Preservar P1–P4, foco padrão TCE-GO, execução do PRF às segundas, quartas e sextas e o Notion como fonte de verdade.
5. Manter os projetos-filhos somente leitura e o app shell dentro do orçamento aprovado.

## Fonte confirmada

A página-raiz “PRF Administrativo — Radar + Roda Contínua”, consultada em 28/09/2026, registra 33 sessões por volta: PRFADM30 Português, PRFADM31 Raciocínio Lógico, PRFADM32 Discursiva + Atualidades e PRFADM33 fechamento da volta.

O site do PRF e o registry da Central já indicavam 33. A agenda e parte da documentação da Central ainda mostravam 30.

## Verificação

- O workflow `Validate and deploy Central de Estudos` passou no commit de release `ead44b0ff4ed3a437c502950c5823ea1d2bc6e0b` (run `36460170138`).
- A auditoria final registra o deploy Pages, a verificação ao vivo em desktop e o tamanho final do app shell.
