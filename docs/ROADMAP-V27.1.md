# Roadmap v27.1 — PRF no catálogo e ferramenta de questões

**Release:** 27.1.1  
**Stage:** Implementado localmente; deploy e QA publicados pendentes.  
**Baseline:** `main` em `8aa749cb8ae40b23908ad392ac63b9c4e480bfe1`.

## Objetivo

Tratar PRF Administrativo como projeto próprio na Central e dar acesso à Plataforma de Questões como ferramenta de estudo compartilhada. Manter o plano PRF no Notion como fonte de execução, e preservar a hierarquia atual das prioridades.

## Escopo

1. Registrar PRF Administrativo como projeto ativo com URL oficial `app.notion.com`, sem atribuir repositório ou telemetria GitHub.
2. Permitir foco local no PRF e deixar explícito que a Central não lê o conteúdo nem mede execução no Notion.
3. Manter SEEDF (P1), TJDFT (P2) e TCE-GO (P3) na ordem atual; o PRF segue como trilha complementar na agenda, sem prioridade 4.
4. Exibir a Plataforma de Questões em uma área própria, visualmente consistente com os cards, mas fora da registry, contagem de projetos, busca de concursos e indicadores técnicos.
5. Preservar acesso estático sem JavaScript e projetos-filhos somente leitura.
6. Corrigir o gate de payload para incluir todos os recursos declarados em `APP_SHELL`, incluindo 404, ícone, registry e CSS de versões anteriores ainda instaladas.

## Limites

- Alterar somente `RodrigoRosaDantas/central-estudos`.
- Não editar página Notion, site de questões, projetos-filhos ou Work Sites.
- Nenhuma escrita, chamada de saúde, telemetria, progresso ou status inventado para o PRF.
- O foco padrão da Central permanece TCE-GO.

## Verificação

- `node tests/quality.mjs` cobre registry, destinos HTTPS, domínio Notion permitido, foco, ausência de telemetria, separação projeto/ferramenta, fallback, PWA e regressões históricas.
- Limites do shell: 144 KiB bruto e 48 KiB como soma dos assets individualmente gzipados.
- Deploy e inspeção publicados serão registrados em `docs/FINAL-AUDIT-V27.1.1.md`.
