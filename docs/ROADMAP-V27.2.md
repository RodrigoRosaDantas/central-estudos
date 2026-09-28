# Roadmap v27.2 — frases do Major Cadar

**Release:** 27.2.0  
**Stage:** PUBLISHED — v27.2.1; QA desktop concluído e a inspeção visual corrigiu o selo antigo do painel Hoje. QA móvel continua indisponível nesta sessão.  
**Baseline:** `main` em `1e1a04b64d0c47d1c3e8f546f54aa99a97b4df32`.  
**Feature commit:** `36642236d7f1f74135d2df2680de2e9011b58756` — Quality gate + Pages Deploy workflow `36369665244`.  
**Patch:** v27.2.1 — commit `ce5288686fc8d8d60e504455721653ef5cb6a260`; Quality gate + Pages Deploy workflow `36369866365` — SUCCESS; artifact `10948796852` (`sha256:c7acdea6599e50d905f3d735c3e9da7a9d3222a4f4d2589d6fbc16e2532debf3`).

## Objetivo

Dar à frase diária uma voz consistente com o foco do usuário em estudo e disciplina, com frases atribuídas ao Major Cadar e proveniência visível.

## Escopo

1. Usar seis citações curtas em português, sem tradução livre, com autoria de Major Cadar.
2. Rotacionar pela data de `America/Sao_Paulo`, sem variar ao recarregar a página no mesmo dia.
3. Mostrar na interface um rótulo temático, a autoria e um link individual para cada origem.
4. Preservar texto, autoria e fonte estáticos no fallback sem JavaScript.
5. Manter o relógio, a saudação, a segurança de links e o modo PWA; não adicionar requisições de rede.
6. Atualizar versões do runtime, registry e cache do app shell para 27.2.0; o patch publicado fica em 27.2.1.

## Proveniência

As origens selecionadas são o perfil `@caveiracadar09`, a página do Método Cão Pastor e o vídeo sobre dopamina e disciplina. Os trechos são curtos e o texto exibido aponta diretamente para uma dessas origens.

## Limites

- Alterar somente `RodrigoRosaDantas/central-estudos`.
- Não editar Notion, Plataforma de Questões, projetos-filhos ou Work Sites.
- Não carregar imagens, embeds, analytics ou outra dependência externa.
- Preservar fallback/no-JS, foco separado da retomada, ordem das prioridades e independência dos ambientes.

## Quality gate

`node tests/quality.mjs` valida as seis variações diárias, atribuição, fontes autorizadas, fallback, URLs versionadas, cache e regressões históricas. O app shell fica limitado a 144 KiB bruto e 48 KiB na soma gzip, teto pós-v20 autorizado formalmente em 28/09/2026 e registrado em `docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md`.
