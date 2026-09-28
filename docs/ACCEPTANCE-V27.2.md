# Aceitação v27.2.0 — frases do Major Cadar

**Publicação final:** v27.2.1 · commit `ce5288686fc8d8d60e504455721653ef5cb6a260` · workflow `36369866365` — SUCCESS.

- [x] Seis dias consecutivos exibem seis frases diferentes, em ordem estável pelo calendário de Brasília.
- [x] Toda frase mostra “Major Cadar” e um link HTTPS para a origem associada àquela frase.
- [x] O rótulo da área deixa explícito que é uma frase do Major Cadar relacionada à mentalidade de estudo.
- [x] A frase, a autoria e a fonte do fallback são coerentes sem JavaScript.
- [x] A atualização não adiciona chamadas externas e o relógio continua mostrando segundos de Brasília.
- [x] `node tests/quality.mjs` passa localmente, inclusive sintaxe, segurança, acessibilidade, regressões e orçamento do app shell.
- [x] Quality gate e GitHub Pages Deploy passam.
- [x] QA visual publicado confirma frase, autoria, origem e ausência de overflow desktop.
- [x] QA móvel segue com a limitação de viewport já documentada se o navegador continuar sem emulação móvel.

- [x] O selo do painel Hoje exibe a mesma versão do header, registry, runtime e cache PWA (incluído no patch v27.2.1).
