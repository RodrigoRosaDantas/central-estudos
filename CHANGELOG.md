# CHANGELOG — Central de Estudos

## [28.1.2] - 2026-09-29

### Catálogo alinhado a P1–P4
- Migra a antiga ordem padrão salva TCE-GO, SEEDF, TJDFT e PRF Administrativo para P1–P4 em aparelhos existentes.
- Preserva outras ordens personalizadas localmente e mantém a agenda semanal intacta.
- Versiona o script do catálogo e renova o service worker para clientes instalados carregarem a migração.

### Validado
- Quality gate cobre a migração do padrão antigo, a preservação de preferência personalizada e o padrão P1–P4 em uma instalação nova.


## [28.1.1] - 2026-09-29

### Prioridade P1–P4
- O foco padrão da Central passa a ser o P1 SEEDF; a ordem visual e a prioridade numérica agora seguem P1, P2, P3 e P4.
- O TCE-GO continua como P3 e o PRF Administrativo como P4; a grade semanal e os dias separados de P3/P4 não mudaram.
- O snapshot público e as fontes privadas dos projetos permanecem independentes; nenhuma conexão Notion/Supabase foi centralizada.
- O cache do app instalado recebeu uma versão nova para carregar o registry atualizado.

### Validado
- Auditoria de qualidade, teste de ordenação P1–P4, estrutura do fallback sem JavaScript, agenda semanal e compatibilidade do service worker.

## [28.1.0] - 2026-09-29

### Integração Central ↔ Jornada
- O registry registra os códigos P1–P4, nomes curtos, ordem e categoria sem reordenar a grade nem mudar o foco padrão TCE-GO.
- O cabeçalho oferece acesso direto ao Painel Estratégico/Jornada.
- Pull requests executam o gate de qualidade, mas só `main` pode publicar no GitHub Pages; permissões de Pages ficam limitadas ao job de deploy.
- A Jornada pode ler o mesmo registry e os contratos públicos dos quatro projetos; a Central não depende da Jornada.

### Validado
- Contratos v1 mantêm compatibilidade; estado ausente, contrato antigo e falha de rede continuam distintos.
- A Jornada lê apenas estado e proveniência, sem consumir progresso privado do TCE-GO nem reabrir as integrações Notion dos projetos.
- Grade semanal, TCE-GO como foco padrão e repositórios P1–P4 permanecem inalterados.

## [28.0.3] - 2026-09-29

### Melhorias no Mentor
- “Agora” traz um panorama visual dos quatro projetos ativos em ordem P1–P4, com situação da fonte, próxima etapa e indicadores disponíveis.
- Questões e precisão só aparecem quando publicados pelo projeto; tempo de sete dias é explicitamente identificado como registro local da Central.
- Abas passam a usar semântica de tabs, navegação por setas/Home/End e foco visível.
- O botão de atualização esclarece que relê contratos publicados e não executa a sincronização do Notion.
- TCE-GO continua como foco padrão; fonte ausente segue como desconhecida. Nenhum projeto-filho é alterado.

### Validado
- Suíte `node tests/quality.mjs`, verificação sintática do motor do Mentor e análise de JSON: PASS.
- Workflow #435 / run `36612869668`: Quality gate e Pages Deploy — `success`; página publicada conferida em desktop.
- Navegação por teclado conferida ao vivo; inspeção visual móvel separada permanece pendente.

## [28.0.2] - 2026-09-29

### Corrigido
- O resumo rápido de foco do PRF agora exibe a próxima ação publicada pelo contrato do próprio projeto, sem fixar PRFADM01.
- Contrato em cache antigo é marcado como último estado conhecido; contrato ausente não inventa unidade.
- Mantém o transporte somente leitura, a grade P4 e a sincronização Notion → GitHub Actions → site do PRF.

### Validado
- Teste de regressão cobre ação publicada atual, cache antigo e contrato indisponível.
- Nenhum repositório filho foi escrito nesta alteração da Central.

## [28.0.1] - 2026-09-29

### Corrigido
- Mantém TCE-GO como foco padrão da Central; PRF Administrativo segue identificado como P4 na grade, sem assumir o foco automaticamente.
- Reativa o fechamento diário após a retirada do painel antigo do Mentor na Home.
- O fechamento separa horário local registrado, execução confirmada pela fonte do projeto e ausência de tempo lançado; dado ausente não significa que não houve estudo.
- Atualiza a referência para o dia de Brasília quando novos sinais chegam, a aba volta ao primeiro plano ou a data muda à meia-noite.
- Acrescenta validação para o fechamento sem `routing-panel`, a separação P4/PRF e P3/TCE-GO e a virada de data.

## [28.0.0] - 2026-09-29

### Mentor dedicado
- Mentor sai do miolo da Home e passa a viver em `/mentor/` como página filha da Central.
- Quatro áreas próprias: Agora, Projetos, Revisões & riscos e Como decide.
- Recomendação explicada por sinais reais: grade, execução confirmada, revisões, precisão, erros ativos, recência e tempo registrado.
- Leitura individual dos quatro projetos com proveniência e saúde dos dados.
- TCE-GO privado continua condicionado à sessão Supabase e RLS do próprio usuário.
- Ctrl/⌘+K e navegação principal passam a abrir o Mentor dedicado.

### PWA e orçamento
- Mentor, CSS, motor e cronograma canônico entram no app shell para uso como página própria também no PWA.
- Navegação offline para `/mentor/` cai no cache do Mentor, não na Home.
- App shell autorizado para até 256 KiB bruto / 80 KiB gzip.

### Preservado
- OpenAI API não é usada; custo por tokens permanece R$ 0.
- Projetos continuam fontes de verdade; ausência de campo continua desconhecida, nunca zero.
- Home mantém Radar e estado técnico sem duplicar o Mentor completo.

## [27.9.0] - 2026-09-29

### Adicionado
- PRF Administrativo entra na observabilidade read-only por `central-status.json`, gerado a partir do snapshot sanitizado do Notion.
- Contrato de status aceita bloco opcional `study` com unidade, questões, precisão, erros, revisões e evidência.
- Mentor combina sinais publicados de SEEDF/TJDFT/PRF com registros de tempo da Central.
- TCE-GO pode fornecer progresso privado ao Mentor somente após autenticação no Supabase; o progresso não é publicado no site do TCE.

### Integridade
- Ausência de campo continua desconhecida; não é convertida em zero.
- A Central não acessa o Notion diretamente e não recebe tokens de integração.
- O foco escolhido pelo usuário continua separado da recomendação do Mentor.
- OpenAI API permanece ausente e o custo por tokens continua R$ 0.

## [27.8.0] - 2026-09-29

### Adicionado
- Mentor adaptativo local e explicável, sem OpenAI API e sem custo por tokens.
- Recomendação do próximo projeto a partir da grade vigente, tempo realmente registrado, recência e lacunas de registro.
- Indicador de confiança da recomendação e quadro de equilíbrio dos últimos 7 dias.
- Fechamento do dia dinâmico com previsto, registrado, pendente no registro e sugestão do Mentor.

### Segurança semântica
- O Mentor nunca altera o foco escolhido pelo usuário.
- Ausência de registro é descrita como ausência de registro, não como falta ou estudo não realizado.
- Acertos, erros, domínio e matéria fraca não são inferidos quando a Central não possui esses dados.
- A camada adaptativa permanece fora do app shell offline para preservar o orçamento aprovado.

## [27.7.3] - 2026-09-29

### Corrigido
- As sessões P4 de segunda, quarta e sexta agora abrem diretamente o site próprio do PRF Administrativo.
- O registro guiado continua usando o link de origem do projeto para os blocos P4.
- Cache da Central atualizado para distribuir a mudança também às instalações PWA.

## [27.7.2] - 2026-09-29

### Corrigido
- As linhas de segunda, quarta e sexta passam a identificar PRF Administrativo como P4, conforme a faixa de prioridades.
- O registro guiado associa P4 ao site do PRF Administrativo sem alterar os dias ou a grade semanal.
- Cache da Central atualizado para levar o ajuste também às instalações PWA.

## [27.7.1] - 2026-09-29

### Corrigido
- O painel Hoje passa a abrir o site próprio do PRF Administrativo identificado como P4.
- O resumo de Hoje deixa de exibir unidade ou ação do TCE-GO sem confirmação no projeto; a grade P3 permanece intacta.
- O fechamento reflete a última execução informada e o estado mais recente do PRF no Notion, sem inventar duração ou sessão concluída.
- Cache do app e do módulo operacional atualizado para a instalação PWA receber a correção.

## [27.7.0] - 2026-09-28

### Interface refinada — 2026-09-29
- Correção para celular e tablet: painel do foco e relógio voltam a empilhar depois da regra desktop; CSS recebe nova versão de cache.
- Segunda revisão visual: painel Hoje mais compacto e cronograma em quadro equilibrado, com o dia atual destacado e o domingo preservado.
- Página inicial reorganizada para destacar o foco do dia, o horário de Brasília e os três atalhos mais úteis.
- Cartões do cronograma ficaram mais claros no celular e no desktop; dias, prioridades e blocos permaneceram intactos.
- O CSS visual da abertura usa cache runtime e fica fora do app shell offline.

### Added
- Seletor de semana e dia que reaproveita os cartões da grade semanal vigente.
- Seleção guiada das unidades e matérias catalogadas de SEEDF, TJDFT, TCE-GO e PRF.
- Totais do dia e da semana acompanham a seleção; registro local-first, com sincronização Supabase opcional para conta já cadastrada, e confirmação do estudo real.

### Fixed in post-release audit — 2026-09-29
- “Desconectar deste aparelho” agora encerra só a sessão atual (`scope=local`), preservando logins em outros dispositivos.
- O cache PWA carrega a correção pelo novo caminho versionado do módulo de sincronização.

### Preserved
- Grade, prioridades, blocos previstos, histórico e esquema de backup. Nenhum projeto avança automaticamente.
- Domingo protegido e fontes de projeto no Notion; horas sincronizam apenas na tabela isolada da Central, sem escrita no Notion ou nos projetos-filhos.


## [27.6.1] - 2026-09-28

### Fixed
- Empilha os campos de horas e minutos sob seus rótulos em telas amplas e estreitas.
- Mantém formulário, registro e resumo acessíveis dentro do app shell offline.

### Preserved
- Esquema do registro, dados locais, backups e grade semanal da v27.6.0.

## [27.6.0] - 2026-09-28

### Added
- Registro diário por bloco com data, projeto, trilha/matéria, tópico opcional, horas/minutos e confirmação explícita do estudo.
- Totais de hoje e da semana; resumos semanais por projeto e por trilha/tópico; lista de blocos recentes com exclusão individual.
- Backup JSON manual para exportar e restaurar os registros locais.

### Preserved
- Grade semanal, dias, projetos, prioridades P1–P4 e foco padrão.
- Dados do registro ficam apenas neste navegador; não sincronizam com Notion nem escrevem em projetos-filhos. Tempo informado não é tratado como domínio ou progresso.
- Limites autorizados do shell offline: 144 KiB bruto e 48 KiB gzip. O registro local permanece disponível offline; os módulos que mostram estado técnico publicado são carregados pela rede.

## [27.5.0] - 2026-09-28

### Added
- Fechamento do dia na grade semanal para separar previsto, execução registrada na origem, bloqueio editorial e retomada.
- Atalho para a origem/frescor do estado publicado em Evolução e para o Notion do PRF.

### Preserved
- Dias, projetos e ordem da grade; retomada do mesmo PRFADMxx no próximo slot previsto.
- Execução individual segue registrada na fonte do projeto; horários de publicação não são tratados como estudo.
- Nenhum backend, armazenamento paralelo de execução ou write em projeto-filho.

## [27.4.3] - 2026-09-28

### Fixed
- Agenda e texto do projeto PRF alinhados à roda canônica PRFADM01–33 confirmada na página-raiz do Notion.
- Manifesto PWA atualizado para identificar PRF Administrativo e Plataforma de Questões.
- Versão do registry, runtime e cache PWA atualizada para renovar as instalações existentes.

### Preserved
- PRF às segundas, quartas e sextas; Notion como fonte de verdade; P1–P4 e foco padrão TCE-GO.
- Todos os projetos-filhos permanecem somente leitura.

## [27.4.2] - 2026-09-28

### Changed
- PRF Administrativo passa a ocupar P4 na faixa de prioridades da semana, com acesso direto ao site publicado no GitHub Pages.
- O cartão de agenda do PRF identifica P4 e mantém os estudos de segunda, quarta e sexta e a sequência PRFADM01→PRFADM30.
- A faixa mostra quatro prioridades em telas amplas e refluí para duas colunas em telas estreitas.
- Registry, runtime, URLs do app shell e cache PWA foram renovados para clientes instalados.

### Preserved
- SEEDF (P1), TJDFT (P2) e TCE-GO (P3), o foco padrão TCE-GO e a fonte de verdade Notion do PRF.
- O painel PRF continua fora do Radar operacional enquanto não publicar contrato de status.
- Citações, autoria, fonte e rotação de cinco minutos; o redesenho desktop publicado em v27.4.1 permanece.

## [27.4.1] - 2026-09-28

### Changed
- O cabeçalho desktop distribui o espaço entre a identificação da Central e um painel horizontal de destaque para a frase.
- A frase ganhou maior escala e presença; o cartão usa a largura disponível e fica centralizado ao lado do título e da saudação.

### Preserved
- As seis citações, autoria, fonte oficial e rotação de cinco minutos permanecem iguais.
- Em telas menores, a frase continua abaixo da identificação; nenhuma chamada externa ou registro de progresso foi adicionado.
- O limite aprovado do app shell foi mantido.

## [27.4.0] - 2026-09-28

### Changed
- PRF Administrativo abre seu painel publicado no GitHub Pages a partir do catálogo da Central.
- O repositório correto do PRF passa a alimentar somente metadados públicos de atualização e deploy.
- O cartão mantém um segundo link direto ao Notion, que continua sendo a fonte de verdade para progresso e materiais.
- O app shell e as URLs de runtime foram versionados para renovar instalações da PWA.

### Preserved
- PRF permanece ativo, sem prioridade numérica e sem contrato de status operacional na Central.
- A Central não altera o repositório, os dados ou os materiais do PRF.

### Verified
- PR #6 integrado no commit `4a378f726d5ead66305cba2b63ec054f583d1bb3`; Quality gate e Deploy passaram no [workflow 36437885787](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36437885787).
- Artefato Pages `10976357365`, 145.103 bytes, digest `sha256:aa8e237d8364405e14b0eb1730d9228d913b05b328992f6c34af2cefe6d351e9`.
- Payload do app shell: 147.300/147.456 bytes brutos e 47.887/49.152 bytes gzip.
- QA publicado em 1363×936 confirmou v27.4.0, cartão acessível, links do painel e do Notion, deploy publicado e ausência de overflow horizontal. Os testes responsivos passaram; não foi feita inspeção manual num viewport móvel nesta sessão.

## [27.3.0] - 2026-09-28

### Changed
- O cronograma destaca o dia atual pelo fuso `America/Sao_Paulo`, atualiza ao cruzar a meia-noite local e anuncia a data com `aria-current="date"`.
- A Inbox compara fase, ciclo, unidade, próxima ação e alertas dos contratos validados com o último estado confirmado ao vivo, guardado somente neste navegador.
- Contratos em cache ficam identificados e nunca sobrescrevem a última base confirmada ao vivo; uma primeira conferência não inventa mudanças anteriores.
- PRF Administrativo é rotulado na agenda como projeto independente, sem prioridade numérica; o destino continua sendo o Notion até o site próprio estar disponível.
- Service worker, URLs de runtime e registry foram versionados para v27.3.0.

### Visual polish
- O cartão da frase do dia ganhou fundo mais visível, citação maior e mais forte, além de autoria e link da fonte com contraste reforçado.
- Cache PWA renovado para `central-shell-v27.3.0-quote-contrast-20260928`; conteúdo, atribuição e rotação das frases permanecem iguais.

### Preserved
- SEEDF (P1), TJDFT (P2) e TCE-GO (P3) mantêm suas prioridades e a rotina semanal.
- A Plataforma de Questões continua ferramenta transversal e separada do catálogo de concursos.
- Comparação local é somente leitura, não mede estudo/progresso e não escreve nos projetos-filhos.

## [27.2.2] - 2026-09-28

### Changed
- As seis frases do Major Cadar agora alternam automaticamente a cada cinco minutos, sem recarregar a página.
- Frase, autoria e fonte correta acompanham cada troca; o HTML mantém fallback sem JavaScript.
- Versão de runtime, registry e cache PWA atualizada para que clientes instalados recebam a correção.

### Verified
- Quality gate local confirma troca por janela de cinco minutos, seis textos e seis fontes coerentes.
- Status do workflow remoto e QA visual móvel precisam de confirmação após o push.

## [27.2.1] - 2026-09-28

### Fixed
- Selo de versão do painel Hoje alinhado a v27.2.1; runtime, registry e cache PWA renovados para corrigir também clientes instalados.

### Verified
- `node tests/quality.mjs` passou localmente após o hotfix.
- Quality gate e Pages Deploy passaram no [workflow 36369866365](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36369866365).
- QA publicado em 1363×936 confirmou o selo Hoje alinhado a V27.2.1, frase/autoria/fonte visíveis e ausência de overflow; atualização PWA concluiu após ação do usuário.

## [27.2.0] - 2026-09-28

### Changed
- Frase diária troca citações genéricas por seis frases curtas do Major Cadar, cada uma ligada à sua origem.
- Rótulo da seção destaca a mentalidade de estudo; a escolha diária continua estável pelo calendário de Brasília.
- HTML estático mantém uma frase, autor e fonte coerentes sem JavaScript; sem requisição externa nova.

### Verified
- Quality gate e primeira publicação da funcionalidade passaram no workflow 36369665244; a inspeção visual revelou um selo de versão antigo no painel Hoje, corrigido e republicado como v27.2.1.

## [27.1.1] - 2026-09-28

### Fixed
- Rótulo do acesso ao Notion compactado após QA visual encontrar a seta quebrando sozinha ao lado do botão de foco.
- Service worker, runtime e registry passam para 27.1.1 para que instalações anteriores recebam o app shell corrigido.

### Verified
- `node tests/quality.mjs` local passou.
- Quality gate e Pages Deploy passaram no [workflow 36368493310](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36368493310); o QA visual publicado confirmou o CTA em uma linha e os dois destinos no lugar correto.
- Artefato Pages `10948247167`, digest `sha256:a35952ca77442ac02a9d5461a882164f872ad4ea41863cfcf2e7356e7d940eff`.
- Inspeção desktop em 1363×936 sem overflow horizontal; viewport móvel continua sem QA visual nesta sessão.

## [27.1.0] - 2026-09-28

### Added
- PRF Administrativo entra no catálogo como projeto ativo, com link direto à página de execução no Notion.
- Plataforma de Questões ganha card próprio na seção Ferramentas de estudo, separado dos concursos e das prioridades.
- Fallback sem JavaScript conserva acesso direto aos quatro projetos e à plataforma.

### Preserved
- SEEDF (P1), TJDFT (P2) e TCE-GO (P3) mantêm a ordem principal; PRF fica sem prioridade numérica.
- O cartão PRF declara origem Notion e ausência de telemetria; foco, último acesso e progresso seguem separados.
- A plataforma e os projetos abrem em seus próprios sites; a Central não escreve nos destinos.
- Gate de payload mede todos os assets do app shell e também o tamanho comprimido.

### Verified
- Quality gate e Pages Deploy passaram no workflow 36368041253; o QA visual apontou um ajuste pequeno de quebra de linha, corrigido em v27.1.1.

## [27.0.1] - 2026-09-27

### Fixed
- Agenda móvel compactada: cada dia mantém um cartão, com o nome do dia ao lado das tarefas; rótulos-resumo duplicados ficam recolhidos em celulares.
- Cache do app shell, runtime e registry identificados como v27.0.1; instalações anteriores recebem a ação de atualização do PWA.

### Verified
- Prioridades, sete dias, PRF Administrativo, relógio de Brasília e citações com autor/fonte mantidos.
- Projetos-filhos continuam somente leitura.

## [27.0.0] - 2026-09-27

### Changed
- Cronograma passa a apresentar um cartão individual para cada dia, de segunda-feira a domingo.
- PRF Administrativo ganha destaque próprio como trilha complementar e aparece segunda, quarta e sexta, mantendo a sequência PRFADM01→PRFADM30.
- SEEDF/TJDFT mantêm estudo de segunda a sexta e revisão no sábado; TCE-GO permanece terça, quinta e sábado.
- Layout diário refluído para uma coluna em telas estreitas.

### Preserved
- SEEDF → TJDFT → TCE-GO permanece a ordem de prioridades; PRF Administrativo não vira prioridade 4.
- Domingo permanece protegido e a agenda não registra estudo nem progresso.

## [26.0.0] - 2026-09-27

### Changed
- Grade semanal reorganizada em padrões compactos para celular: SEEDF e TJDFT estudam de segunda a sexta e revisam no sábado; TCE-GO tem sessões terça, quinta e sábado.
- PRF-ADM incluído na grade às segundas, quartas e sextas, seguindo a próxima unidade PRFADMxx da trilha 01–30.
- Relógio de Brasília passa a exibir horas, minutos e segundos, atualizados a cada segundo.
- Script da Central e registro de projetos usam URLs versionadas para atualizar clientes com cache PWA antigo.
- Frase diária passa a alternar citações sobre educação e estudo com autor e link para a fonte.

### Preserved
- SEEDF → TJDFT → TCE-GO continua como ordem manual de prioridade; PRF-ADM aparece como trilha adicional sem nova classificação.
- A Central não registra estudo, presença, sequência concluída nem progresso; projetos e seus dados continuam independentes.
- A fonte de cada citação é aberta somente por ação explícita do usuário; não há nova chamada automática de rede.

## [25.0.0] - 2026-09-27

### Added
- Cronograma semanal na tela Hoje, com prioridade manual SEEDF → TJDFT → TCE-GO.
- Segunda, quarta e sexta: SEEDF antes de TJDFT; terça, quinta e sábado: sessão TCE-GO; domingo protegido para descanso e revisões previstas.
- Atalho com âncora direta para abrir a grade a partir de qualquer tela.

### Preserved
- A agenda não muda o foco da Central, não registra estudo e não estima progresso.
- Cada projeto mantém sua própria fila; exceções do TCE-GO continuam sob o calendário do Dxx ativo.
- Projetos-filhos e contratos publicados permanecem somente leitura.

## [24.0.0] - 2026-09-27

### Changed
- Navegação principal organizada em seis telas: Hoje, Retomada, Projetos, Inbox, Histórico e Evolução.
- Retomada mostra foco escolhido e último acesso em cartões separados, com rótulos que não sugerem progresso de estudo.
- Projetos reúne os acessos rápidos e o Workspace de concursos.
- Inbox recebe filtros próprios por tipo e projeto; Radar preserva o conjunto de contratos válidos sem filtros da Inbox.
- Views nomeadas passam a lembrar a tela; registros antigos sem `screen` abrem em Hoje.
- Atalhos antigos continuam levando à tela correspondente.
- Scripts do shell minificados em UTF-8 para fechar abaixo do teto histórico de 128 KiB; teste de payload permanece estrito.
- Service worker atualizado para `central-shell-v24.0.0`.

### Preserved
- Leitura somente dos projetos-filhos e dos contratos publicados.
- Nenhuma chamada de rede adicional, gravação externa, pontuação ou progresso inferido.
- Fallback sem JavaScript e links diretos para os ambientes.
- **Release validada:** commit `01ccefa385f306c13c86e736e6d9a7a49d16adb4`; workflow `36358103801` — Quality + Deploy SUCCESS; artefato Pages `10943764161`, digest `sha256:beae227ecac1214edbd9f6872701e019adfe2b9dabd422b80779705d8ae8f427`; payload do shell 120.555 / 131.072 bytes.
- **QA pós-deploy:** seis telas, navegação por hash, anterior/seguinte e atualização verificados no desktop; viewport móvel real não inspecionado visualmente.

## [23.0.0] - 2026-09-27

### Changed
- “Agora” evolui para **Hoje**, com foco e ação publicada como centro da abertura.
- “Evolução dos projetos” evolui para **Radar operacional**.
- “Como entrar” evolui para **Mentor de execução** com as lentes já confiáveis.
- Ausência de próxima ação passa a ser declarada explicitamente, sem inferência.
- Command Palette ganha acesso direto ao Mentor.
- Atalhos da Home priorizam Mentor, Acessos e Histórico.

### Preserved
- Foco continua definido pelo usuário.
- Radar e Mentor não ranqueiam, pontuam ou trocam prioridade.
- Contratos e projetos-filhos permanecem read-only.

## [22.0.0] - 2026-09-27

### Changed
- Nova Home **Centro de Comando**, com referência visual no TDAS.
- Foco, fase, saúde, evolução, ação publicada e retomada no mesmo contexto.
- Relógio, diretriz, atalhos e navegação inferior refinados para mobile.
- Paleta teal/violeta sobre superfícies escuras.

### Preserved
- Contratos read-only, provenance, Inbox, Views, histórico, preferências, PWA, fallback e links diretos.
- Zero writes nos projetos-filhos e zero progresso/ranking inferido.

## [21.0.0] — 2026-09-27
- nova recepção visual com frase original de incentivo estável por dia de Brasília;
- saudação separada do relógio, com hora/minuto, dia da semana e data por extenso;
- relógio e frase recalculados a cada minuto e ao retornar à aba;
- estilos obsoletos de cartões removidos e shell mantido em 130.650 bytes / 131.072 bytes;
- regressões v10→v20 e comportamento do relógio/frase verificados por quality gate;
- projetos-filhos permanecem READ-ONLY e sem writes.
- **Release:** `418231a98699a52b07bdce6d94d6d00a3c1e01bd`; workflow `36346724227` — quality + deploy SUCCESS.
- **Artefato:** `10941231310`, digest `sha256:c56665778704a12a0823ddb07e58e1a8925b3ecf25af10a9565c9d5a8eccfb80`.
- **QA:** desktop PASS; inspeção visual mobile em viewport real não executada.


## [20.0.0] — 2026-09-27
- auditoria terminal integral da geração v16→v20;
- regressões v10/v15 e contratos v16→v19 revalidados;
- mobile/teclado/a11y/offline auditados estruturalmente pelo gate existente;
- segurança, PWA, registry, documentação e independência consolidados;
- nenhum novo recurso funcional adicionado ao shell;
- zero writes em TCE-GO, SEEDF e TJDFT;
- app shell rotacionado para `central-shell-v20.0.0`;
- auditoria terminal documentada em `docs/FINAL-AUDIT-V20.md`.
- **Commit terminal validado:** `8980ec3de229b85722556d5a9bc2ecc185965476`;
- **Workflow terminal validado:** `36332111657` — quality `success` + deploy `success`;
- **Artefato Pages:** `10935679416`, shell 130.983 bytes <= 131.072 bytes;
- **Estado terminal:** COMPLETE; nenhuma v21 definida.


- **Manutenção UX pós-terminal:** horário de Brasília no cabeçalho, rótulos de navegação mais claros, “Opções da Central” e evolução confiável dos projetos baseada nos contratos publicados.
- **Hotfix UX validado:** commit `6692cfc6361a712131bb34f36ee3899413cd0607`, workflow `36333688144`, shell 130.973 bytes.

- **Polimento UX v20:** botão Opções no cabeçalho, data/horário de Brasília atualizados a cada minuto, contagem de projetos acompanhados e navegação consolidada em 5 colunas.
- **Validação:** commit `9d04c2efef0a78622333929e53f2a85f19dc0b18`, workflow `36336455463`, artefato `10937705227`, shell 130.771 bytes.
- **Home mobile simplificada:** remove duplicações de foco/retomada, adota rótulos Acessos/Histórico e prioriza Evolução antes de “Como entrar”.
- **Atualização operacional global:** botão `Atualizar tudo` reaproveita refresh read-only dos contratos, sem fetch na camada de apresentação.
- **Validação:** commit `9f4ab37745c85b23908fa29acedbabebbea34034`, workflow `36337115700`, artefato `10936824711`, shell 130.989 bytes.
- **Manutenção UX — foco, retomada e evolução:** foco e último ambiente aberto agora aparecem uma única vez em “Agora”; a retomada informa último acesso sem sugerir aula exata ou progresso.
- **Validação funcional:** commit `fa47c154cbf377c55c006869c23ab1794357b373`, workflow `36339824154` — quality SUCCESS + deploy SUCCESS; artefato `10937469381`, digest `sha256:f765d120cfce8983a349ca13ee3a4b23c95cd76cc30e91af22078b4af7d9b140`; shell 130.229 bytes.

## [19.0.0] — 2026-09-27
- Views locais nomeadas e limitadas a 8 por navegador;
- snapshots restritos a aba do Workspace, lente e filtros da Inbox;
- salvar/aplicar/restaurar via Command Palette existente;
- filtros da Inbox persistidos localmente para compor views;
- foco, retomada, favoritos, histórico, contratos e caches ficam fora das views;
- views/filtros adicionados explicitamente à allowlist do backup de preferências;
- zero backend, zero fetch novo e zero writes externos;
- compactação semântica de módulos existentes para manter o teto de 128 KiB;
- app shell preparado para `central-shell-v19.0.0`;
- shell funcional auditado em 130.983 bytes <= 131.072 bytes.
- **Commit de release validado:** `de8881589d8103c4b114f9cba7356a2559148b6b`;
- **Deploy validado:** workflow `36331287103` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10935921078` — PASS.


## [18.0.0] — 2026-09-27
- provenance e frescor explícitos na Inbox operacional;
- idade descritiva de contrato e fonte publicada;
- `source.kind`, `source.ref`, `source.status` e schema compatível visíveis;
- refresh manual por projeto via evento local, reutilizando GET read-only/timeout/validação/cache;
- refresh simultâneo deduplicado; zero polling;
- apresentação continua sem `fetch` e sem inferência causal baseada em idade;
- fallback/no-JS, mobile, links diretos, foco/retomada e contratos stale preservados;
- zero writes nos projetos externos;
- app shell rotacionado para `central-shell-v18.0.0`;
- shell funcional auditado em 130.986 bytes <= 131.072 bytes.
- **Commit de release validado:** `4f6c02c08045eb3a2022953f50af7c54dd0606a4`;
- **Deploy validado:** workflow `36330175487` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10935502046` — PASS.


## [17.0.0] — 2026-09-27
- Inbox operacional consolidando ações publicadas e alertas dos contratos read-only;
- filtros por Tudo / Ações / Alertas e por projeto;
- provenance explícita para contrato publicado, cache recente e cache antigo;
- estado stale separado como **Último estado**;
- ordem de catálogo preservada, sem ranking, score ou prioridade calculada;
- camada operacional sem chamadas de rede próprias;
- fallback/no-JS, mobile-first, links diretos e independência dos projetos preservados;
- quality gate recebeu contrato específico da v17 e coerência de cache baseada na versão do registry;
- app shell rotacionado para `central-shell-v17.0.0`;
- projetos externos permanecem read-only; zero writes.
- **Commit de release validado:** `1dad7e93f708dd9fdb6361d1da6e65c7687cef64`;
- **Deploy validado:** workflow `36329426775` — quality `success` + deploy `success`;
- **Pós-deploy QA:** artefato Pages `10934629623` — PASS; shell 130.106 bytes <= 128 KiB.


## [16.0.0] — 2026-09-27
- nova roadmap **Workspace PRO v16→v20** iniciada;
- Command Palette com Ctrl/⌘+K;
- botão flutuante para acesso por toque/mobile;
- busca projetos ativos, arquivados e futuros;
- navegação rápida entre Agora, Projetos, Workspace, Atividade e Diagnóstico;
- ações rápidas para foco e retomada;
- teclado ↑/↓/Enter/Escape e semântica de opções;
- zero chamadas de rede adicionais;
- zero writes em projetos externos;
- cache atualizado para `central-shell-v16.0.0`;
- orçamento da nova geração definido em 128 KiB;
- **Pipeline de implementação:** `36312740627` — quality success + deploy success;
- **Commit de release validado:** `cfbac82a6bc1b9d924ef5b34f5f40884deb3be38`;
- **Deploy validado:** workflow run `36312910219` — quality `success` + deploy `success`.

## [15.0.0] — 2026-09-27
- Workspace de concursos com lifecycle `active / archived / future`;
- TCE-GO, SEEDF e TJDFT permanecem ativos;
- SEDES/DF — TDAS adicionado como primeiro histórico arquivado, com Pages verificado;
- arquivados/futuros ficam fora de foco, retomada e observabilidade ativa;
- nova navegação para **Workspace** e filtros Ativos / Arquivados / Futuros;
- exportação/importação de preferências com allowlist explícita e limite de 64 KB;
- backup exclui último acesso, histórico e caches técnicos/operacionais;
- registry atualizado para schema v3;
- app shell rotacionado para `central-shell-v15.0.0`;
- shell final auditado em 122.134 bytes <= 120 KiB (122.880 bytes);
- **Projetos externos:** zero writes durante a v15;
- **Commit de produto validado:** `e70063822dd0185fcade890aa4320b37c03a5315`;
- **Deploy validado:** workflow run `36287841226` — quality `success` + deploy `success`.

## [14.0.0] — 2026-09-27
- roteamento explicável por lentes escolhidas pelo usuário;
- lentes: Foco, Retomada, Ações publicadas e Alertas;
- cada resultado explica por que aparece;
- múltiplos resultados preservam a ordem do catálogo;
- estado stale mostrado como **Último estado conhecido**;
- lente local persistida sem backend;
- zero chamadas de rede adicionais;
- sem ranking, score, prioridade calculada ou recomendação automática;
- camada v13/v14 consolidada para evitar duplicação;
- shell mantido dentro do orçamento de 120 KiB sem aumentar o limite;
- app shell atualizado para `central-shell-v14.0.0`;
- **Projetos-filhos:** read-only; zero writes;
- **Commit de release validado:** `589ae593d2ab9107555760dc6e6c5e57851a619d`;
- **Deploy validado:** workflow run `36286790166` — quality `success` + deploy `success`.

## [13.0.0] — 2026-09-27
- estado operacional dos contratos v12 passa a ser apresentado na interface;
- nova seção **Próximas ações publicadas**;
- fase, ciclo, unidade atual, próxima ação e alertas exibidos quando publicados;
- ações `operational` e `planned` recebem rótulos distintos;
- stale cache é mostrado como **Último estado conhecido**;
- foco escolhido pelo usuário permanece independente do estado operacional;
- camada v13 sem chamadas de rede próprias;
- sem ranking, score, prioridade calculada ou mentor global;
- novos assets `operational-v13.css` e `operational-v13.js`;
- app shell atualizado para `central-shell-v13.0.0`;
- **Projetos-filhos:** read-only nesta major; zero writes;
- **Commit de release validado:** `83696d8471fc24c84fdb72c965bcffd5a2fa58ea`;
- **Deploy validado:** workflow run `36285904184` — quality `success` + deploy `success`.

## [12.0.0] — 2026-09-27
- registry atualizado para schema v2 com `statusUrl`;
- contrato público de estado operacional v1 definido e documentado;
- TCE-GO, SEEDF e TJDFT publicam `public/central-status.json`;
- consumidor read-only com GET, timeout de 3,5 s e cache de 5 min;
- ID/schema/estrutura do contrato validados antes do uso;
- graceful degradation para unavailable/invalid/stale-cache;
- Diagnóstico passa a indicar disponibilidade do contrato operacional;
- Visão Agora ainda não usa `nextAction` ou `currentUnit` — reservado à v13;
- service worker não cacheia contratos dos filhos;
- cache da Central atualizado para `central-shell-v12.0.0`;
- **Writes autorizados nos filhos:** somente `public/central-status.json`;
- **Commit de release validado:** `554063372968b6e128ccf7dc70d22f14b564bd1a`;
- **Deploy validado:** workflow run `36285194809` — quality `success` + deploy `success`.

## [11.0.0] — 2026-09-27
- nova geração da Central iniciada após o fechamento terminal da v10;
- adicionada **Visão Agora** com foco, retomada e catálogo;
- navegação principal: Agora, Projetos, Atividade e Diagnóstico;
- navegação sticky no desktop e inferior fixa no mobile;
- integração baseada em eventos locais, sem polling;
- zero chamadas de rede adicionais na camada v11;
- dados técnicos mantidos como camada secundária;
- nenhuma próxima ação pedagógica, progresso ou desempenho é inventado;
- novos assets `pro-v11.css` e `pro-v11.js` incluídos no app shell;
- cache PWA atualizado para `central-shell-v11.0.0`;
- quality gate cobre os contratos específicos da v11;
- **Projetos-filhos:** somente leitura; zero writes;
- **Commit de release validado:** `7090e201e82192fd53703f5d5e35637f20bbf5f7`;
- **Deploy validado:** workflow run `36284442637` — quality `success` + deploy `success`.

## [10.0.0] — 2026-09-26
- release estável terminal da esteira v10;
- auditoria integral registrada em `docs/FINAL-AUDIT-V10.md`;
- documentação consolidada e arquitetura congelada para esta esteira;
- registry atualizado para `10.0.0`;
- cache PWA rotacionado para `central-shell-v10.0.0`;
- preservados fallback, progressive enhancement, mobile-first, observabilidade não bloqueante e separação entre foco/retomada/favorito/acesso/recência técnica;
- quality gate continua obrigatório antes do deploy;
- nenhuma responsabilidade pedagógica global ou acoplamento obrigatório foi introduzido;
- auditoria terminal: PASS estrutural/automatizado, com limitação explícita de ausência de inspeção visual interativa real;
- **Projetos-filhos:** somente leitura; zero writes nesta esteira; SHAs finais confirmados: TCE-GO `2986dabf2ddb3ed6b22fa58b9a5151981a678dbf`, SEEDF `bb006c3bc896534716e6b568849669a7fe4424c8`, TJDFT `8aa366c0068f6f705fb2d27a44b7a522f90003d9`;
- **Commit de release validado:** `f19cb013b2dfaf20cfc4febb00ab677a79741fd0`;
- **Workflow/deploy final da release:** Pages `36283643314` — `quality: success` + `deploy: success`;
- **Estado terminal:** `COMPLETE — v10.0.0`; nenhuma v11 iniciada automaticamente.

## [9.0.0] — 2026-09-26
- hardening de segurança, acessibilidade, mobile, rede e performance;
- CSP, escape de conteúdo, registry endurecido, health cache curto e deploy lookup direcionado;
- contraste crítico, teclado, forced-colors, touch targets e larguras 360/419/480/680/720/760 auditados;
- shell 91.658 bytes com orçamento <= 120 KiB; zero JS/CSS órfãos e funções nomeadas mortas detectadas;
- cache `central-shell-v9.0.0`;
- commit validado `5a243c24447c39eaaae85fd8183e599be5ac9c81`; Pages `36280042225` — success; zero writes nos filhos.

## [8.0.0] — 2026-09-26
- linha do tempo local limitada e diagnóstico técnico conservador;
- acesso local separado de atividade técnica/disponibilidade/deploy;
- nenhuma inferência de estudo, duração, progresso ou desempenho;
- cache `central-shell-v8.0.0`;
- commit `e1b118a502927256029ae855f39d88fb4fd46a9b`; Pages `36279346345` — success; zero writes nos filhos.

## [7.0.0] — 2026-09-26
- quality gate automatizado, determinístico e sem rede externa;
- validação de registry, fallback, manifest, PWA, secrets e funções críticas;
- workflow `quality → deploy`, com falha de teste impedindo publicação;
- commit `e47e94341c21219936133762bf3675a0251f4c79`; Pages `36278662494` — success; zero writes nos filhos.

## [6.0.0] — 2026-09-26
- PWA e resiliência com service worker restrito à Central;
- app shell offline, network-first, cache versionado e atualização controlada;
- projetos/APIs externas fora do cache; instalação opcional;
- commit `0c57c967e277764d1938f3a6fc91fc03f73a74e5`; Pages `36277789554` — success; zero writes nos filhos.

## [5.0.0] — 2026-09-26
- personalização local: densidade, detalhes, ordem manual e reset seguro;
- preferências inválidas degradam para defaults; nenhum dado sensível;
- commit `cf8cdb818449d020923f50d63e67689b635abc96`; Pages `36272168251` — success; zero writes nos filhos.

## [4.0.0] — 2026-09-26
- catálogo com busca, favoritos, ordenação e atalhos `Alt+1..9`;
- foco, retomada, favorito e recência permanecem distintos;
- commit `42ee59a34ebb34ecaa858da77b03646f25c21304`; Pages `36271496568` — success; zero writes nos filhos.

## [3.0.0] — 2026-09-26
- observabilidade confiável: disponibilidade, publicação e deploy separados;
- cache/stale/rate limit tratados; dado técnico não representa estudo;
- commit `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`; Pages `36270559732` — success; zero writes nos filhos.

## [2.0.0] — 2026-09-26
- shell consolidada, armazenamento local defensivo, fallback/404 e hierarquia operacional;
- commit `e3cfacdf6e3784ca0236065cf34ac14c2900dd97`; Pages `36264383202` — success; zero writes nos filhos.

## Série 1.x — 2026-09-26
- v1.4: foco local e deploy validado;
- v1.3: pulso global, disponibilidade e publicação técnica;
- v1.2: separação foco/retomada e 404;
- v1.1: fallback, health check, manifest e acessibilidade;
- v1.0: fundação, registry, navegação e arquitetura desacoplada.
