# Roadmap v27.4.0 — acesso ao site PRF no GitHub

**Release:** 27.4.0  
**Stage:** PUBLISHED  
**Escopo:** atualizar o cartão do PRF para o GitHub Pages, preservar acesso direto ao Notion e associar o repositório correto à observabilidade técnica da Central.

## Objetivos

1. Abrir https://rodrigorosadantas.github.io/prf-administrativo-dashboard/ pelo cartão do PRF.
2. Manter https://app.notion.com/p/3e8cf5a2673181679cd2f5532e0abf60 como link independente para a fonte de verdade.
3. Usar somente RodrigoRosaDantas/prf-administrativo-dashboard para frescor e deploy.
4. Não adicionar status operacional, inferência de estudo ou prioridade numérica ao PRF.
5. Renovar o cache instalado da Central e manter o app shell dentro do limite aprovado.

## Verificação

- README do repositório confirma o endereço do painel e a função do Notion como fonte de verdade.
- O primeiro workflow Deploy PRF ADM to GitHub Pages terminou com sucesso.
- Baseline: `a1e55795bff55814d2760af82dfe7e59d0387c71`.
- PR #6 integrado no commit `4a378f726d5ead66305cba2b63ec054f583d1bb3`.
- Quality gate e deploy da Central passaram no workflow `36437885787`; QA público e payload estão registrados na auditoria final.
