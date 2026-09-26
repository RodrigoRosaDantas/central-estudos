# CHANGELOG — Central de Estudos

## [2.0.0] — 2026-09-26
- consolidada a shell da Central sem alterar projetos-filhos;
- hierarquia ajustada para foco → retomada → ambientes → estado técnico;
- armazenamento local passou a ser acessado de forma defensiva;
- preferências legadas, inválidas ou corrompidas passam a degradar com segurança;
- registry dinâmico ganhou validação estrutural e HTTPS antes da renderização;
- adicionado modo degradado explícito preservando os acessos estáticos;
- README foi limpo para remover duplicação de governança;
- **Riscos/limitações:** validação visual real depende do navegador do usuário; observabilidade avançada/rate limit permanece escopo de v3;
- **Projetos-filhos:** zero writes nesta release;
- **Commit/deploy final:** preencher após validação do Pages.

## [1.4.0] — 2026-09-26
- foco escolhível localmente;
- foco separado de último acesso;
- observabilidade pública dos repositórios;
- deploy GitHub Pages validado;
- projetos-filhos mantidos independentes.
- **Deploy validado:** workflow run 36263567239 — success.

## [1.3.0] — 2026-09-26
- pulso global;
- disponibilidade por ambiente;
- última publicação técnica pública;
- cache local de metadados.

## [1.2.0] — 2026-09-26
- separação entre foco e retomada;
- experiência de retomada;
- 404 própria;
- melhorias mobile.

## [1.1.0] — 2026-09-26
- fallback resiliente;
- health check;
- manifest/ícone;
- melhorias de acessibilidade.

## [1.0.0] — 2026-09-26
- fundação da Central;
- registry dos três ambientes;
- navegação inicial;
- arquitetura desacoplada.
