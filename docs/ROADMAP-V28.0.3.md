# Roadmap v28.0.3 — panorama do Mentor P1–P4

**Stage:** READY_FOR_RELEASE
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
3. Conferência da página publicada em desktop e celular, incluindo navegação por teclado.

