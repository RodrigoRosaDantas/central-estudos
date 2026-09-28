# Registro de riscos — Central v27.6.0

| Risco | Mitigação | Estado |
|---|---|---|
| Registro ser confundido com domínio/progresso | Rotular os números como tempo informado e exigir confirmação de estudo | Coberto por interface e testes |
| Duração ou data inválida | Exigir data, projeto, trilha e checkbox; validar minutos e limite de 24 h | Coberto e testado |
| Dados locais serem apagados ou não chegarem a outro aparelho | Avisar sobre armazenamento local e oferecer exportação/restauração de backup JSON | Coberto; depende de backup manual |
| Backup malformado ou duplicado | Validar formato, tamanho, projeto, data, duração e confirmação; ignorar IDs repetidos | Coberto e testado |
| Registro exceder limite autorizado do app shell | Manter módulo local em cache e excluir apenas visões conectadas/avançadas do pré-cache; Quality gate mede bytes bruto e gzip | 146.207/147.456 bytes bruto; 46.623/49.152 bytes gzip |
| Grade sofrer alteração incidental | Testes mantêm dias, sessões, foco, P1–P4 e ciclo PRF | Coberto e testado |
| Registro ser enviado a Notion ou projeto-filho | Sem API/backend; nenhuma requisição de rede no módulo de registro | Coberto e testado |
