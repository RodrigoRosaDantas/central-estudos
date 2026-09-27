# Roadmap v21 — Presença e Ritmo

## Registro da esteira
- **Major:** 21.0.0
- **Estado:** IN_PROGRESS
- **Stage:** VALIDATING
- **Versão de origem:** 20.0.0, fechada como terminal em 2026-09-27.
- **Versão terminal desta esteira:** 21.0.0.
- **Active major:** 21.0.0.
- **Next major:** none.
- **Projetos externos:** READ-ONLY; nenhum trabalho em repositório-filho está autorizado por esta esteira.

Esta esteira reabre a Central após o fechamento v20 por autorização explícita do usuário em 2026-09-27. O fechamento anterior continua preservado como histórico; esta autorização não altera as regras dos projetos-filhos.

## Objetivo
Transformar a abertura da Central numa recepção mais clara e acolhedora: uma frase original de incentivo, a data e a hora de Brasília com hierarquia visual melhor, e acesso imediato aos ambientes já existentes. Polir tipografia, ritmo, contraste, espaçamento e adaptação a telas menores sem mudar as fontes de dados nem a função de cada projeto.

## Escopo funcional
1. Reorganizar a primeira dobra para apresentar saudação, frase do dia, relógio e foco atual em ordem visual clara.
2. Mostrar hora local de Brasília (`America/Sao_Paulo`) em formato legível, sem segundos; mostrar dia da semana e data por extenso. Atualizar no minuto seguinte e ao retornar à aba.
3. Selecionar uma frase original por data do calendário de Brasília, estável durante o dia, sem API, atribuição inventada ou afirmação de progresso/sucesso.
4. Refinar cartões, superfícies, cores, tipografia, ícones e espaçamento mantendo a identidade escura da Central e a navegação por teclado/toque.
5. Preservar os acessos e recursos v20, o fallback sem JavaScript, a degradação graciosa, o contrato PWA e o limite rígido do shell.

## Fora do escopo
- Alterar, publicar ou escrever em TCE-GO, SEEDF, TJDFT ou SEDES/DF.
- Criar autenticação, backend, telemetria, novos endpoints, novas permissões ou dependências externas.
- Afirmar tempo estudado, progresso, desempenho, probabilidade de aprovação, ranking ou posição de retomada dentro de uma aula.
- Iniciar v22 ou ampliar esta esteira para outra versão.

## Aceitação
Os critérios completos estão em [`ACCEPTANCE-V21.md`](ACCEPTANCE-V21.md). Em resumo: abertura e relógio validados, frases determinísticas por data de Brasília, acessibilidade e telas pequenas verificadas, regressões v10–v20 preservadas, shell dentro do teto, quality gate aprovado, deployment associado ao HEAD e pós-deploy QA concluído.

## Riscos e respostas
- **Orçamento do shell:** baseline de 130.229 bytes, teto 131.072 e somente 843 bytes livres. Recuperar espaço por simplificação/refatoração comprovada antes de adicionar payload; manter a margem final positiva e não elevar o teto.
- **Relógio e virada do dia:** o navegador pode suspender timers. Recalcular ao voltar à aba; formatar as partes data/hora no fuso IANA definido, não no fuso do dispositivo.
- **Frases repetitivas ou promessa indevida:** usar conjunto curto de frases originais, determinístico por data, sem atribuição e sem resultado garantido.
- **Mudança visual afetar navegação:** manter destinos, IDs e contratos; validar teclado, foco visível, zoom/reflow, links diretos e fallback estático.
- **Cache antigo após publicação:** promover versão do registry e cache do service worker junto da release; confirmar artefato e conteúdo servido após deploy.

## Orçamento e controles
- **Shell first-party:** máximo absoluto 131.072 bytes (128 KiB), somando os mesmos arquivos medidos por `tests/quality.mjs`.
- **Baseline v20:** 130.229 bytes; margem 843 bytes.
- **Orçamento para código novo:** só o que couber após economia líquida demonstrada; o teto não muda.
- **Writes externos:** zero; os repositórios-filhos continuam somente leitura.
- **Validação:** suíte `node tests/quality.mjs`, verificações de sintaxe/segurança, revisão de acessibilidade, inspeção visual desktop e mobile em viewport real, workflow de quality + deploy e pós-deploy QA. Se algum tipo de inspeção não estiver disponível, registrar como não executado, sem inferir aprovação.

## Regra terminal
Executar somente a v21.0.0 nesta esteira. Após release e auditoria, marcar `Stage=COMPLETE`, `Active major=none` e `Next major=none`. Não iniciar v22.
