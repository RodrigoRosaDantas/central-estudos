# Ponte federada read-only da Central

## Objetivo

A Central continua sem banco mestre e sem escrever nos projetos-filhos. A ponte federada acrescenta uma camada de resiliência entre os contratos públicos dos projetos e a interface da Central.

## Fluxo

1. Cada projeto continua sincronizando o próprio Notion e publicando o próprio estado sanitizado.
2. O workflow `.github/workflows/sync-integrations.yml` roda a cada 30 minutos e também pode ser executado manualmente.
3. Os cinco Repository Secrets são usados somente dentro do GitHub Actions para validar que a integração do Notion responde; nenhum valor de token, identidade do bot ou conteúdo privado é publicado.
4. A Central lê os contratos públicos de SEEDF, TJDFT e PRF ADM e os estados públicos mínimos da Plataforma de Questões e do Plano de Transição.
5. O resultado sanitizado fica em `data/federated-status.json`.
6. O consumidor de contratos continua tentando primeiro o contrato vivo do projeto. O snapshot federado só entra como último estado conhecido quando o contrato direto e o cache local não estão disponíveis.

## Secrets esperados

- `SEEDF`
- `TJDFT_NOTION_TOKEN`
- `PRF_ADM_GITHUB`
- `PLATAFORMA_DE_QUESTOES`
- `PLANO_DE_TRANSICAO_GITHUB`

Os nomes são referências do workflow. O conteúdo nunca deve ir para JavaScript, HTML, JSON público ou logs.

## Limites

A ponte não confirma estudo por conta própria, não cria horas, não altera Notion, não altera projetos-filhos e não transforma disponibilidade técnica em desempenho pedagógico.
