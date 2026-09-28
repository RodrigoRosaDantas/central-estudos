# Roadmap v27.7.0 — registro guiado por dia e matéria

**Stage:** PUBLISHED — QA PASS  
**Escopo:** orientar o lançamento de horas pela grade semanal publicada, sem alterar a distribuição nem o conteúdo dos projetos.

## Entrega

- Seleção da semana e do dia, com o total local já registrado para cada data.
- Cartões de lançamento derivados dos cartões estáticos de `#agenda-semanal`.
- Catálogo selecionável para SEEDF, TJDFT, TCE-GO e PRF Administrativo.
- Duração em horas/minutos, assunto opcional e confirmação explícita de estudo real.
- Totais do dia e da semana selecionados, distribuição diária, resumo por projeto e histórico.
- Registro manual fora da grade para revisão eventual ou atividade não prevista.

## Regras preservadas

- Seg–sex: SEEDF + TJDFT; PRF às segundas, quartas e sextas; TCE-GO às terças e quintas.
- Sábado: revisão SEEDF/TJDFT + sessão TCE-GO. Domingo protegido, salvo D7/D20 realmente previstos no projeto.
- P1–P4, foco padrão TCE-GO, links e projetos-filhos sem alteração.
- Nenhuma seleção cria um bloco, marca matéria como concluída, muda a próxima unidade ou atualiza Notion.
- O formato e a chave `central-estudos:study-log-v1` permanecem compatíveis com registros e backups anteriores.

## Catálogo

Fotografia de 28/09/2026: leis/trilhas SEEDF, unidades P01–P18/RL01–RL13/REV01–REV06 do TJDFT, 36 matérias de estudo do TCE-GO e roda PRFADM01–PRFADM33. Ordem, liberação de materiais e progresso permanecem nos projetos de origem.

## Offline e limites

O registro manual segue no app shell autorizado. A camada guiada e o catálogo usam cache runtime same-origin para respeitar 144 KiB bruto/48 KiB gzip. Depois de um acesso online controlado pelo service worker, a camada guiada fica disponível offline. Se o primeiro acesso ocorrer sem essa camada em cache, o usuário ainda pode lançar tempo pelo formulário manual.

## Critério de saída

Quality gate local e remoto aprovados; Pages publicado pelo workflow #384. Navegador confirmou seleção de dia/matérias e domingo protegido sem salvar registros. Regras responsivas estreitas passaram na suíte; a conferência visual foi feita em viewport amplo.


## Publicação

- PR #16 integrado por squash em 28/09/2026.
- Commit de release: `bd0ac36beb9f53e899035d0e12e5e9a042f325b7`.
- GitHub Actions: workflow run #384 (ID `36500234949`), Quality gate e Deploy **success**.
- Artefato Pages: `github-pages`, ID `11005355766`, 181.469 bytes.
- App shell: 147.407/147.456 bytes bruto; 46.881/49.152 bytes gzip.
- QA ao vivo: segunda SEEDF/TJDFT/PRF; terça TCE-GO; domingo protegido. A seleção de matéria deixou a confirmação desligada e nenhum tempo foi salvo.
- Limite do QA visual: navegador em viewport amplo; regras narrow-screen (≤360px e controles com alvo de 42px) foram verificadas pela suíte automatizada, sem emulação de aparelho físico.
