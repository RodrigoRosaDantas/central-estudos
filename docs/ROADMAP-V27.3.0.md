# Roadmap v27.3.0 — agenda contextual e mudanças publicadas

**Release:** 27.3.0  
**Stage:** IN_PROGRESS  
**Baseline:** `main` em `87ee96e18d6f23a68167ff177419a89170856cd0`.  
**Escopo autorizado:** destacar o dia corrente, tornar visíveis mudanças entre snapshots de contratos, corrigir a classificação do PRF na agenda e atualizar governança/versionamento.

## Objetivos

1. Marcar o dia correspondente ao horário de Brasília nos sete cartões, inclusive ao cruzar a meia-noite local.
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

## Validação e limites

- Rodar `node tests/quality.mjs`, incluindo a virada de dia em `America/Sao_Paulo`, comparação live/cache, segurança DOM, rotas locais, PWA e orçamento.
- Verificar o deploy do GitHub Pages e conferir a versão servida.
- Inspeção visual manual em viewport móvel continua pendente até que uma tela móvel real/emulada esteja disponível; os testes CSS não substituem essa inspeção.
- Preservar o teto autorizado pós-v20 de 147.456 bytes brutos e 49.152 bytes gzipados.

## Limites de escrita

Alterar somente `RodrigoRosaDantas/central-estudos` e a fonte mestra da Central. Projetos-filhos, Notion, Plataforma de Questões e Work Sites permanecem sem escrita.
