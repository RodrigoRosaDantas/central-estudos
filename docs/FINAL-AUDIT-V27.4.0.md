# Auditoria final — Central de Estudos v27.4.0

**Status:** publicado e verificado.  
**Escopo:** acesso ao GitHub Pages do PRF, link Notion preservado e metadados técnicos do repositório correto.  
**Data:** 2026-09-28.

## Resultado local

- O cartão principal abre o site do PRF e mantém um link separado ao Notion.
- O registry associa o repositório próprio do PRF; não declara contrato operacional de status.
- O link de origem só aceita HTTPS em app.notion.com.
- Quality gate local e medição do app shell concluídos antes da abertura do PR.

## Integração e deploy

- Baseline: `a1e55795bff55814d2760af82dfe7e59d0387c71`.
- PR #6 integrado; commit publicado: `4a378f726d5ead66305cba2b63ec054f583d1bb3`.
- Quality gate e Deploy passaram no [workflow 36437885787](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36437885787).
- Artefato Pages `10976357365`, 145.103 bytes, digest `sha256:aa8e237d8364405e14b0eb1730d9228d913b05b328992f6c34af2cefe6d351e9`.
- App shell: 147.300/147.456 bytes brutos; gzip: 47.887/49.152 bytes.

## QA publicado

- Em 1363×936, Central v27.4.0 abriu sem overflow horizontal.
- Cartão PRF exibiu estado acessível, deploy publicado, atualização do repositório e os destinos do Pages e do Notion.
- Testes automatizados responsivos passaram. A inspeção manual nesta sessão foi feita apenas no viewport desktop; viewport móvel permanece sem verificação visual manual.

