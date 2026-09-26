# ACCEPTANCE — Critérios de aceite até v10

Nenhuma major é concluída por “parecer pronta”. Ela precisa cumprir os critérios abaixo.

## Gates globais — todas as majors

Obrigatórios em toda versão:
- site principal continua acessível;
- TCE-GO, SEEDF e TJDFT continuam acessíveis por link direto;
- fallback sem JavaScript continua oferecendo os três acessos;
- `config/projects.json` é JSON válido;
- IDs do registry são únicos;
- URLs essenciais usam HTTPS;
- JavaScript principal tem sintaxe válida;
- manifest permanece válido quando existir;
- nenhum secret/token/API key é adicionado ao frontend;
- nenhuma operação de escrita é executada nos projetos-filhos;
- documentação e versão são coerentes;
- GitHub Pages conclui com `success`;
- não há regressão crítica conhecida em mobile.

## v2.0 — Fundação consolidada

Aceite:
- hierarquia da home coerente em mobile e desktop;
- foco, retomada, observabilidade e catálogo não competem visualmente;
- estados vazios e falhas têm texto útil;
- 404 própria funcional;
- fallback documentado e testável;
- preferências locais não quebram quando inválidas/corrompidas;
- limpeza de inconsistências acumuladas da série 1.x.

## v3.0 — Observabilidade confiável

Aceite:
- saúde técnica não bloqueia navegação;
- falha de rede vira estado inconclusivo, não falso “offline”;
- metadados do GitHub têm cache/limite de chamadas;
- rate limit é tratado sem quebrar UI;
- “última publicação técnica” não é apresentada como “último estudo”;
- origem dos dados é explicável;
- stale data é identificável quando aplicável.

## v4.0 — Catálogo operacional

Aceite:
- catálogo continua simples com 3 projetos e escala para mais;
- busca/filtro só entra se trouxer ganho real;
- favoritos/ordenação, se implementados, são locais;
- foco, favorito, último acesso e recência são conceitos distintos;
- atalhos não prejudicam touch/mobile;
- abrir projeto continua sendo ação principal.

## v5.0 — Personalização local

Aceite:
- preferências ficam apenas na Central;
- reset restaura defaults seguros;
- preferências inválidas não quebram renderização;
- ordenação/apresentação não altera registry;
- nenhuma preferência sensível é armazenada;
- configuração é compreensível e reversível.

## v6.0 — PWA e resiliência

Aceite:
- service worker, se criado, não impede atualização da Central;
- app shell pode abrir offline;
- links externos/projetos não são falsamente apresentados como disponíveis offline;
- caches têm versão/estratégia clara;
- atualização de cache é previsível;
- remover service worker/caches restaura comportamento web normal;
- instalação continua opcional.

## v7.0 — Qualidade e testes

Aceite:
- existe validação automatizada do registry;
- existem testes leves para funções críticas;
- quality gate roda antes do deploy;
- erro de teste impede deploy da nova versão;
- workflow continua legível e recuperável;
- testes não dependem dos projetos-filhos estarem editáveis.

## v8.0 — Linha do tempo e diagnóstico técnico

Aceite:
- linha do tempo distingue acesso local de atualização técnica;
- diagnóstico evita conclusões não suportadas;
- indisponibilidade tem explicação/fallback;
- origem de cada dado exibido é identificável;
- painel não vira mural de métricas;
- nenhum dado pedagógico é inventado.

## v9.0 — Hardening

Aceite:
- auditoria de acessibilidade realizada;
- navegação por teclado funcional;
- contraste/estados críticos revisados;
- chamadas externas minimizadas;
- tratamento de edge cases documentado;
- política de segurança frontend revisada;
- performance e payload revisados;
- código morto/duplicação reduzidos;
- mobile auditado em larguras pequenas e médias.

## v10.0 — Release estável

Aceite:
- todos os gates globais passam;
- todos os débitos críticos anteriores foram resolvidos ou explicitamente aceitos/documentados;
- auditoria especial v10 passa;
- documentação está consolidada;
- changelog cobre a evolução relevante;
- checkpoint está coerente;
- produção está publicada em 10.0.0;
- deploy final é `success`;
- processo é marcado `COMPLETE — v10.0.0`;
- nenhuma v11 é iniciada automaticamente.
