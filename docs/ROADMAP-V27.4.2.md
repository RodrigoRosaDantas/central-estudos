# Roadmap v27.4.2 — prioridade P4 do PRF

**Release:** 27.4.2  
**Stage:** PUBLISHED  
**Escopo:** registrar o PRF Administrativo como P4 na agenda semanal da Central e direcionar o acesso ao site publicado no GitHub Pages.

## Objetivos

1. Manter SEEDF (P1), TJDFT (P2) e TCE-GO (P3), acrescentando PRF Administrativo (P4).
2. Atualizar a faixa de prioridades e o destaque do PRF com link direto para seu site.
3. Preservar as sessões de segunda, quarta e sexta, a sequência PRFADM01–PRFADM30 e a fonte de verdade Notion.
4. Refluir a faixa para duas colunas em telas abaixo de 720 px.
5. Renovar o app shell/PWA sem elevar o teto aprovado de 147.456 bytes bruto e 49.152 bytes gzip.
6. Preservar o foco padrão TCE-GO e a separação entre status de atividade e prioridade semanal.

## Verificação

- O Quality gate confere ordem, destino do P4, agenda semanal, foco padrão e versionamento do cache.
- Quality gate local e workflow #375 concluíram; o Pages Deploy publicou o commit `41ba121b0d83d09104cbacb1d2f7fef36289a6ca`.
- O código publicado confirma v27.4.2, PRF P4, link Pages e TCE-GO como foco padrão.
- O shell permaneceu sob os limites autorizados de 147.456 bytes bruto e 49.152 bytes gzip.
