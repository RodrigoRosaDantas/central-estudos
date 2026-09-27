# Roadmap v24 — seis telas da Central

**Release:** 24.0.0  
**Stage:** IN PROGRESS

## Objetivo

Transformar a Central v23 em um espaço de trabalho com seis telas claras, retomada semanticamente confiável e acesso visível às views locais.

## Escopo

1. Navegação principal por Hoje, Retomada, Projetos, Inbox, Histórico e Evolução, com hash direto e estado ativo persistido localmente.
2. Tela Retomada com foco escolhido separado do último acesso; explicitar que navegação não significa estudo.
3. Projetos combina catálogo de acessos e Workspace com ativos, arquivados e futuros.
4. Inbox recebe toolbar, filtro por tipo e projeto e lista próprios; Radar permanece completo e independente desses filtros.
5. Evolução agrupa Radar, Mentor, preferências e diagnóstico técnico.
6. Views locais passam a guardar tela atual; views anteriores sem tela continuam compatíveis e abrem em Hoje. Lista visível permite abrir/excluir.
7. Atualizar shell/PWA, documentação, testes e auditoria de payload após fechar a implementação.

## Limites

- Apenas `RodrigoRosaDantas/central-estudos`; não gravar nos repositórios-filhos.
- Nenhuma chamada de rede nova; sem alteração em GET read-only dos contratos.
- Não inferir estudo, avanço, ranking, prioridade ou recomendação automática.
- Foco segue escolhido pelo usuário; última visita registra navegação local.
- Preservar fallback sem JavaScript, âncoras legadas e budget de 128 KiB.

## Critérios de encerramento

- Quality gate passa, incluindo regressões v10→v23 e os contratos v24.
- Cada tela pode ser aberta diretamente por hash, em desktop e mobile.
- Inbox aplica filtros sem ocultar o conjunto do Radar.
- Views antigas e novas são aceitas e backup permanece allowlisted.
- Nenhum write em projeto-filho; workflow Quality e Deploy SUCCESS.
- Auditoria final registra commit, run, artifact/digest e tamanho dentro do limite.
