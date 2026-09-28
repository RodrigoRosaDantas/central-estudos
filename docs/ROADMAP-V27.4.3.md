# Roadmap v27.4.3 — consistência da roda PRF

**Release:** 27.4.3  
**Stage:** VALIDATING  
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

- Quality gate local e workflow main devem passar antes do fechamento.
- A auditoria final deve registrar o commit publicado, o deploy Pages e o tamanho final do app shell.
