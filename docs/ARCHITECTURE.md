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

## Personalização local — v5
A v5 adiciona preferências de apresentação e organização sem backend.

Preferências suportadas:
- densidade confortável ou compacta;
- exibição ou ocultação dos detalhes técnicos nos cards;
- ordem manual dos ambientes;
- foco, favoritos e ordenação do catálogo já existentes.

Regras:
- todas as preferências ficam em `localStorage`;
- nenhuma preferência altera `projects.json`;
- nenhuma preferência escreve nos projetos-filhos;
- valores inválidos são ignorados/limpos e caem para defaults seguros;
- a ordem padrão é derivada do registry por `data-project-order`;
- mover um ambiente retorna o catálogo para `Ordem padrão`;
- o reset restaura foco, favoritos, ordem, densidade e apresentação;
- o reset preserva o histórico de último acesso;
- o painel de preferências permanece oculto quando JavaScript não está disponível.

A personalização é opcional e reversível. Falha de persistência não pode impedir navegação.

## PWA e resiliência — v6
A v6 adiciona um service worker estritamente limitado à origem da Central. O cache `central-shell-v6.0.0` contém somente o app shell da Central; URLs dos três projetos-filhos e chamadas externas de observabilidade nunca são interceptadas nem cacheadas pelo service worker.

Estratégia:
- navegações da Central usam **network first**, com `index.html` em cache apenas como fallback offline;
- arquivos conhecidos do app shell usam **network first**, atualizando o cache em respostas válidas e recorrendo ao cache somente em falha de rede;
- cada major PWA troca explicitamente o nome do cache; caches antigos com prefixo `central-shell-` são removidos na ativação;
- um worker novo permanece em espera quando já existe uma versão controlando a página; a interface oferece **Atualizar agora**, que envia `SKIP_WAITING` e recarrega uma única vez após `controllerchange`;
- não existe prompt próprio de instalação: instalar como app é escolha do navegador/usuário;
- falha no registro do service worker mantém a experiência web normal;
- remover/desregistrar o service worker e apagar caches não afeta os links diretos nem o funcionamento web da Central.

O app shell offline não afirma que TCE-GO, SEEDF ou TJDFT estão disponíveis offline. Observabilidade continua sendo informação de rede e deve degradar para estado inconclusivo/cache conforme suas próprias regras.

## Evolução
Integrações futuras devem ser somente leitura, opcionais, versionadas e desacopladas do schema interno dos projetos-filhos. A Central não deve conhecer tabelas ou modelos internos dos projetos.


## Qualidade e testes — v7

A v7 adiciona um gate automatizado antes do deploy. O contrato completo está em `docs/QUALITY-V7.md`.

O workflow possui:
- job `quality`;
- job `deploy` com dependência explícita `needs: quality`.

A suite é local, determinística e sem rede externa. Ela valida registry, fallback, referências, manifest, service worker, ausência de secrets óbvios e funções críticas do `app.js`.

Falha de teste impede o deploy do commit. Os testes nunca escrevem nos projetos-filhos.
