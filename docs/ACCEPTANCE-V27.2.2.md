# Aceitação v27.2.2 — frases rotativas

- [x] As seis frases do Major Cadar alternam automaticamente em janelas de cinco minutos, sem recarregar a página.
- [x] Cada frase mantém sua atribuição e link de fonte correspondente.
- [x] Atualização de conteúdo marcada como educada para tecnologias assistivas (`aria-live="polite"`).
- [x] Fallback sem JavaScript continua coerente e sem requisições externas.
- [x] Header, selo Hoje, registry, runtime e cache PWA usam v27.2.2.
- [x] `node tests/quality.mjs` passa localmente, incluindo troca no limite de cinco minutos, seis fontes exatas e atualização acessível.
- [x] Quality gate e Pages Deploy remotos passaram no commit `376fdcdcbfded4618f39d54723b981bad5223357` (PR #1; workflow #366).
- [ ] QA visual móvel: ainda pendente de viewport móvel nesta sessão.
