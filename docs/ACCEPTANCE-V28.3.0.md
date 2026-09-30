# Aceitação v28.3.0 — registro automático de 1h

- [x] Registra 60 minutos somente quando contrato sincronizado apresenta `study.evidence=confirmed`, `lastCompletedUnit` e `lastStudiedAt` igual ao dia atual de Brasília.
- [x] Ignora fonte sem data real, data passada/futura, unidade vazia, evidência parcial e estado planejado.
- [x] Usa ID determinístico e deduplica eventos repetidos, unidades já lançadas manualmente e reconsultas da mesma conclusão.
- [x] Atualiza contratos ao retornar à Central em primeiro plano, sem polling ou novas chamadas diretas na camada de registro.
- [x] Aciona a sincronização Supabase já existente sem alterações de schema, RLS ou credenciais.
- [x] PRF permanece sem lançamento automático enquanto seu contrato não publicar `lastStudiedAt`; a produção dos 33 materiais não conta como conclusão de estudo.
- [ ] Quality gate, publicação e inspeção do comportamento no site concluídos.
