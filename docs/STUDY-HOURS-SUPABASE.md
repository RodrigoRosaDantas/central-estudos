# Sincronização das horas estudadas via Supabase

Estado da Central em 29/09/2026. Este documento registra a integração opcional aprovada depois da arquitetura local-only das releases v27.6/v27.7. Os registros continuam funcionando sem login e sem conexão.

## Escopo e origem dos dados

- A grade semanal e os catálogos continuam mantidos pela Central; esta integração não altera o cronograma.
- O bloco de estudo é criado primeiro no armazenamento local do navegador (`central-estudos:study-log-v1`). O backup JSON permanece disponível.
- Ao conectar uma conta Supabase já cadastrada, a Central sincroniza esses blocos entre aparelhos autenticados na mesma conta.
- O projeto e a execução pedagógica continuam nos respectivos projetos e no Notion. A Central não envia registros ao Notion nem atualiza os projetos-filhos.
- A tabela da Central é `public.central_study_logs`, no projeto Supabase compartilhado `rodrigo…'s Project` (ref `fqqkkyusnzhuuizahkww`). Ela não usa as tabelas de progresso do TCE.

## Modelo e limites do banco

Cada linha representa um bloco confirmado pelo usuário. A tabela contém:

- `id` UUID interno; `client_id` idempotente gerado pelo navegador;
- `study_date`, `project_id`, `trail`, `topic` opcional e `duration_minutes`;
- `created_at` e `user_id`, com chave estrangeira para `auth.users(id)` e exclusão em cascata ao apagar a conta.

Restrições verificadas: projetos permitidos `seedf`, `tjdft`, `tcego` e `prf-adm`; matéria de 1–100 caracteres; tópico até 140; duração entre 1 e 1.440 minutos; unicidade de `(user_id, client_id)`. Índices de consulta cobrem usuário/data e usuário/projeto/data. O cliente sincroniza no máximo 5.000 linhas por ciclo.

## Autenticação e controle de acesso

O formulário envia link mágico para e-mail já cadastrado, com `create_user:false`; ele não cria conta. O navegador usa somente a chave pública `sb_publishable` e o JWT do usuário. Não há chave `service_role` ou `sb_secret` no site.

RLS está habilitado em `central_study_logs`. Usuários autenticados só podem selecionar, inserir e excluir suas próprias linhas (`auth.uid() = user_id`); não há permissão de atualização. O papel `anon` não tem acesso à tabela. A aplicação também impede misturar duas contas no armazenamento local do mesmo navegador.

O botão “Desconectar deste aparelho” usa `scope=local`: encerra a sessão atual sem invalidar as sessões de outros aparelhos. Esse comportamento corrige um erro encontrado nesta auditoria. Consulte [a documentação de escopos do logout do Supabase](https://supabase.com/docs/guides/auth/signout).

## Histórico de migrações e manutenção

As migrações aplicadas no projeto compartilhado são:

- `20260929005524 create_central_study_logs`
- `20260929005834 detach_central_study_logs_from_tce_profiles`

O repositório da Central não contém uma cópia isolada das migrações do projeto: o histórico remoto também administra tabelas e serviços do TCE e de outros projetos. Não faça `db reset`, replay parcial ou alterações em tabelas `tce_*` a partir da Central. Para futuras alterações, confira primeiro o estado remoto e preserve a separação por tabela e por usuário.

## Auditoria em 29/09/2026

- A tabela estava com 0 linhas; nenhuma hora de estudo foi alterada nesta auditoria.
- RLS, políticas, grants, restrições e chave estrangeira foram conferidos no banco.
- Os alertas de índices ainda não usados para a tabela nova são esperados enquanto não há registros.
- Os avisos de segurança restantes do projeto Supabase são de configuração compartilhada ou de tabelas TCE não relacionadas à Central; não foram alterados nesta correção.
- Nenhuma conta foi criada e nenhum e-mail de autenticação foi enviado durante a auditoria.
