# Roadmap v27.6.0 — registro diário de estudo

**Release:** 27.6.0  
**Stage:** LOCAL_VALIDATED  
**Escopo:** medir horas estudadas informadas por projeto, trilha e tópico sem mudar o cronograma semanal.

## Entrega

1. Registrar cada bloco com data, projeto, trilha/matéria, tópico opcional, horas e minutos e confirmação explícita.
2. Mostrar totais do dia e da semana, além de resumos semanais por projeto e por tópico.
3. Permitir excluir um lançamento recente e exportar/restaurar backup JSON.
4. Guardar dados somente neste navegador e informar que não há sincronização com Notion ou outros dispositivos.
5. Preservar a grade, projetos, prioridades P1–P4, foco e o teto aprovado do shell offline.

## Limites

- Nenhuma sessão ou duração é inferida; lançamentos não medem domínio, desempenho ou progresso.
- Nenhuma escrita em projeto-filho ou no Notion; sem backend ou nova chamada de rede.
- O registro local permanece no shell offline. A interface de estado operacional publicada e os controles avançados do catálogo carregam pela rede.

## Verificação

- `node tests/quality.mjs` passa localmente.
- QA de navegador, CI, deploy e inspeção publicada serão registrados na auditoria final.
