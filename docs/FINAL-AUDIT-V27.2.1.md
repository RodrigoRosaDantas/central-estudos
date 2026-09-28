# Auditoria final — Central de Estudos v27.2.1

**Status:** PASS nas verificações funcionais e de publicação; QA visual móvel não disponível nesta sessão. Teto pós-v20 atualizado por autorização explícita do usuário em 28/09/2026.  
**Data:** 2026-09-28.  
**Feature commit:** [`36642236d7f1f74135d2df2680de2e9011b58756`](https://github.com/RodrigoRosaDantas/central-estudos/commit/36642236d7f1f74135d2df2680de2e9011b58756) — Quality gate + Pages Deploy `36369665244` — SUCCESS.  
**Patch final:** [`ce5288686fc8d8d60e504455721653ef5cb6a260`](https://github.com/RodrigoRosaDantas/central-estudos/commit/ce5288686fc8d8d60e504455721653ef5cb6a260) — Quality gate + Pages Deploy [36369866365](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36369866365) — SUCCESS.  
**Artefato Pages final:** `10948796852`, 131.463 bytes, digest `sha256:c7acdea6599e50d905f3d735c3e9da7a9d3222a4f4d2589d6fbc16e2532debf3`.

## Escopo conferido

- A frase diária alterna seis trechos atribuídos ao Major Cadar, em português, estáveis por dia no fuso `America/Sao_Paulo`.
- O rótulo, a autoria e a origem aparecem juntos; cada item aponta ao perfil Caveira Cadar 09, ao site do Método Cão Pastor ou ao vídeo de origem correspondente.
- HTML mantém frase, autoria e fonte coerentes como fallback sem JavaScript. Não há nova chamada de rede nem embed externo.
- Relógio de Brasília, saudação, projetos, foco/retomada, PRF no Notion, plataforma de questões, prioridades e agenda foram preservados.
- Nenhum projeto-filho, Notion, site de questões ou Work Sites recebeu escrita.

## Erro encontrado e correção

A primeira inspeção visual mostrou que o selo do painel **Hoje** continuava em `V27.1.1`, enquanto o header já mostrava v27.2.0. Corrigi o selo e alinhei header, registry, URL do runtime e cache PWA em v27.2.1. O quality gate ganhou uma asserção que compara a versão do selo do painel com a versão atual do registry; a suíte passou novamente antes do patch ser publicado.

## Resolução do teto na reauditoria — 2026-09-28

O usuário autorizou formalmente a atualização do teto da fonte-mestra para a linha pós-v20. O documento de decisão `docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md` registra o novo limite de 147.456 bytes bruto e 49.152 bytes gzip; a fonte-mestra foi atualizada no mesmo sentido. O shell v27.2.1 mede 144.728 bytes brutos (margem 2.728) e 46.607 bytes gzipados (margem 2.545), portanto passa no orçamento autorizado. O limite de 131.072 bytes permanece como referência histórica da geração v16→v20; nenhuma elevação além do novo teto está autorizada.

## Verificação técnica e visual

- `node tests/quality.mjs`: PASS localmente após a correção. Inclui rotação de seis frases distintas, autoria e destino de fonte, sintaxe, segurança, acessibilidade, fallback, regressões históricas e cache PWA.
- Quality gate e Deploy no workflow `36369866365`: SUCCESS.
- App shell: **23 recursos únicos**, 144.728 bytes brutos (limite 147.456) e soma gzip individual de 46.607 bytes (limite 49.152).
- Página publicada: [Central de Estudos](https://rodrigorosadantas.github.io/central-estudos/). DOM confirmou header V27.2.1, selo Hoje V27.2.1, autor Major Cadar, frase e link de origem. A fonte abriu em nova guia somente por ação explícita.
- Inspeção visual desktop a 1363×936: sem overflow horizontal; largura útil do documento, 1348 px. O banner de atualização PWA foi concluído ao acionar **Atualizar agora**.
- Registro visual: `central-estudos-v27.2.1-cadar.png`.

## Limite

O navegador desta sessão não expõe viewport móvel/emulação responsiva. QA visual mobile fica pendente; o quality gate e as regras responsivas existentes passaram, mas não substituem inspeção real em celular.
