# Mudança de orçamento do App Shell — 2026-09-29

## Decisão

A partir da v28.0.0, o app shell da Central de Estudos pode ocupar até:

- **256 KiB bruto** (262.144 bytes);
- **80 KiB gzip** (81.920 bytes).

## Motivo

O aumento foi autorizado explicitamente para publicar um **Mentor dedicado como página filha da Central**, com recursos próprios de interface, decisão adaptativa, leitura dos contratos dos projetos, integração privada do TCE-GO e fallback offline separado.

O limite anterior de 144 KiB bruto / 48 KiB gzip foi adequado para a Home compacta, mas passou a impedir a publicação de uma experiência de Mentor completa sem cortes artificiais.

## Guardrails

- o aumento não autoriza dependências externas arbitrárias;
- nenhuma biblioteca pesada foi adicionada;
- OpenAI API continua ausente;
- projetos-filhos e seus conteúdos continuam fora do app shell;
- o quality gate continua calculando o tamanho real dos mesmos arquivos declarados em `APP_SHELL`;
- novo aumento exige nova autorização explícita.

## Resultado esperado

A Home continua leve visualmente, enquanto `/mentor/` recebe espaço próprio e permanece disponível no PWA. O service worker mantém fallback específico para a página do Mentor.
