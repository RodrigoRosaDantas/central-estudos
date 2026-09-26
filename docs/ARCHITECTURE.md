# Arquitetura — Central de Estudos

## Responsabilidade

A Central é uma camada de **navegação e observabilidade leve**.

> A Central observa e direciona. Os projetos executam e decidem.

Ela pode:

- listar ambientes;
- destacar o foco;
- recordar o último ambiente aberto;
- testar disponibilidade sem bloquear a navegação;
- direcionar para o site real.

Ela não pode:

- editar dados internos dos projetos;
- alterar Supabase dos projetos;
- importar componentes dos dashboards;
- assumir regras pedagógicas;
- tornar-se banco mestre;
- criar dependência obrigatória entre ambientes.

## Contrato V1

A fonte dinâmica de verdade é `config/projects.json`.

```json
{
  "schemaVersion": 1,
  "projects": []
}
```

Campos de projeto:

- `id`
- `name`
- `description`
- `phase`
- `status`
- `priority`
- `icon`
- `url`
- `repository`

## Fallback de segurança

O `index.html` contém uma cópia mínima dos três acessos diretos. Essa duplicação é **intencional e restrita ao fallback**.

Motivo: se JavaScript ou `projects.json` falharem, TCE-GO, SEEDF e TJDFT continuam acessíveis. Quando a configuração carrega normalmente, o JavaScript substitui os cards estáticos pelo registry dinâmico.

Nenhuma inteligência da Central pode ser requisito para abrir um projeto.

## Estado local

A Central guarda apenas no navegador:

- último projeto aberto;
- data/hora desse acesso.

Nenhum dado acadêmico ou de desempenho é gravado pela Central.

## Health check

A disponibilidade é informativa:

- `online`: resposta HTTP válida;
- `offline`: resposta HTTP recebida com erro;
- `unknown`: não foi possível verificar.

Um health check inconclusivo **nunca bloqueia o botão de acesso**.

## Evolução futura

Integrações de métricas deverão ser:

- somente leitura;
- opcionais;
- versionadas;
- desacopladas do schema interno dos projetos.

Exemplo:

```json
{
  "schemaVersion": 1,
  "project": "SEEDF",
  "lastActivity": "2026-09-26",
  "nextAction": "L03"
}
```

A Central não deve conhecer tabelas ou modelos internos dos projetos-filhos.


## Separação semântica — v1.2

A Central distingue duas ideias que não devem ser confundidas:

- **foco**: prioridade configurada no registry;
- **retomada**: último ambiente efetivamente aberto pelo usuário.

O último acesso nunca altera automaticamente a prioridade do projeto.


## Observabilidade somente leitura — v1.3

A Central pode consultar metadados públicos do GitHub para indicar a **última publicação técnica** de cada projeto.

Essa informação:

- vem do campo público `pushed_at` do repositório;
- não representa estudo realizado, progresso ou desempenho;
- é cacheada localmente por 10 minutos para reduzir chamadas;
- é opcional e nunca bloqueia a navegação;
- não exige token, secret, Supabase ou alteração nos projetos-filhos.

O pulso global usa somente:
- quantidade de ambientes cadastrados;
- disponibilidade dos sites;
- publicação técnica mais recente conhecida.
