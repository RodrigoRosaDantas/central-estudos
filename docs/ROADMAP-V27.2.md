# Roadmap v27.2 — frases do Major Cadar

**Release:** 27.2.0  
**Stage:** READY FOR QUALITY GATE — publicação aguardando validação automatizada e QA pós-deploy.  
**Baseline:** `main` em `1e1a04b64d0c47d1c3e8f546f54aa99a97b4df32`.

## Objetivo

Dar à frase diária uma voz consistente com o foco do usuário em estudo e disciplina, com frases atribuídas ao Major Cadar e proveniência visível.

## Escopo

1. Usar seis citações curtas em português, sem tradução livre, com autoria de Major Cadar.
2. Rotacionar pela data de `America/Sao_Paulo`, sem variar ao recarregar a página no mesmo dia.
3. Mostrar na interface um rótulo temático, a autoria e um link individual para cada origem.
4. Preservar texto, autoria e fonte estáticos no fallback sem JavaScript.
5. Manter o relógio, a saudação, a segurança de links e o modo PWA; não adicionar requisições de rede.
6. Atualizar versões do runtime, registry e cache do app shell para 27.2.0.

## Proveniência

As origens selecionadas são o perfil `@caveiracadar09`, a página do Método Cão Pastor e o vídeo sobre dopamina e disciplina. Os trechos são curtos e o texto exibido aponta diretamente para uma dessas origens.

## Limites

- Alterar somente `RodrigoRosaDantas/central-estudos`.
- Não editar Notion, Plataforma de Questões, projetos-filhos ou Work Sites.
- Não carregar imagens, embeds, analytics ou outra dependência externa.
- Preservar fallback/no-JS, foco separado da retomada, ordem das prioridades e independência dos ambientes.

## Quality gate

`node tests/quality.mjs` valida as seis variações diárias, atribuição, fontes autorizadas, fallback, URLs versionadas, cache e regressões históricas. O app shell continua limitado a 144 KiB bruto e 48 KiB na soma gzip.
