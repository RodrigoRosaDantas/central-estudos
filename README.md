# Central de Estudos

Camada de entrada para os ambientes independentes de estudo:

- TCE-GO
- SEEDF
- TJDFT

## Princípio arquitetural

> A Central observa e direciona. Os projetos executam e decidem.

A Central **não importa, altera ou replica** o código dos projetos-filhos.

## Estado atual — v1.3

- interface mobile-first;
- foco atual separado de último acesso;
- pulso global de disponibilidade dos ambientes;
- leitura pública da última publicação de cada repositório, com cache local de 10 minutos;
- retomada real do último ambiente aberto;
- saudação contextual pelo horário do aparelho;
- registro único de projetos em `config/projects.json`;
- histórico local com projeto + data/hora;
- health check informativo, com timeout e estado inconclusivo;
- fallback estático: os três projetos continuam acessíveis mesmo se JavaScript ou o registry falharem;
- identidade visual sutil por ambiente;
- acessibilidade de teclado e preferência por movimento reduzido;
- manifest + ícone para uso como atalho no celular;
- workflow explícito de GitHub Pages;
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


<!-- deploy-trigger: 2026-09-26 -->
