# AUDIT PROTOCOL — Central de Estudos

## 1. PRECHECK

Antes de qualquer write:
- ler checkpoint;
- ler versão do registry;
- ler roadmap e acceptance da major;
- identificar commit HEAD atual da Central;
- identificar último deploy Pages;
- registrar HEAD SHAs dos 3 projetos-filhos;
- confirmar que não existe major anterior incompleta.

## 2. CONSISTENCY GATE

Conferir se concordam:
- `config/projects.json`;
- README;
- checkpoint;
- changelog;
- versão publicada conhecida.

Se houver divergência material:
- não iniciar nova major;
- reconciliar primeiro;
- marcar `BLOCKED` quando necessário.

## 3. STATIC QA

Validar:
- HTML;
- caminhos de CSS/JS;
- JavaScript sintaticamente válido;
- JSON;
- manifest;
- registry;
- IDs únicos;
- HTTPS;
- presença dos três projetos;
- fallback;
- 404;
- ausência de secrets;
- arquivos órfãos/duplicações evidentes.

## 4. BEHAVIOR QA

Validar logicamente:
- foco;
- retomada;
- limpar histórico;
- preferências locais;
- fallback quando config falha;
- estado de health check;
- observabilidade inconclusiva;
- links diretos;
- estados vazios;
- controles desabilitados;
- mobile-first.

Quando não for possível renderizar navegador real, não invente resultado visual. Registre a limitação e use validações estruturais disponíveis.

## 5. PROJECT-CHILD GUARD

Antes e depois, ler HEAD de:
- TCE-GO;
- SEEDF;
- TJDFT.

Também revisar o log de operações da execução:
- deve haver zero write nesses repositórios.

Se HEAD mudar por ação externa, registrar como externo.
Se houve write indevido na execução, bloquear avanço e corrigir/reverter.

## 6. DEPLOY QA

Depois dos testes locais/estruturais:
- disparar/aguardar Pages;
- verificar workflow;
- verificar job;
- verificar steps;
- se falhar, ler logs;
- corrigir;
- repetir até success ou bloquear.

## 7. POST-DEPLOY QA

Após `success`:
- confirmar URL de ambiente produzida pelo deploy quando disponível;
- confirmar que o artefato corresponde ao commit final;
- revalidar arquivos críticos na main;
- conferir coerência da versão.

## 8. ROLLBACK POLICY

Rollback/reversão é preferível quando:
- navegação principal quebra;
- fallback quebra;
- registry quebra;
- Pages não estabiliza após correção mínima;
- nova arquitetura cria regressões múltiplas;
- correções sucessivas aumentam risco.

Último estado validado vem do checkpoint/changelog.

## 9. RELEASE RECORD

Só depois dos gates:
- atualizar changelog;
- atualizar checkpoint;
- registrar commit final;
- registrar run/deploy;
- marcar major concluída.

## 10. v10 FINAL AUDIT

Executar checklist integral de:
- arquitetura;
- UX;
- mobile;
- desktop;
- acessibilidade;
- performance;
- frontend security;
- PWA;
- cache/offline;
- observabilidade;
- rate limit;
- fallback;
- 404;
- documentação;
- código morto;
- workflow;
- recuperação;
- projetos-filhos;
- changelog/checkpoint.

Qualquer falha crítica impede `COMPLETE`.
