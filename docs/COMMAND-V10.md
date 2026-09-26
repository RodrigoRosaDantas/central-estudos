# COMANDO-MESTRE — Evolução da Central até v10

Execute autonomamente **UMA única etapa major por execução** da evolução do projeto:

**Central de Estudos**
Repositório: `RodrigoRosaDantas/central-estudos`
Site: `https://rodrigorosadantas.github.io/central-estudos/`

## OBJETIVO

Evoluir a Central de Estudos do estado real atual até **v10.0.0**, mantendo TCE-GO, SEEDF e TJDFT como aplicações independentes.

A Central deve ficar cada vez mais madura em:

- navegação;
- consciência operacional;
- observabilidade;
- confiabilidade;
- responsividade;
- acessibilidade;
- PWA;
- recuperação de falhas;
- explicabilidade;
- manutenção;
- qualidade técnica;
- capacidade de orientar o próximo acesso sem assumir a lógica pedagógica dos projetos-filhos.

## FONTES DE VERDADE

Antes de editar:

1. leia `config/projects.json`;
2. leia `docs/ARCHITECTURE.md`;
3. leia `docs/ROADMAP-V10.md`;
4. leia `docs/V10-CHECKPOINT.md`;
5. leia `README.md`;
6. inspecione o estado real da branch `main`;
7. confira o workflow `.github/workflows/pages.yml`;
8. confira a execução mais recente do GitHub Pages.

Nunca use memória antiga como substituto do repositório vivo.

## REGRA DE ESCOPO

A cada execução:

- processe **no máximo UMA versão major**;
- se a versão atual for 1.x, avance para 2.0.0;
- depois 3.0.0, 4.0.0 ... até 10.0.0;
- patches necessários para concluir a mesma etapa podem ser feitos na própria execução;
- só marque a nova major como concluída depois de auditoria + deploy bem-sucedidos.

Se houver erro relevante, corrija-o antes de avançar.

## REGRA SAGRADA DE INDEPENDÊNCIA

NÃO editar:

- `RodrigoRosaDantas/tce-go-dashboard`;
- `RodrigoRosaDantas/seedf-ppge-dashboard`;
- `RodrigoRosaDantas/tjdft-dashboard`.

A Central pode apenas:

- apontar para eles;
- consultar metadados públicos;
- consumir contratos/recursos públicos existentes em modo somente leitura;
- usar dados locais da própria Central.

Se uma ideia exigir alteração em projeto-filho, **não execute**. Registre como oportunidade futura que depende de aprovação explícita.

## REGRAS DE ARQUITETURA

Preserve:

- fallback de acesso direto;
- zero dependência obrigatória dos projetos-filhos;
- `projects.json` como registry principal;
- foco separado de último acesso;
- preferências locais separadas de dados dos projetos;
- observabilidade como informação, nunca bloqueio;
- GitHub Pages como deploy automático;
- mobile-first;
- progressive enhancement.

Evite:

- iframe;
- copiar dashboards;
- duplicar lógica pedagógica;
- criar banco mestre;
- introduzir framework sem necessidade objetiva;
- adicionar dependência externa que possa derrubar a navegação;
- métricas inventadas;
- inferir progresso acadêmico por commits.

## ROADMAP

Siga `docs/ROADMAP-V10.md` como direção, mas faça auditoria antes de implementar. Se o estado real mostrar que um item já existe, não replique; use a etapa para amadurecer o objetivo daquela versão.

## AUDITORIA OBRIGATÓRIA

Antes de publicar uma major, valide no mínimo:

- HTML e referências internas;
- sintaxe JavaScript;
- JSON/manifest;
- fallback dos três ambientes;
- links dos três projetos;
- mobile;
- acessibilidade básica;
- ausência de segredo/token;
- workflow do Pages;
- deploy final;
- nenhum commit nos projetos-filhos;
- coerência entre versão, README, arquitetura e checkpoint.

Se o deploy falhar:
1. leia o job/steps/logs;
2. corrija;
3. execute novo deploy;
4. não avance o checkpoint até obter sucesso.

## CHECKPOINT

Ao final de uma etapa concluída:

1. atualize a versão em `config/projects.json`;
2. atualize `README.md`;
3. atualize `docs/ARCHITECTURE.md` se houver nova regra;
4. atualize `docs/V10-CHECKPOINT.md`;
5. registre resumo objetivo da versão;
6. confirme o deploy bem-sucedido.

## CRITÉRIO DE PARADA

Quando `config/projects.json` indicar **10.0.0** e o deploy correspondente estiver concluído com sucesso:

- faça uma auditoria final;
- marque o checkpoint como **COMPLETE — v10.0.0**;
- não implemente v11;
- não continue alterando a plataforma;
- comunique que a meta v10 foi concluída.
