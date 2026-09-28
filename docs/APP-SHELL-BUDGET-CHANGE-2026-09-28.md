# Revisão do orçamento do app shell — 2026-09-28

**Decisão:** o usuário autorizou atualizar formalmente o teto após a reauditoria.  
**Escopo:** linha pós-v20 da Central de Estudos; os registros históricos v16→v20 preservam seus valores originais.  
**Repositório afetado:** somente `RodrigoRosaDantas/central-estudos`.

## Limites vigentes

- App shell bruto: **147.456 bytes (144 KiB)**.
- Soma dos arquivos individualmente gzipados: **49.152 bytes (48 KiB)**.
- A medição cobre os 23 recursos únicos declarados em `APP_SHELL`, sem contar a entrada de diretório `./`.
- O Quality gate (`tests/quality.mjs`) bloqueia qualquer valor acima desses limites.

O teto anterior de **131.072 bytes (128 KiB)** continua correto para o fechamento histórico da geração v16→v20. Para a linha posterior, o teto de 144 KiB foi autorizado explicitamente em 28/09/2026 e não representa autorização para novas elevações automáticas.

## Evidência da release atual

- v27.2.1: **144.728 / 147.456 bytes brutos**, margem de 2.728 bytes.
- Soma gzip: **46.607 / 49.152 bytes**, margem de 2.545 bytes.
- O gate mede todos os recursos versionados do PWA, incluindo HTML, ícone, manifesto, registry, scripts e folhas CSS.

## Controle futuro

Novas funcionalidades devem caber nos limites vigentes. Se o shell exceder qualquer deles, primeiro refatorar ou reduzir redundância. Uma nova elevação exige autorização explícita. Nenhum projeto-filho, página do Notion ou site de questões recebe escrita por causa desta decisão.
