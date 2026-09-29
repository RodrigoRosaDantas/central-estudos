# Critérios de aceitação v27.9.0 — Sinais reais dos projetos

## Projetos
- [ ] PRF Administrativo publica `central-status.json` gerado pelo sync do Notion.
- [ ] SEEDF publica sinais de Leis Primeiro no contrato após cada sync.
- [ ] TJDFT publica sinais do Study OS no contrato após cada sync.
- [ ] TCE-GO mantém progresso privado fora do contrato público.

## Central
- [ ] Registry do PRF contém `statusUrl` próprio.
- [ ] Contrato aceita `study` opcional sem quebrar contratos v1 anteriores.
- [ ] Mentor combina grade, tempo local/sincronizado e sinais publicados.
- [ ] Campo ausente permanece desconhecido e não vira zero.
- [ ] Foco escolhido pelo usuário nunca é alterado automaticamente.

## Segurança e custo
- [ ] Central não consulta Notion diretamente.
- [ ] Nenhum token Notion/OpenAI aparece no frontend.
- [ ] TCE privado é lido somente autenticado, sob RLS do próprio usuário.
- [ ] Nenhuma OpenAI API é adicionada; custo por tokens permanece R$ 0.
- [ ] Quality gate e orçamento do app shell permanecem aprovados.
