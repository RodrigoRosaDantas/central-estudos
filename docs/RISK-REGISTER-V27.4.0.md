# Riscos v27.4.0

| Risco | Mitigação | Estado |
|---|---|---|
| O painel do GitHub é um snapshot, não a fonte de progresso | Manter link direto ao Notion, identificado pelo próprio painel como fonte de verdade | Coberto |
| A Central pode confundir disponibilidade técnica com execução de estudo | Não adicionar statusUrl; mostrar somente disponibilidade, metadados do repositório e workflow de publicação | Coberto por teste |
| Uma URL Notion inválida poderia aparecer como link | Validar HTTPS e host app.notion.com antes de renderizar | Coberto por teste |
| Cache PWA instalado poderia continuar com o destino antigo | Renovar versão do app shell e URLs do runtime/registry | Resolvido; deploy v27.4.0 publicado |
| App shell exceder o limite autorizado | Medir os recursos listados em APP_SHELL e manter o teto de 147.456 bytes bruto e 49.152 bytes gzip | Resolvido; 147.300 bytes bruto e 47.887 bytes gzip |
| Workflow ou publicação da Central falhar | Exigir Quality gate antes do deploy e conferir a URL pública | Resolvido; workflow `36437885787` passou e QA público confirmou |
