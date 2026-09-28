# Aceitação v27.1.1 — projetos e ferramenta de estudo

**Publicação:** [workflow 36368493310 — SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36368493310) · commit `864fb0410a845cacef53794a7061d2c6c7dd6182`.

- [x] PRF Administrativo consta como projeto ativo com destino Notion oficial.
- [x] PRF não recebe prioridade numérica; foco padrão, prioridades SEEDF/TJDFT/TCE-GO e agenda continuam corretos.
- [x] A validação exige `app.notion.com` para URL de projeto Notion e rejeita domínios semelhantes ou externos.
- [x] PRF não envia requisições de health/repositório nem recebe status ou progresso inventado.
- [x] Usuário pode escolher PRF como foco local sem alterar o último acesso.
- [x] Plataforma de Questões possui card e link próprios fora da registry e dos indicadores de projetos/concurso.
- [x] HTML estático preserva links diretos dos quatro projetos e da ferramenta sem JavaScript.
- [x] Os rótulos de catálogo e Workspace dizem projetos onde o catálogo inclui o PRF.
- [x] CTA do PRF cabe em uma linha ao lado do botão de foco; cache PWA/runtime/registry renovados para v27.1.1.
- [x] Quality gate local passa, incluindo sintaxe, regressões, segurança, acessibilidade e orçamento completo do PWA.
- [x] GitHub Actions Quality gate e Pages Deploy confirmam a publicação da release.
- [x] Artigo publicado mostra versão V27.1.1, quatro projetos e card da Plataforma de Questões fora da contagem.
- [x] QA publicado confirma destinos, PRF no Notion, ferramenta separada, CTA em uma linha e ausência de overflow em viewport 1363×936 (documento: 1348 px).
- [x] App shell dentro do teto pós-v20 autorizado em 28/09/2026: 144.642/147.456 bytes brutos e 46.807/49.152 bytes gzipados; decisão em `docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md`.
- [ ] Inspeção visual móvel: não há viewport móvel/emulação disponível; contratos CSS e layout responsivo passam no Quality gate.
