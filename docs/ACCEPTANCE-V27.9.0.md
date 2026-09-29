# Critérios de aceitação v27.9.0 — Sinais reais dos projetos

## Projetos
- [x] PRF Administrativo publica `central-status.json` gerado pelo sync do Notion.
- [x] SEEDF publica sinais de Leis Primeiro no contrato após cada sync.
- [x] TJDFT publica sinais do Study OS no contrato após cada sync.
- [x] TCE-GO mantém progresso privado fora do contrato público.

## Central
- [x] Registry do PRF contém `statusUrl` próprio.
- [x] Contrato aceita `study` opcional sem quebrar contratos v1 anteriores.
- [x] Mentor combina grade, tempo local/sincronizado e sinais publicados.
- [x] Campo ausente permanece desconhecido e não vira zero.
- [x] Foco escolhido pelo usuário nunca é alterado automaticamente.

## Segurança e custo
- [x] Central não consulta Notion diretamente.
- [x] Nenhum token Notion/OpenAI aparece no frontend.
- [x] TCE privado é lido somente autenticado, sob RLS do próprio usuário.
- [x] Nenhuma OpenAI API é adicionada; custo por tokens permanece R$ 0.
- [x] Quality gate e orçamento do app shell permanecem aprovados.
