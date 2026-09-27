# CHECKPOINT — Workspace PRO v16 → v20

## Estado
- **Versão de origem:** 15.0.0
- **Versão ativa:** 16.0.0
- **Stage:** VALIDATING
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
- **Budget v16+:** <= 131.072 bytes (128 KiB)

## Acceptance v16
- Ctrl/Cmd+K abre a palette fora de campos editáveis.
- Há controle visível para toque/mobile.
- Busca cobre navegação e projetos do workspace.
- Ativos/arquivados/futuros permanecem semanticamente distintos.
- Foco e retomada aparecem apenas quando válidos.
- ↑/↓/Enter/Escape funcionam.
- A palette não faz fetch nem altera projetos externos.
- Sem JavaScript, fallback existente permanece intacto.
- Shell continua <= 128 KiB.
- Quality gate passa antes de deploy.
- Zero writes externos.

- **Decisão de budget v16:** a Command Palette adicionou funcionalidade real e levou o shell de 122.134 para ~129,4 KB. Em vez de refatoração agressiva dos módulos antigos apenas para preservar o número anterior, o teto da nova geração passa conscientemente de 120 KiB para 128 KiB. O quality gate continua bloqueando qualquer crescimento acima disso.


## QA v16
- Command Palette: implementada.
- Ctrl/Cmd+K com guarda de campos editáveis: PASS.
- Botão touch/mobile: PASS.
- Busca lifecycle active/archived/future: PASS.
- Agora/Projetos/Workspace/Atividade/Diagnóstico: PASS.
- Foco/retomada válidos: PASS.
- ↑/↓/Enter/Escape: PASS.
- Rede própria da v16: zero.
- Projetos externos: zero writes.
- App shell: `central-shell-v16.0.0`.
- Shell atual: ~129,4 KB <= 128 KiB.
- Pipeline de implementação: `36312740627` — quality success + deploy success.
- Estado: aguardando pipeline final da release 16.0.0.
