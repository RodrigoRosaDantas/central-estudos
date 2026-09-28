# Roadmap v27.3.0 — agenda contextual e mudanças publicadas

**Release:** 27.3.0  
**Stage:** PUBLISHED  
**Baseline:** `87ee96e18d6f23a68167ff177419a89170856cd0`.  
**Commit publicado:** `2de1734db18e21cfe94a91227af76d5185fe1031` (PR #3).  
**Escopo:** destacar o dia corrente, tornar visíveis mudanças entre snapshots de contratos, corrigir a classificação do PRF na agenda e atualizar governança/versionamento.

## Objetivos entregues

1. Marcar o dia correspondente ao horário de Brasília (`America/Sao_Paulo`) nos sete cartões, inclusive ao cruzar a meia-noite local.
2. Mostrar mudanças em fase, ciclo, unidade, próxima ação e alertas, comparando contratos validados com o último estado salvo neste aparelho.
3. Tratar PRF Administrativo como projeto independente sem prioridade numérica; manter o Notion como destino até existir site próprio confirmado.
4. Preservar a rotina semanal, os projetos-filhos, a Plataforma de Questões e o comportamento progressivo da Central.

## Regras da comparação

- Ler somente os eventos `central:contract-state` emitidos pelo consumidor de contratos validados.
- Atualizar a base local somente quando o estado for `live`.
- Identificar `cached`, `stale-cache` e falhas; nunca tratá-los como confirmação atual.
- Na primeira conferência, declarar a ausência de histórico anterior.
- Guardar o snapshot somente no navegador; não exportar junto das preferências.
- Não medir presença, estudo, desempenho ou progresso e não escrever nos filhos.

## Validação e publicação

- `node tests/quality.mjs`: PASS local e no workflow #368.
- App shell: 147.251 bytes brutos e 47.802 bytes gzipados; dentro dos limites de 147.456 / 49.152.
- Workflow #368 (`36426260988`): Quality gate e Deploy to GitHub Pages concluídos com `success`.
- Artefato Pages `10970644399`, digest `sha256:ba0a5d811341800183af12ff30c945ed484b45773901493c614b21e5b63c1400`.
- QA visual manual em viewport móvel segue pendente; os testes CSS não substituem a inspeção visual.

## Limites de escrita

Alterar somente `RodrigoRosaDantas/central-estudos` e a fonte mestra da Central. Projetos-filhos, Notion, Plataforma de Questões e Work Sites permanecem sem escrita.
