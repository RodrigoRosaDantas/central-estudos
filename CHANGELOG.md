# CHANGELOG — Central de Estudos

## [4.0.0] — 2026-09-26
- catálogo operacional com busca local e ordenação por padrão, favoritos ou nome;
- favoritos persistidos somente no navegador e semanticamente separados de foco/retomada/recência;
- atalhos `Alt+1..9` para cards visíveis, desativados durante digitação em campos;
- controles responsivos/touch-friendly e progressive enhancement preservado;
- ação principal continua sendo abrir o projeto real; fallback estático preservado;
- **Riscos/limitações:** inspeção visual real da URL pública não ficou disponível nesta sessão; QA pós-deploy foi estrutural e pelo artefato/commit publicado;
- **Projetos-filhos:** zero writes; SHAs finais iguais ao preflight;
- **Commit de release validado:** `42ee59a34ebb34ecaa858da77b03646f25c21304`;
- **Deploy validado:** workflow run `36271496568` — success.

## [3.0.0] — 2026-09-26
- observabilidade confiável: disponibilidade, publicação e deploy separados;
- cache de 15 minutos, stale explícito e rate limit tratado;
- origem dos dados explicada; dado técnico não representa estudo;
- projetos-filhos mantidos somente leitura;
- commit de release validado: `dbc938e2b8eb32a9b3e126c464c5f1dfe82bea0c`;
- deploy validado: workflow run `36270559732` — success.

## [2.0.0] — 2026-09-26
- shell consolidada; hierarquia foco → retomada → ambientes → estado técnico;
- armazenamento local defensivo e registry validado antes da renderização;
- modo degradado preserva acessos estáticos;
- projetos-filhos sem writes;
- commit validado `e3cfacdf6e3784ca0236065cf34ac14c2900dd97`; deploy `36264383202` — success.

## [1.4.0] — 2026-09-26
- foco escolhível localmente; foco separado de último acesso; observabilidade pública; deploy validado `36263567239`.

## [1.3.0] — 2026-09-26
- pulso global; disponibilidade; última publicação técnica pública; cache local.

## [1.2.0] — 2026-09-26
- separação entre foco e retomada; experiência de retomada; 404; melhorias mobile.

## [1.1.0] — 2026-09-26
- fallback resiliente; health check; manifest/ícone; acessibilidade.

## [1.0.0] — 2026-09-26
- fundação da Central; registry; navegação inicial; arquitetura desacoplada.
