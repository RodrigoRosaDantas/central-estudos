# Central de Estudos

Camada de entrada para os ambientes independentes de estudo:

- TCE-GO
- SEEDF
- TJDFT

## Princípio arquitetural

> A Central observa e direciona. Os projetos executam e decidem.

A Central **não importa, altera ou replica** o código dos projetos-filhos.

## V1

- interface mobile-first;
- registro único de projetos em `config/projects.json`;
- projeto em foco;
- botão “Continuar estudo”;
- histórico local do último ambiente aberto;
- health check simples dos ambientes;
- fallback: os links dos projetos continuam sendo a função principal;
- zero dependências e zero etapa de build.

## Publicação

Projetado para GitHub Pages como site estático.

Repositório: `RodrigoRosaDantas/central-estudos`.

## Adicionar um novo projeto

Edite apenas `config/projects.json` e acrescente outro objeto em `projects`.

Não duplique URLs ou metadados no HTML/JS.
