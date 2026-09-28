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
- v27.4.1: **147.255 / 147.456 bytes brutos**, margem de 201 bytes; gzip **47.857 / 49.152 bytes**, margem de 1.295 bytes.
- Workflow de referência: #374, Quality gate e Pages Deploy aprovados; o limite original foi mantido.
- v27.4.2: **147.257 / 147.456 bytes brutos**, margem de 199 bytes; gzip **47.839 / 49.152 bytes**, margem de 1.313 bytes.
- A faixa P4 coube no mesmo teto; foi removida uma regra estreita duplicada, sem alterar o limite aprovado.
- Publicação: workflow #375 e artifact Pages `10980661883`, digest `sha256:cb295e1b343b837c964594be3c54e2d38eeeaa223049bb9929f4a26ccff116ad`.

## Controle futuro

Novas funcionalidades devem caber nos limites vigentes. Se o shell exceder qualquer deles, primeiro refatorar ou reduzir redundância. Uma nova elevação exige autorização explícita. Nenhum projeto-filho, página do Notion ou site de questões recebe escrita por causa desta decisão.


- v27.4.3: **147.304 / 147.456 bytes bruto**, margem de 152 bytes; gzip **47.924 / 49.152 bytes**, margem de 1.228 bytes. A descrição do manifesto passou a incluir o PRF e a Plataforma de Questões sem elevar os limites.

## v27.6.0 — registro local de estudo

- Payload medido no Quality gate: **146.207 / 147.456 bytes bruto**; **46.623 / 49.152 bytes gzip** (margens de 1.249 e 2.529 bytes).
- O formulário, a lista e os resumos do registro ficam no app shell, para permitir lançamentos offline.
- Os módulos de hidratação de Radar/Mentor e os controles avançados do catálogo permanecem referenciados no HTML e disponíveis pela rede, mas não são pré-cacheados nesta versão. Sites de projetos e serviços externos continuam fora do cache.
- Nenhum teto foi elevado. A alteração mantém os limites autorizados e passa pelo Quality gate local.
