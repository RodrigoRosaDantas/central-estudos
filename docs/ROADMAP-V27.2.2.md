# Roadmap v27.2.2 — rotação das frases do Major Cadar

**Release:** 27.2.2  
**Baseline:** `main` em `16bd8a2e10d77f309eb1b3aa5895480bd278fe2f`.  
**Escopo:** corrigir a sensação de frase fixa, mantendo as seis frases já verificadas.

## Objetivo

Fazer as frases do Major Cadar mudarem automaticamente durante o uso, sem recarga e sem depender da virada do dia.

## Comportamento

- A Central alterna as seis frases em janelas sucessivas de cinco minutos.
- A interface atualiza frase, autoria e link da fonte como um conjunto.
- O ciclo é local e determinístico, não faz chamadas de rede e recupera a janela atual ao voltar para a aba.
- Sem JavaScript, o HTML continua oferecendo fallback estático com frase, autoria e fonte coerentes.
- O restante do relógio, foco, projetos e rotina da Central permanece inalterado.

## Verificação

`node tests/quality.mjs` valida a troca na fronteira de cinco minutos, as seis frases em seis janelas consecutivas e a correspondência individual entre texto e fonte. O Quality gate também valida versão e cache PWA e mantém o teto pós-v20 de 144 KiB bruto / 48 KiB gzip.

## Limites

Alterar somente `RodrigoRosaDantas/central-estudos`. Não escrever no Notion, na Plataforma de Questões, nos projetos-filhos ou em Work Sites.
