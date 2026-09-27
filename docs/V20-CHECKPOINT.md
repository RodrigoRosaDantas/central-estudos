# CHECKPOINT — Workspace PRO v16 → v20

## Estado
- **Versão de origem:** 15.0.0
- **Versão ativa:** 16.0.0
- **Stage:** IN_PROGRESS
- **Next major:** 17.0.0
- **Projetos externos:** READ-ONLY
- **Automação:** nenhuma

## Baseline v16
- **Central HEAD inicial:** `d2854585560b58a86a13ae9d16c4061dd85436d9`
- **Último pipeline inicial:** `36295240838` — success
- **TCE-GO:** `889017ba83143be268a84358229882a2b3ef9289`
- **SEEDF:** `b68431e2aa4944199705400c8821bf28505299d1`
- **TJDFT:** `99877771dcd008594d6855c08f077e1563e609bd`
- **SEDES/DF histórico:** `2250808a4d02b825c21c9382bf3ffb83150ce982` — mudança externa posterior ao fechamento v15
- **Shell v15:** 122.134 bytes
- **Budget:** <= 122.880 bytes (120 KiB)

## Acceptance v16
- Ctrl/Cmd+K abre a palette fora de campos editáveis.
- Há controle visível para toque/mobile.
- Busca cobre navegação e projetos do workspace.
- Ativos/arquivados/futuros permanecem semanticamente distintos.
- Foco e retomada aparecem apenas quando válidos.
- ↑/↓/Enter/Escape funcionam.
- A palette não faz fetch nem altera projetos externos.
- Sem JavaScript, fallback existente permanece intacto.
- Shell continua <= 120 KiB.
- Quality gate passa antes de deploy.
- Zero writes externos.
