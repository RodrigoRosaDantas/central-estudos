# Critérios de aceitação v28.0.0 — Mentor dedicado

## Estrutura
- [ ] Mentor existe em `/mentor/` como página filha própria.
- [ ] Home não contém o antigo painel completo `routing-panel`.
- [ ] Navegação principal e Ctrl/⌘+K abrem o Mentor dedicado.
- [ ] Evolução mantém Radar e Estado técnico.

## Inteligência
- [ ] Mentor lê grade, tempo confirmado e contratos dos projetos.
- [ ] SEEDF, TJDFT e PRF entram por contratos read-only.
- [ ] TCE-GO privado entra somente com sessão Supabase válida e RLS.
- [ ] Recomendação explica os sinais utilizados.
- [ ] Campo ausente continua desconhecido, nunca zero.
- [ ] Foco escolhido pelo usuário não é alterado automaticamente.

## UX
- [ ] Áreas Agora, Projetos, Revisões & riscos e Como decide existem.
- [ ] Layout é responsivo e touch-friendly.
- [ ] Página mostra confiança, fontes e frescor.
- [ ] Home permanece mais limpa e sem duplicação do Mentor.

## PWA, segurança e custo
- [ ] `/mentor/`, CSS, JS e cronograma entram no app shell.
- [ ] Navegação offline para `/mentor/` usa fallback próprio.
- [ ] App shell permanece dentro de 256 KiB bruto / 80 KiB gzip.
- [ ] Nenhuma OpenAI API ou segredo de servidor é incluído.
- [ ] Quality gate passa antes do deploy.
