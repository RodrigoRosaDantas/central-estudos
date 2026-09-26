# Arquitetura — Central de Estudos

## Responsabilidade
A Central é uma camada de **navegação e observabilidade leve**.

> A Central observa e direciona. Os projetos executam e decidem.

Ela pode listar ambientes, destacar o foco, recordar o último ambiente aberto, testar disponibilidade sem bloquear a navegação e direcionar para o site real. Ela não edita dados internos, não altera Supabase, não importa dashboards, não assume regras pedagógicas e não cria dependência obrigatória entre ambientes.

## Registry
A fonte dinâmica de verdade é `config/projects.json` (`schemaVersion: 1`). Campos de projeto: `id`, `name`, `description`, `phase`, `status`, `priority`, `icon`, `url`, `repository`.

## Fallback de segurança
`index.html` contém uma cópia mínima dos três acessos diretos. Essa duplicação é intencional e restrita ao fallback. Se JavaScript ou registry falharem, TCE-GO, SEEDF e TJDFT continuam acessíveis. Nenhuma inteligência da Central pode ser requisito para abrir um projeto.

## Estado local e separação semântica
A Central usa armazenamento local apenas para preferências e continuidade da própria Central. **Foco**, **retomada/último acesso**, **favorito** e **recência técnica** são conceitos independentes. Nenhum deles deve alterar automaticamente outro. Nenhum dado acadêmico ou de desempenho é gravado.

Todo acesso a `localStorage` deve degradar com segurança. Conteúdo inválido/corrompido é ignorado e defaults previsíveis são usados.

## Progressive enhancement
O HTML mantém os três acessos essenciais como baseline. JavaScript melhora foco, retomada, catálogo e observabilidade, mas não é requisito para abrir os projetos.

## Observabilidade — v3
A observabilidade confiável está especificada em `docs/OBSERVABILITY-V3.md`: somente leitura, não bloqueante e separada de estudo. Disponibilidade, publicação técnica e deploy são dados distintos. Falha de rede é inconclusiva; metadados públicos podem usar cache e stale explícito; rate limit não bloqueia navegação.

## Catálogo operacional — v4
O catálogo adiciona uma camada opcional de organização sobre o registry:

- busca textual local por conteúdo visível do card;
- ordenação local por ordem padrão, favoritos ou nome;
- favoritos persistidos apenas no navegador;
- atalhos `Alt+1..9` somente fora de campos editáveis e aplicados aos cards visíveis;
- controles touch-friendly e progressivos;
- ação principal continua sendo **Abrir ambiente**.

As preferências do catálogo não alteram `projects.json`, foco, último acesso, dados técnicos ou projetos-filhos. `js/catalog-v4.js` é uma extensão progressiva da shell e deve tolerar indisponibilidade de `localStorage`.

## Evolução
Integrações futuras devem ser somente leitura, opcionais, versionadas e desacopladas do schema interno dos projetos-filhos. A Central não deve conhecer tabelas ou modelos internos dos projetos.
