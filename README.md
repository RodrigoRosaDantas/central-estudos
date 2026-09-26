# Central de Estudos

Camada de entrada para os ambientes independentes de estudo:

- TCE-GO
- SEEDF
- TJDFT

## Princípio arquitetural

> A Central observa e direciona. Os projetos executam e decidem.

A Central **não importa, altera ou replica** o código dos projetos-filhos.

## Estado atual — v1.1

- interface mobile-first;
- registro único de projetos em `config/projects.json`;
- projeto em foco;
- botão **Continuar estudo**;
- histórico local do último ambiente aberto e horário de acesso;
- health check informativo, com timeout e estado inconclusivo;
- fallback estático: os três projetos continuam acessíveis mesmo se JavaScript ou o registry falharem;
- identidade visual sutil por ambiente;
- acessibilidade de teclado e preferência por movimento reduzido;
- manifest + ícone para uso como atalho/app no celular;
- zero framework, zero dependências e zero etapa de build.

## Publicação

GitHub Pages, diretamente da branch `main`.

## Regra de segurança

A Central nunca deve ser requisito para os projetos funcionarem.

TCE-GO, SEEDF e TJDFT permanecem aplicações autônomas e devem continuar acessíveis pelas URLs próprias.

## Adicionar um novo projeto

A fonte dinâmica de verdade é `config/projects.json`.

O `index.html` contém apenas uma cópia mínima dos links para fallback de segurança. Ao adicionar um novo projeto, mantenha o fallback coerente.

Consulte `docs/ARCHITECTURE.md` antes de introduzir integrações.
