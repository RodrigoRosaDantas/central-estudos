# Arquitetura — Central de Estudos

## Responsabilidade

A Central é uma camada de **navegação e observabilidade leve**.

Ela pode:

- listar ambientes;
- destacar o foco;
- recordar o último ambiente aberto;
- testar disponibilidade;
- direcionar para o site real.

Ela não pode:

- editar dados internos dos projetos;
- alterar Supabase dos projetos;
- importar componentes dos dashboards;
- assumir regras pedagógicas;
- tornar-se banco mestre;
- criar dependência obrigatória entre ambientes.

## Contrato V1

`config/projects.json`

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

## Regra de falha

Se qualquer inteligência adicional falhar, o acesso direto aos projetos deve permanecer disponível.

## Evolução futura

A integração de métricas, quando existir, deverá ser **somente leitura** e baseada em um contrato versionado de status por projeto.

Exemplo futuro:

```json
{
  "schemaVersion": 1,
  "project": "SEEDF",
  "lastActivity": "2026-09-26",
  "nextAction": "L03"
}
```

A Central não deve conhecer tabelas ou modelos internos dos projetos-filhos.
