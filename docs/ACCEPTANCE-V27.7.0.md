# Critérios de aceitação v27.7.0

## Fluxo guiado

- [x] A semana mostra sete dias selecionáveis, com data e tempo local já registrado.
- [x] A seleção do dia mostra exatamente os projetos do cartão correspondente da grade vigente.
- [x] SEEDF, TJDFT, TCE-GO e PRF apresentam catálogos separados; TJDFT lista P01–P18, RL01–RL13 e REV01–REV06, e PRF lista PRFADM01–PRFADM33.
- [x] O sábado mantém revisões SEEDF/TJDFT e TCE-GO; domingo permanece protegido com D7/D20 somente se previstos.
- [x] Duração, assunto opcional e confirmação explícita continuam necessários para salvar um bloco.
- [x] Há entrada manual para estudo fora da grade e para datas passadas.
- [x] Totais acompanham o dia e a semana escolhidos; salvar/excluir/importar atualiza os totais locais.

## Integridade e compatibilidade

- [x] O log conserva `central-estudos:study-log-v1`, seu esquema e os backups JSON v1.
- [x] Selecionar uma atividade prevista não registra estudo, não avança a sequência e não escreve no Notion.
- [x] Catalogação marcada como fotografia de 28/09/2026; as fontes dos projetos continuam canônicas.
- [x] App shell permanece dentro do teto aprovado de 144 KiB bruto e 48 KiB gzip.
- [x] Recursos novos ficam no cache runtime da mesma origem e mantêm o caminho manual disponível quando não estão em cache.

## Liberação

- [x] `node tests/quality.mjs` no checkout local.
- [x] `git diff --check` sem problemas.
- [ ] Quality gate no GitHub Actions.
- [ ] Publicação Pages concluída.
- [ ] Inspeção visual no celular: dias, matérias, campos de tempo, checkbox e totais.
