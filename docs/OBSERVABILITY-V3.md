# Observabilidade v3

A Central usa observabilidade somente leitura.

- disponibilidade: tentativa técnica de acesso ao site;
- publicação técnica: metadado público do repositório;
- deploy: workflow público de Pages/deploy, quando identificável;
- cache local: 15 minutos;
- falha de rede: estado inconclusivo;
- dado antigo preservado: marcado como stale-cache;
- rate limit: tratado sem bloquear navegação;
- publicação técnica não representa estudo, progresso ou desempenho;
- deploy é buscado em até 100 runs, priorizando deploy-pages.yml;
- qualquer falha de API degrada para “não verificado”.

Nenhum desses sinais pode impedir o acesso aos projetos.
