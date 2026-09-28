# Auditoria final — Central de Estudos v27.1.1

**Status:** PARCIAL — release funcional PASS; reauditoria encontrou desvio do teto bruto da fonte-mestra. QA móvel também permanece pendente.  
**Data:** 2026-09-28.  
**Código publicado:** [`864fb0410a845cacef53794a7061d2c6c7dd6182`](https://github.com/RodrigoRosaDantas/central-estudos/commit/864fb0410a845cacef53794a7061d2c6c7dd6182).  
**Workflow:** [36368493310 — Quality gate + Pages Deploy SUCCESS](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/36368493310).  
**Artefato Pages:** `10948247167`, 127.735 bytes, digest `sha256:a35952ca77442ac02a9d5461a882164f872ad4ea41863cfcf2e7356e7d940eff`.

## Escopo conferido

- PRF Administrativo está no registry como projeto ativo, com link para o plano `app.notion.com`, prioridade normal (sem número), elegível a foco local e sem repositório/status GitHub.
- A Central não envia health check ao PRF, não consulta seus contratos nem afirma que leu o conteúdo ou mediu execução. A trilha na agenda continua complementar e SEEDF (P1), TJDFT (P2), TCE-GO (P3) permanecem na mesma ordem.
- Plataforma de Questões aparece em seção própria com link direto, fora do registry, da contagem de projetos, do filtro de concursos e dos sinais técnicos.
- Os acessos aos quatro projetos e à ferramenta continuam disponíveis no fallback HTML sem JavaScript. Nenhum projeto-filho, página Notion, site de questões ou Work Sites foi alterado.

## Erros encontrados e corrigidos

1. **O teste de orçamento PWA omitia parte do app shell.** O gate agora deriva os 23 arquivos diretamente de `APP_SHELL` e mede bruto e gzip para cada arquivo, incluindo 404, ícone, registry e estilos v26/v27.
2. **A validação aceitava qualquer domínio HTTPS para um destino Notion.** O registry agora exige o host `app.notion.com`; o teste rejeita `notion.so` e outros hosts.
3. **O CTA do PRF quebrava a seta para uma linha isolada.** QA visual levou ao rótulo compacto “Abrir no Notion →”, que cabe numa linha junto do botão de foco.
4. **A correção visual precisava chegar ao PWA instalado.** Cache do service worker e URLs do runtime/registry foram renovados para v27.1.1.

## Verificação técnica

- `node tests/quality.mjs`: PASS localmente e no job **Quality gate** do workflow 36368493310. O gate também cobre sintaxe, regressões históricas, segurança, referências locais, acessibilidade, destinos, foco, fallback, separação entre projetos/ferramenta e cache PWA.
- Job **Deploy** e etapa `Deploy to GitHub Pages`: SUCCESS no mesmo workflow.
- App shell: **23 recursos**, 144.642 bytes brutos (limite 147.456) e soma gzip de 46.807 bytes (limite 49.152).
- Site publicado em [central-estudos](https://rodrigorosadantas.github.io/central-estudos/): DOM confirma V27.1.1, quatro projetos, ação Notion correta, card da Plataforma de Questões e seus dois links.
- QA visual no viewport 1363×936 (largura útil do documento 1348 px): sem overflow horizontal; CTA do PRF com 22 px de altura, sem quebra; card da ferramenta separado e completo.
- Registro visual desktop salvo como `central-estudos-v27.1.1-projects-tools.jpg`.

## Reauditoria contra a fonte-mestra — 2026-09-28

A fonte-mestra fornecida pelo usuário mantém o teto bruto do app shell em **131.072 bytes**. O artefato desta release foi medido em **144.642 bytes**, excedendo esse teto em **13.570 bytes**. O quality gate usado na publicação permite 147.456 bytes, portanto o PASS original não comprova conformidade com a fonte-mestra. A soma gzip de 46.807 bytes continua abaixo de 49.152 bytes, mas não substitui o limite bruto.

O comportamento de PRF, da Plataforma de Questões e a publicação não mostraram falha funcional nesta reauditoria. A correção do excesso bruto exige recuperar pelo menos 13.570 bytes sem apagar conteúdo autorizado; a auditoria não declara esse critério concluído.

## Limite

O navegador desta sessão não expõe viewport móvel nem emulação responsiva. A inspeção visual mobile fica pendente; regras e contratos CSS para telas estreitas continuam cobertos pelo Quality gate, mas isso não substitui QA visual real em celular.
