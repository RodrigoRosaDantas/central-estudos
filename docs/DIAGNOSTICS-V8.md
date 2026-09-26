# Linha do tempo e diagnóstico — v8

A v8 adiciona consciência temporal sem transformar a Central em um sistema de acompanhamento pedagógico.

## Fontes separadas

### Acesso local
Origem: eventos de abertura pela própria Central neste navegador.

O histórico:
- fica somente em `localStorage`;
- usa a chave `central-estudos:access-history-v8`;
- guarda no máximo 12 registros;
- exibe até 5 registros recentes;
- é apagado junto com o comando **Limpar histórico**;
- não mede duração, estudo, progresso ou desempenho.

### Atividade técnica
Origem: sinais já coletados pela camada de observabilidade:
- disponibilidade do site;
- publicação técnica pública do repositório;
- estado do deploy público quando identificável.

A v8 não faz novas chamadas de rede para montar a linha do tempo técnica.

## Diagnóstico

O diagnóstico descreve somente o que foi observado.

Exemplos:
- resposta técnica confirmada;
- resposta com erro;
- verificação inconclusiva;
- dado em cache;
- deploy público conhecido com falha.

A Central não atribui causa a uma indisponibilidade. Rede, timeout ou política do navegador são apresentados apenas como possibilidades de uma checagem inconclusiva.

Uma falha de deploy também não é convertida automaticamente em indisponibilidade do site.

## Escopo

O painel mostra:
- acessos recentes neste aparelho;
- sinais técnicos dos projetos;
- fonte de cada tipo de dado;
- diagnóstico curto e conservador.

Ele não cria:
- contadores de estudo;
- horas estudadas;
- desempenho;
- progresso;
- pontuação;
- ranking;
- recomendação pedagógica.

A linha do tempo é uma camada de contexto operacional, não um dashboard de métricas.
