# Auditoria final — Central v24.0.0

**Status:** COMPLETE  
**Repositório:** [`RodrigoRosaDantas/central-estudos`](https://github.com/RodrigoRosaDantas/central-estudos)  
**Release commit:** `01ccefa385f306c13c86e736e6d9a7a49d16adb4`  
**GitHub Pages:** [Central de Estudos](https://rodrigorosadantas.github.io/central-estudos/)  
**Workflow de release:** [36358103801](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36358103801) — Quality gate SUCCESS; Deploy SUCCESS.

## Resultado

A v24 organiza a Central em Hoje, Retomada, Projetos, Inbox, Histórico e Evolução. A navegação por hash, o contexto de projetos e os dados já publicados foram preservados. A separação entre foco escolhido, acesso local e sinais técnicos continua explícita. Nenhuma chamada de rede foi adicionada à apresentação e os projetos-filhos permanecem read-only.

## Evidências de publicação

- Artefato `github-pages`: ID `10943764161`, 105.200 bytes, digest `sha256:beae227ecac1214edbd9f6872701e019adfe2b9dabd422b80779705d8ae8f427`.
- Payload-fonte do app shell: **120.555 bytes / 131.072 bytes**; margem de **10.517 bytes**.
- `node tests/quality.mjs`: PASS no candidato final.
- Workflow `36358103801`: Quality gate e Deploy SUCCESS.

## QA funcional pós-deploy

No GitHub Pages, em browser desktop, foram abertas diretamente as seis rotas `#agora`, `#retomada`, `#projetos`, `#inbox`, `#activity-panel` e `#evolucao`. Cada rota ativou a seção correta e mostrou seu conteúdo. Em Projetos, catálogo e Workspace apareceram juntos; em Evolução, Radar, Mentor, preferências e estado técnico permaneceram disponíveis. Voltar, avançar e atualizar mantiveram a tela corrente.

O quality gate agora verifica a árvore das seções: as telas `data-screen` devem ser filhas diretas de `main`, e Diagnóstico deve permanecer dentro de Evolução. Essa regressão foi identificada durante a inspeção pública, corrigida antes do candidato final e verificada no browser.

**Limite da inspeção:** não foi feita inspeção visual manual em viewport móvel real. As verificações automatizadas de layout responsivo, navegação móvel, alvos e fallback passaram.

## Correções feitas durante a validação

- Os primeiros quality runs detectaram uma asserção histórica específica demais e cinco scripts minificados que não tinham sido sincronizados no commit inicial. Os testes foram ajustados para reconhecer o limite nomeado e os scripts locais validados foram enviados ao repositório; os respectivos gates bloquearam o deploy.
- Após a primeira publicação aprovada, o QA no Pages mostrou que Projetos, Workspace e Histórico estavam aninhados dentro de Evolução. A estrutura HTML foi corrigida, a hierarquia direta foi adicionada ao quality gate e o workflow final acima passou.

## Integridade dos projetos e escopo

HEADs confirmados ao fim da publicação, iguais aos valores anteriores à mudança:

| Projeto | HEAD confirmado |
|---|---|
| TCE-GO | `889017ba83143be268a84358229882a2b3ef9289` |
| SEEDF | `b68431e2aa4944199705400c8821bf28505299d1` |
| TJDFT | `99877771dcd008594d6855c08f077e1563e609bd` |

Nenhum write foi feito nesses repositórios. O trabalho publicado no Work Sites permaneceu intacto; esta release alterou somente a Central no GitHub.
