# Roadmap v23 — Hoje + Radar + Mentor

## Registro da esteira
- **Major:** 23.0.0
- **Estado:** IN_PROGRESS
- **Stage:** VALIDATING
- **Versão de origem:** 22.0.0.
- **Versão terminal:** 23.0.0.
- **Active major:** 23.0.0.
- **Next major:** none.
- **Projetos externos:** READ-ONLY.

## Objetivo
Fazer a Central orientar melhor a execução diária sem assumir responsabilidade pedagógica dos projetos.

## Escopo
1. Renomear e recalibrar a entrada como **Hoje**.
2. Tornar a ação publicada do foco uma diretriz explícita de execução.
3. Declarar quando não existe próxima ação publicada.
4. Evoluir a leitura multi-projeto para **Radar operacional**.
5. Evoluir o roteamento explicável para **Mentor de execução**.
6. Dar acesso rápido ao Mentor pela Home e Command Palette.
7. Preservar todos os contratos read-only, histórico, Views, preferências, PWA e links diretos.

## Restrições
- zero writes nos projetos-filhos;
- sem ranking, score, probabilidade, progresso inventado ou troca automática de foco;
- sem backend, telemetria ou nova dependência;
- shell <= 131.072 bytes;
- quality gate antes do deploy.

## Regra terminal
Executar somente v23.0.0. Fechar após quality + deploy + auditoria. Não iniciar v24.
