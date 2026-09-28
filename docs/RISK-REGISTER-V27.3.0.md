# Riscos v27.3.0

| Risco | Mitigação | Estado |
|---|---|---|
| Cache pode parecer dado atual | Mostrar estado cached/stale e só atualizar snapshot com contrato `live` | Coberto por teste |
| Primeira visita não tem base anterior | Exibir aviso de primeira conferência e não inventar diferenças | Coberto por teste |
| Falha de `localStorage` | Capturar falha; a agenda e o resumo continuam sem bloquear navegação | Coberto por degradação segura |
| Dados locais podem desaparecer ao limpar dados do navegador | Explicar que a comparação é local; próxima consulta vira nova base | Documentado |
| Destaque do dia pode usar fuso incorreto | Fixar `America/Sao_Paulo` e testar a virada de meia-noite local | Coberto por teste |
| viewport móvel não está acessível nesta sessão | Manter inspeção visual manual como pendente; validar breakpoints estruturalmente | Pendente |
| Site próprio do PRF ainda não está disponível | Manter o Notion como destino; não criar URL/repositório fictício | Aguardando site confirmado |
| App shell está perto do limite aprovado | Medir recursos reais no quality gate; não elevar orçamento nesta release | Aguardando medição final |
