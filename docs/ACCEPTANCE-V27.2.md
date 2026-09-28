# Aceitação v27.2.0 — frases do Major Cadar

- [ ] Seis dias consecutivos exibem seis frases diferentes, em ordem estável pelo calendário de Brasília.
- [ ] Toda frase mostra “Major Cadar” e um link HTTPS para a origem associada àquela frase.
- [ ] O rótulo da área deixa explícito que é uma frase do Major Cadar relacionada à mentalidade de estudo.
- [ ] A frase, a autoria e a fonte do fallback são coerentes sem JavaScript.
- [ ] A atualização não adiciona chamadas externas e o relógio continua mostrando segundos de Brasília.
- [ ] `node tests/quality.mjs` passa localmente, inclusive sintaxe, segurança, acessibilidade, regressões e orçamento do app shell.
- [ ] Quality gate e GitHub Pages Deploy passam.
- [ ] QA visual publicado confirma frase, autoria, origem e ausência de overflow desktop.
- [ ] QA móvel segue com a limitação de viewport já documentada se o navegador continuar sem emulação móvel.
