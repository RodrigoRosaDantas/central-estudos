# COMANDO-MESTRE — Evolução autônoma da Central até v10

Projeto: **Central de Estudos**
Repositório: `RodrigoRosaDantas/central-estudos`
Produção: `https://rodrigorosadantas.github.io/central-estudos/`
Meta terminal: **v10.0.0**

## MISSÃO

Evoluir a Central do estado real atual até v10.0.0 com qualidade crescente, sem transformar o número da versão em meta artificial.

A regra é:

> **o checkpoint manda; o relógio não manda.**

Uma nova execução nunca inicia a próxima major só porque passou uma hora. Ela primeiro verifica se a major anterior está realmente concluída.

## FONTES DE VERDADE — LEITURA OBRIGATÓRIA

Antes de qualquer write, leia:

1. `config/projects.json`;
2. `docs/V10-CHECKPOINT.md`;
3. `docs/ROADMAP-V10.md`;
4. `docs/ACCEPTANCE-V10.md`;
5. `docs/AUDIT-PROTOCOL.md`;
6. `docs/BACKLOG-V10.md`;
7. `docs/ARCHITECTURE.md`;
8. `CHANGELOG.md`;
9. `README.md`;
10. `.github/workflows/pages.yml`;
11. estado real da branch `main`;
12. execução mais recente do GitHub Pages.

Nunca use memória de conversa como substituto do repositório vivo.

## MÁQUINA DE ESTADO

O arquivo `docs/V10-CHECKPOINT.md` governa o avanço.

Estados possíveis:

- `READY`: nenhuma major em andamento; pode iniciar a próxima;
- `IN_PROGRESS`: existe uma major em execução; continuar a mesma;
- `BLOCKED`: há erro, inconsistência ou dependência; corrigir ou registrar, sem avançar;
- `VALIDATING`: implementação concluída, faltam gates/auditoria/deploy;
- `COMPLETE — v10.0.0`: processo encerrado.

### Regra de retomada

Se `Active major` estiver preenchida, continue **essa mesma major**.

NÃO inicie a próxima major até:
- critérios de aceite passarem;
- auditoria passar;
- deploy de produção concluir com `success`;
- checkpoint ser atualizado como concluído.

## UMA MAJOR POR VEZ

Por execução:
- trabalhe em **no máximo UMA major**;
- patches/correções da mesma major são permitidos;
- não implemente itens da major seguinte “aproveitando a execução”;
- ideias futuras vão para `docs/BACKLOG-V10.md`.

Se uma major exigir várias execuções, ela continua sendo a mesma major até fechar todos os gates.

## REGRA SAGRADA — PROJETOS-FILHOS

NÃO FAÇA WRITE em:

- `RodrigoRosaDantas/tce-go-dashboard`;
- `RodrigoRosaDantas/seedf-ppge-dashboard`;
- `RodrigoRosaDantas/tjdft-dashboard`.

A Central pode apenas:
- apontar para eles;
- ler metadados públicos;
- consumir recursos públicos existentes em modo somente leitura;
- armazenar preferências/dados próprios da Central.

Antes da execução, registre os HEAD SHAs atuais dos três projetos-filhos no preflight.
Depois da execução, confira novamente.

Se algum SHA tiver mudado:
- NÃO conclua automaticamente que foi a Central;
- confirme se a execução realizou alguma operação de escrita naquele repositório;
- se não realizou, registre como mudança externa;
- se realizou write indevido, marque `BLOCKED`, interrompa o avanço e reverta/corrija o dano com prioridade.

## PREFLIGHT OBRIGATÓRIO

Antes de alterar o produto:

1. determine a versão validada atual;
2. determine `Active major` e `Stage`;
3. confirme coerência entre:
   - `config/projects.json`;
   - README;
   - checkpoint;
   - changelog;
   - site/deploy atual;
4. registre commit HEAD atual da Central;
5. registre HEAD SHAs dos projetos-filhos;
6. confira último deploy;
7. confira se já existe execução/major incompleta;
8. leia critérios de aceite da major;
9. leia backlog e não misture escopos.

Se houver divergência material entre versão, checkpoint, changelog ou produção:
- marque/permaneça `BLOCKED`;
- reconcilie primeiro;
- não avance versão.

## SNAPSHOT PRÉ-ALTERAÇÃO

Registre no checkpoint para a major ativa:
- data/hora;
- versão validada de origem;
- commit HEAD inicial da Central;
- último deploy conhecido;
- HEAD SHAs dos projetos-filhos;
- critérios de aceite aplicáveis;
- riscos relevantes.

## EXECUÇÃO

Implemente somente o necessário para cumprir o objetivo da major descrito no roadmap + acceptance.

Preserve:
- acesso direto aos três projetos;
- progressive enhancement;
- mobile-first;
- ausência de acoplamento obrigatório;
- `projects.json` como registry;
- foco separado de retomada;
- dados técnicos separados de dados de estudo;
- observabilidade não bloqueante;
- GitHub Pages automático;
- fallback funcional;
- ausência de segredos.

Evite:
- iframe;
- banco mestre;
- copiar dashboards;
- lógica pedagógica global;
- dependência externa obrigatória;
- framework sem justificativa objetiva;
- métrica inventada;
- inferir estudo por commit;
- mudança cosmética usada apenas para justificar major.

## QUALITY GATE — ANTES DO DEPLOY

Siga `docs/AUDIT-PROTOCOL.md` e `docs/ACCEPTANCE-V10.md`.

No mínimo valide:
- HTML e referências internas;
- sintaxe JavaScript;
- JSON e manifest;
- registry;
- IDs únicos;
- URLs HTTPS;
- fallback dos três ambientes;
- links dos projetos;
- comportamento de foco;
- retomada;
- estado vazio;
- ausência de token/secret;
- acessibilidade básica;
- mobile;
- 404;
- workflow;
- arquivos/documentação coerentes;
- nenhum write nos projetos-filhos.

Se a major tiver testes específicos, eles também são obrigatórios.

## DEPLOY NÃO É TESTE

`GitHub Pages: success` significa apenas que o artefato foi publicado.

Uma major só fecha se:
1. quality gate passar;
2. deploy passar;
3. produção for validada no que for tecnicamente verificável;
4. critérios de aceite da major passarem.

## FALHA / ROLLBACK

Se houver regressão crítica em:
- navegação;
- fallback;
- carregamento;
- mobile;
- Pages;
- registry;
- acesso aos três ambientes;

então:
1. marque `Stage: BLOCKED`;
2. identifique o último commit validado;
3. prefira corrigir de forma mínima;
4. se a correção em cima gerar risco crescente, faça rollback/reversão para o último estado validado;
5. audite novamente;
6. só retome o avanço depois de restaurar baseline saudável.

Não empilhe correções indefinidamente sobre uma base quebrada.

## CHANGELOG

Toda major concluída deve registrar em `CHANGELOG.md`:
- versão;
- data;
- objetivo;
- mudanças;
- arquivos/áreas relevantes;
- riscos/limitações conhecidas;
- commit final validado;
- workflow/deploy final;
- observação sobre projetos-filhos.

Não marque release concluída sem changelog.

## BACKLOG

Ideias descobertas fora do escopo da major atual devem ser registradas em `docs/BACKLOG-V10.md`.

Cada item deve conter:
- origem;
- descrição;
- motivo para adiar;
- major candidata;
- dependências;
- risco.

Não implemente backlog automaticamente fora da major correspondente.

## CHECKPOINT — FECHAMENTO DA MAJOR

Ao concluir uma major:
1. atualize `config/projects.json`;
2. atualize README;
3. atualize arquitetura se necessário;
4. atualize changelog;
5. atualize checkpoint;
6. marque critérios de aceite;
7. registre commit/deploy final;
8. defina `Active major: none`;
9. defina `Stage: READY`;
10. defina `Next major` para a seguinte.

## AUDITORIA ESPECIAL DA v10

v10 não é uma major comum.

Antes de marcar `COMPLETE — v10.0.0`, faça auditoria integral de:
- arquitetura;
- independência;
- acessibilidade;
- mobile;
- desktop;
- performance;
- segurança frontend;
- PWA;
- fallback;
- offline quando aplicável;
- cache;
- observabilidade;
- rate limit;
- 404;
- documentação;
- código morto;
- duplicações;
- registry;
- histórico/changelog;
- workflow;
- recuperação de falha;
- links dos três projetos;
- ausência de writes nos projetos-filhos.

Somente depois:
- publicar v10.0.0;
- validar deploy final;
- marcar `Status: COMPLETE — v10.0.0`;
- `Next major: none`;
- não criar v11;
- não continuar alterando a plataforma;
- encerrar a automação.

## CRITÉRIO DE PARADA

Se o checkpoint já indicar `COMPLETE — v10.0.0`:
- não faça write;
- não faça v11;
- desative o monitoramento;
- comunique a conclusão uma única vez.
