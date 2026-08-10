# Rocha Decor Espumas — Landing Page

Landing page estática (HTML + CSS + JS puro, sem build) para a Rocha Decor
Espumas, distribuidora de espumas em Londrina - PR. Feita para ficar no
link da bio do Instagram: mostra o catálogo por densidade com faixas de
preço e leva o visitante para o WhatsApp.

## Rodar localmente

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000/`. Não abra `index.html` direto por
duplo clique — os módulos JS são bloqueados pelo navegador no protocolo
`file://`.

## Rodar os testes

```bash
node --test tests/*.test.js
```

Testa as funções puras em `js/utils.js` (link do WhatsApp, formatação de
preço, easing do contador). Não precisa de `npm install` — usa só o test
runner nativo do Node 18+. (Use o glob `tests/*.test.js`, não `tests/`
sozinho — em alguns ambientes Windows o Node tenta carregar `tests` como
módulo em vez de escanear a pasta.)

## Editar preços e densidades do catálogo

Edite `js/catalogo-data.js`. Cada item tem `densidade`, `uso`, `precoMin`,
`precoMax`, `unidade` e `mensagemWhatsApp`. Se adicionar ou remover uma
densidade, atualize também a lista dentro do `<noscript>` na seção
"Catálogo" em `index.html` (é o texto que aparece se o JavaScript não
carregar).

## Antes de publicar

Ver a lista de pendências em
`docs/superpowers/specs/2026-08-10-landing-page-rocha-decor-design.md`
(seção 10): logo real, fotos reais, preços reais, depoimentos reais,
horário de funcionamento e confirmação do handle do Instagram.

## Deploy (GitHub Pages)

No repositório no GitHub: Settings → Pages → Source → Deploy from a
branch → `main` → `/ (root)`. Nenhuma configuração de build é necessária.
