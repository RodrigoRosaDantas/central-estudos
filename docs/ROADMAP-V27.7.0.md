# Roadmap v27.7.0 — registro guiado por dia e matéria

**Stage:** READY FOR VALIDATION  
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

Quality gate local, conferência do app shell, publicação pelo workflow Pages e QA visual mobile concluídos sem alterar a grade nem criar dados de estudo.
