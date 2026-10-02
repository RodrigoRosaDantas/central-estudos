# Auditoria da Central — v28.6.3

Data: 02/10/2026. Escopo: Central publicada no GitHub Pages, repositório `RodrigoRosaDantas/central-estudos`.

## Base conferida

- Central `main`: `ef5c48b1b7e7f255f7cf395d17134e593a6ccdf3`, versão 28.6.2.
- Última execução Pages da base: `36882379308`, concluída com sucesso.
- Carteira corrente: SEEDF P1, TJDFT P2 e PRF Administrativo P3. TCE-GO e SEDES permanecem arquivados.
- A fonte anexada de 29/09 descreve uma versão anterior; a auditoria preserva a carteira atual do registry publicado.

## Problemas corrigidos

| Problema observado | Correção |
| --- | --- |
| Lançamento automático lia apenas IDs ativos antes de salvar, descartando blocos históricos de projetos arquivados. | Leitura e gravação preservam todos os IDs conhecidos; somente os ativos podem gerar novos blocos automáticos. |
| Cortar um timestamp UTC em `YYYY-MM-DD` podia marcar estudo no dia errado em Brasília. | Parser compartilhado usa `America/Sao_Paulo`; mantém data explícita e rejeita valor inválido ou sem fuso. |
| Listener de storage do Mentor referenciava uma constante removida. | Atualização entre abas usa as chaves reais de horas e foco. |
| Mentor não recalculava grade e registros quando a página permanecia aberta durante a virada do dia. | Relógio detecta mudança do dia de Brasília e solicita uma atualização. |
| Totais ativos aceitavam blocos não confirmados, datas impossíveis e durações acima de 24h. | Mesmas restrições do registro de estudo aplicadas ao Mentor e ao resumo diário, sem alteração do histórico salvo. |
| Mentor carregava JS e registry com versões diferentes das entradas do shell offline. | URLs efetivas e cache coincidem; helper de datas e registro de horas também são versionados. |
| Fallback da SEEDF dizia Edital publicado apesar do registry Pré-edital. | Fallback alinhado à fonte corrente. |
| Navegação da Central e rótulos do Mentor eram pequenos; cartões de fontes provocavam overflow em 320px. | Navegação em duas linhas abaixo de 360px, rótulos ampliados, grades com largura mínima zero e cartões empilhados no celular. |

## Validação anterior à publicação

- `node tests/quality.mjs`: PASS após as alterações de lógica; execução final também inclui os ajustes de CSS e documentação.
- Regressões executadas: preservação de TCE-GO/SEDES e registros manuais, repetição sem duplicação, timestamps nos dois lados da meia-noite de Brasília, datas impossíveis/ambíguas, storage entre abas e mudança de dia no Mentor.
- Referências internas, HTML, IDs, JSON, manifest, sintaxe, regras de evidência, orçamento do shell, isolamento de origem e verificação de segredos incluídos no quality gate existente.
- Navegador real: Home e Projetos em 320/390px; Mentor em 320/390px, abas por clique e por teclado, arquivos históricos acessíveis. Mentor carregado em 320px mede 305px úteis e 305px de conteúdo, sem rolagem lateral.
- Conferência desktop do site base: navegação Hoje/Projetos/Radar e leitura dos contratos públicos dos três projetos.
- Cache offline: correspondência exata das dependências verificada automaticamente. Não foi simulada perda de conexão no navegador; não há alegação de teste offline real.
- Dados de estudo e conclusões não foram criados durante a auditoria. PRF continua separando produção editorial de sessões estudadas; leitura/D0 pendentes da SEEDF continuam pendentes.

## Guarda dos projetos de origem

| Repositório | HEAD anterior |
| --- | --- |
| seedf-ppge-dashboard | `01d5363fc3e08179ab0cc6632c71567f2bb10fb4` |
| tjdft-dashboard | `fbecaa2770a7c6641c383148db0413056ad12874` |
| prf-administrativo-dashboard | `c3d22dbccd49234f487702494a2187ab2d84885a` |
| tce-go-dashboard | `db9b47956433b73b40477e2a2e76daee8d463372` |

Operações de escrita nesses repositórios: zero. Não houve escrita em Notion nem no banco da sincronização opcional.

## Publicação

Publicação validada após a conclusão dos gates e a conferência do endereço público:

- PR: [48](https://github.com/RodrigoRosaDantas/central-estudos/pull/48), integrada por squash.
- Commit de código: `de0aa5c7ececea5dd246e3b0b932f1420c1d3b9a`.
- Quality gate da PR: execução `37027283309`, sucesso; step da suíte concluído com sucesso.
- Pages em `main`: [execução 37027433233](https://github.com/RodrigoRosaDantas/central-estudos/actions/runs/37027433233), sucesso nos jobs Quality gate e Deploy e no step Deploy to GitHub Pages.
- Artefato `github-pages`: ID `11235826606`, vinculado ao mesmo commit de código.
- Home pública: versão 28.6.3, foco SEEDF, grade P1–P3 e ausência de overflow desktop (1348px úteis = 1348px de conteúdo).
- Mentor público: versão 28.6.3, três fontes carregadas, próxima etapa TJDFT P03 e informações da SEEDF/PRF preservadas. Sem erro da aplicação nos logs observados; eventos de metadata da extensão do navegador não pertencem ao site.
- Atualização da PWA oferecida e aplicada com sucesso no navegador de conferência. O teste offline permanece estrutural, sem simulação de perda de rede.
- HEADs posteriores dos quatro repositórios de origem iguais aos HEADs anteriores; zero escrita nos sites-filhos.

Checkpoint: `docs/V28.6.3-CHECKPOINT.md`. O registro foi escrito somente após confirmar publicação e comportamento público.
