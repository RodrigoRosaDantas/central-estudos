# CHECKPOINT — v21 Presença e Ritmo

## Abertura
- **Versão de origem:** 20.0.0 (terminal concluída).
- **Major ativo:** 21.0.0.
- **Versão terminal planejada:** 21.0.0.
- **Stage:** IN_PROGRESS — VALIDATING.
- **Autorização:** solicitação explícita “Executa”, 2026-09-27, para a grande atualização descrita pelo usuário.
- **Central HEAD antes da v21:** `c5286462edca2cf950b592752edf7a9fc08a6fed`.
- **Último workflow conhecido:** `36339982909` — quality + deploy SUCCESS.
- **Último artefato conhecido:** `10939005228`, digest `sha256:521c19fcec5614da9b2b9caaf59d9d6fab81bae799b96e1b12b2e894117d0fc5`.
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289` — READ-ONLY.
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1` — READ-ONLY.
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd` — READ-ONLY.
- **Shell v20:** 130.229 bytes.
- **Teto imutável:** 131.072 bytes; margem inicial 843 bytes.
- **Roadmap:** `docs/ROADMAP-V21.md`.
- **Aceitação:** `docs/ACCEPTANCE-V21.md`.

## Escopo aprovado
Abertura mais acolhedora e visualmente clara; frase original determinística por data de Brasília; relógio mais expressivo com hora, dia/data por extenso e atualização correta; polimento visual responsivo da Central. Sem backend, dependência remota, métricas fictícias ou alteração nos projetos filhos.

## Riscos e controles
O risco principal é o limite de 128 KiB, com apenas 843 bytes livres no baseline; recuperar espaço antes da ampliação do shell. Preservar fallback/no-JS, navegação e acessibilidade. Revalidar horário/fuso na virada do dia e na retomada de aba. Inspeção mobile deve usar viewport real; não declarar validação visual com base apenas em checks estruturais.

## Validação pré-release
- **Quality gate local:** PASS, incluindo regressões v10→v20, acessibilidade estrutural, contratos, segurança e orçamento.
- **Teste do relógio:** 00:15 de Brasília validado com relógio do dispositivo em UTC; dia/data em português conferidos.
- **Teste de motivação:** frase permanece estável dentro do dia e muda na virada de data do calendário de Brasília.
- **Shell funcional:** 130.650 bytes <= 131.072 bytes; margem 422 bytes.
- **Visual:** inspeção de viewport pós-deploy pendente.
- **Pipelines, artefato e guarda final dos projetos-filhos:** registrar após publicação.

## Execução
Código e metadata da release estão em validação. `Stage=COMPLETE`, `Active major=none` e `Next major=none` somente após quality + deploy + pós-deploy QA e guarda final dos filhos. Não iniciar v22.
