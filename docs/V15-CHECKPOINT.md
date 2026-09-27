# CHECKPOINT — Nova geração v11 → v15

## Estado
- **Versão de origem:** 10.0.0
- **Versão ativa:** 11.0.0
- **Stage:** VALIDATING
- **Próxima versão após fechamento:** 12.0.0
- **Projetos-filhos:** READ-ONLY / NO WRITES
- **Automação:** nenhuma

## Baseline
- Central HEAD inicial: `fe643fb4d56f8dcba823f340ce4e9f5fbe0fe579`
- Último Pages inicial: `36283766228` — success
- TCE-GO: `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`
- SEEDF: `bb006c3bc896534716e6b568849669a7fe4424c8`
- TJDFT: `8aa366c0068f6f705fb2d27a44b7a522f90003d9`

## Acceptance v11
- Visão Agora prioriza ação e não métricas.
- Foco, retomada e catálogo continuam semanticamente separados.
- Navegação interna funciona por âncoras e teclado.
- Dados técnicos permanecem secundários.
- Nenhuma próxima ação pedagógica é inventada.
- Links diretos dos três projetos permanecem no HTML.
- Sem JavaScript, os três projetos continuam acessíveis.
- Mobile mantém alvos de toque e largura segura.
- Quality gate passa antes de deploy.
- Zero writes nos projetos-filhos.


## QA v11
- Visão Agora: implementada.
- Navegação interna: implementada.
- Eventos locais: implementados.
- Rede adicional da camada v11: zero.
- Fallback/no-JS: preservado.
- App shell: `central-shell-v11.0.0`.
- Quality gate de implementação: PASS — run `36284354940`.
- Deploy de implementação: PASS — run `36284354940`.
- Estado: aguardando pipeline final já com versão/documentação 11.0.0.
