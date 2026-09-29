# Roadmap v28.0.3 — panorama do Mentor P1–P4

**Stage:** PUBLISHED
**Base:** `main` v28.0.2
**Escopo:** melhorar a página filha `/mentor/` para tornar mais clara e visual a leitura simultânea dos quatro projetos ativos.

## Entrega

- Painel compacto dos quatro projetos na aba “Agora”, em ordem SEEDF/P1, TJDFT/P2, TCE-GO/P3 e PRF Administrativo/P4.
- Situação da fonte, próxima etapa publicada, amostra de questões e precisão quando disponíveis.
- Tempo registrado na Central em sete dias aparece separado dos contratos dos projetos.
- Abas acessíveis por teclado, foco visual, mensagens de carregamento/falha e layout responsivo.
- Versões de cache atualizadas para v28.0.3; cronograma, foco padrão e contratos permanecem preservados.

## Fora do escopo

- Alterar dados, cronograma ou foco em qualquer projeto-filho.
- Escrever no Notion ou adicionar OpenAI API.
- Tratar ausência de contrato, sessão ou amostra como zero.

## Gates

1. `node tests/quality.mjs` e validações sintáticas/JSON locais.
2. Publicação pela branch protegida e Quality gate antes de Pages Deploy.
3. Conferência da página publicada em desktop e navegação por teclado; breakpoints responsivos cobertos pela quality gate. A inspeção visual em viewport móvel fica registrada como não executada nesta sessão.

## Publicação

- PR #26, squash merge `9f1bba387d5d2592d8e8650daa3a778759bc7fa0`.
- Workflow #435 / run `36612869668`: Quality gate e Deploy to GitHub Pages — `success`.
- Página conferida: `https://rodrigorosadantas.github.io/central-estudos/mentor/#agora`.
