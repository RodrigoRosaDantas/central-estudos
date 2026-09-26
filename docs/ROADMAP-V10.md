# ROADMAP — Central de Estudos até v10

Estado de partida registrado: **v1.4.0**

Este roadmap define objetivos de maturidade, não uma lista rígida de features. Cada etapa deve respeitar o estado real do repositório.

## v2.0 — Fundação de produto consolidada

Objetivo: transformar a base 1.x em uma shell estável.

Prioridades:
- revisão completa da hierarquia mobile/desktop;
- navegação e estados vazios;
- preferências locais bem delimitadas;
- consistência visual;
- fallback e 404;
- documentação técnica mínima;
- auditoria de regressões acumuladas da série 1.x.

## v3.0 — Observabilidade confiável

Objetivo: a Central explicar o estado técnico dos ambientes sem acoplamento.

Prioridades:
- disponibilidade;
- frescor técnico;
- deploy/status quando publicamente acessível;
- tratamento de rate limit e falhas de rede;
- cache e stale-while-revalidate quando útil;
- diferenciação explícita entre dado técnico e dado de estudo.

## v4.0 — Catálogo operacional

Objetivo: melhorar a escolha e o acesso aos ambientes.

Prioridades:
- busca/filtro quando fizer sentido;
- ordenação e favoritos locais;
- foco/retomada/recência claramente separados;
- atalhos de teclado/desktop sem sacrificar mobile;
- ações rápidas sem duplicar dashboards.

## v5.0 — Personalização local

Objetivo: adaptar a Central ao usuário sem backend.

Prioridades:
- preferências persistentes locais;
- modo compacto/confortável;
- ordem dos ambientes;
- preferências de apresentação;
- reset seguro;
- nenhuma informação sensível.

## v6.0 — PWA e resiliência

Objetivo: melhorar uso no celular e tolerância a falhas.

Prioridades:
- service worker seguro;
- app shell offline;
- estratégia de cache conservadora;
- atualização controlada de versão;
- instalação como app;
- nunca cachear estados que possam enganar sobre disponibilidade atual.

## v7.0 — Qualidade e testes

Objetivo: reduzir regressões.

Prioridades:
- validação automatizada do registry;
- testes leves para JavaScript crítico;
- checagem de links/configuração;
- quality gate no GitHub Actions;
- deploy somente após validações essenciais.

## v8.0 — Linha do tempo e diagnóstico técnico

Objetivo: tornar a Central mais consciente sem assumir lógica pedagógica.

Prioridades:
- atividade técnica recente dos três repositórios;
- histórico local de acessos;
- diagnóstico de indisponibilidade;
- explicação de origem dos dados;
- informações resumidas, não mural de métricas.

## v9.0 — Hardening

Objetivo: preparar release estável.

Prioridades:
- acessibilidade;
- performance;
- segurança de frontend;
- CSP/meta quando compatível;
- redução de chamadas;
- tratamento de edge cases;
- auditoria mobile extensa;
- limpeza de código e documentação.

## v10.0 — Release estável

Objetivo: fechar a evolução com uma Central madura e previsível.

Obrigatório:
- auditoria integral;
- nenhum acoplamento obrigatório;
- navegação funcional mesmo com integrações indisponíveis;
- documentação consolidada;
- checkpoint final;
- changelog das principais fases;
- versão 10.0.0 publicada;
- deploy final bem-sucedido;
- congelar a meta: não iniciar v11 automaticamente.

## Fora de escopo sem aprovação explícita

- editar TCE-GO;
- editar SEEDF;
- editar TJDFT;
- banco único;
- autenticação nova;
- Supabase compartilhado;
- importar lógica pedagógica;
- escrever nos dados dos projetos-filhos.
