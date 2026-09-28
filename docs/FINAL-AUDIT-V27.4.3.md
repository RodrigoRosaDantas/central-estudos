# Auditoria final — Central de Estudos v27.4.3

**Status:** PUBLISHED — Quality gate e GitHub Pages concluídos com sucesso.  
**Data:** 2026-09-28.  
**Commit publicado:** `ead44b0ff4ed3a437c502950c5823ea1d2bc6e0b`.  
**Workflow:** `Validate and deploy Central de Estudos`, run `36460170138` (#377).  
**Escopo:** corrigir a sequência PRF para PRFADM01–33 e atualizar a descrição do manifesto PWA.

## Correções

- A agenda agora corresponde à fonte canônica do Notion: 33 sessões, de PRFADM01 a PRFADM33; PRFADM33 fecha a volta.
- O manifesto PWA lista TCE-GO, SEEDF, TJDFT, PRF Administrativo e Plataforma de Questões.
- Registry, HTML, runtime e service worker compartilham a versão v27.4.3 e o novo cache.

## Evidências e verificações

- A página publicada carregou a versão v27.4.3 e exibiu a frase em um cartão destacado na captura desktop.
- Em viewport desktop de 1363 × 936, não houve overflow horizontal. A agenda exibe P1–P4, o PRF às segundas, quartas e sextas, e o ciclo PRFADM01–33.
- A inspeção do DOM ao vivo não encontrou âncoras internas quebradas, IDs duplicados, links ou botões sem nome acessível, nem imagens sem texto alternativo.
- O job `Quality gate` e o job `Deploy` passaram no workflow run `36460170138`.
- App shell: 147.304/147.456 bytes bruto (margem 152) e 47.924/49.152 bytes gzip (margem 1.228).
- O foco padrão continua TCE-GO; Notion segue como fonte de verdade do PRF; P1–P4 foram preservados.
- TCE-GO, SEEDF, TJDFT, PRF e Plataforma de Questões não receberam writes nesta etapa.

## Limite de verificação

- A conferência visual ao vivo foi feita em desktop. A suíte de qualidade cobre os contratos responsivos e de acessibilidade; não foi feita uma sessão manual de navegador em viewport móvel nesta publicação.
