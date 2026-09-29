# Critérios de aceitação v28.0.0 — Mentor dedicado

## Estrutura
- [x] Mentor existe em `/mentor/` como página filha própria.
- [x] Home não contém o antigo painel completo `routing-panel`.
- [x] Navegação principal e Ctrl/⌘+K abrem o Mentor dedicado.
- [x] Evolução mantém Radar e Estado técnico.

## Inteligência
- [x] Mentor lê grade, tempo confirmado e contratos dos projetos.
- [x] SEEDF, TJDFT e PRF entram por contratos read-only.
- [x] TCE-GO privado entra somente com sessão Supabase válida e RLS.
- [x] Recomendação explica os sinais utilizados.
- [x] Campo ausente continua desconhecido, nunca zero.
- [x] Foco escolhido pelo usuário não é alterado automaticamente.

## UX
- [x] Áreas Agora, Projetos, Revisões & riscos e Como decide existem.
- [x] Layout é responsivo e touch-friendly.
- [x] Página mostra confiança, fontes e frescor.
- [x] Home permanece mais limpa e sem duplicação do Mentor.

## PWA, segurança e custo
- [x] `/mentor/`, CSS, JS e cronograma entram no app shell.
- [x] Navegação offline para `/mentor/` usa fallback próprio.
- [x] App shell permanece dentro de 256 KiB bruto / 80 KiB gzip.
- [x] Nenhuma OpenAI API ou segredo de servidor é incluído.
- [x] Quality gate passa antes do deploy.
