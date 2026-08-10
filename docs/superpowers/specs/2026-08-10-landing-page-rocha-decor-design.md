# Landing Page — Rocha Decor Espumas

- **Data:** 2026-08-10
- **Status:** Aprovado pelo usuário, pronto para plano de implementação

## 1. Visão e objetivo

Landing page única (one-page) para a Rocha Decor Espumas, distribuidora de espumas em Londrina - PR. O link vai para a bio do Instagram (@rochadecorespumas). Objetivo único: visitante entende rapidamente o que a empresa vende, vê uma faixa de preço por densidade de espuma, e é levado a mandar mensagem no WhatsApp. Não é e-commerce (sem carrinho, sem checkout, sem login).

### Contexto do negócio (extraído do Instagram)

- Nome: Rocha Decor | Distribuidora de Espumas em Londrina
- Marca da espuma distribuída: **Pró-Relax** (confirmado pelo usuário; a grafia "Pró-Rolex" vista em um post é inconsistência do próprio Instagram e não deve ser usada no site)
- Mais de 30 anos de experiência no mercado
- Preços especiais para tapeceiros, estofadores e revendedores
- Cortes sob medida
- Endereço: Rua Ruy Virmond Carnascialli, 791, Jardim Leonor, Londrina - PR
- WhatsApp: `5543984888884` (wa.me/5543984888884)
- Instagram: @rochadecorespumas (assumido a partir do nome do repositório/bio truncada — **confirmar handle exato antes de publicar o link no footer**)
- Identidade visual existente: fundo preto, dourado como cor de destaque, tipografia forte/premium (ver logo fornecido)

### Público-alvo

Primariamente B2B/profissional (tapeceiros, estofadores, revendedores) comprando espuma bruta por densidade; secundariamente consumidor final fazendo reforma/DIY. O catálogo do site é focado em **espuma bruta por densidade** (não produtos acabados como colchões prontos).

### Não-objetivos (fora de escopo)

- Sem carrinho/checkout, sem processamento de pagamento
- Sem formulário de contato (WhatsApp é o único canal de conversão)
- Sem CMS/backend — site 100% estático
- Sem múltiplas páginas — tudo em uma página com navegação por âncora
- Sem login/área do cliente

## 2. Arquitetura técnica

Site estático puro (HTML + CSS + JS vanilla), sem build step, sem frameworks, sem dependências externas. Compatível com GitHub Pages sem qualquer configuração adicional.

```
/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js            # interações: menu, scroll reveal, contador, smooth scroll
│   └── catalogo-data.js   # dados do catálogo (fonte única de verdade para preços)
├── assets/
│   ├── img/                # logo, hero, depósito, fotos — placeholders no primeiro momento
│   └── icons/               # favicon, ícones svg inline ou arquivos
└── README.md
```

**Alternativas consideradas e descartadas:**
- Tudo em um único arquivo HTML (CSS/JS inline): mais "portátil", mas dificulta manutenção e não separa preocupações.
- Partials HTML carregados via `fetch()`: mais modular, mas exige servidor HTTP mesmo para preview local (quebra abrir com duplo clique) e adiciona complexidade sem necessidade real numa página só.

Estrutura de 3 pastas foi escolhida por ser simples, manter cache de CSS/JS separado, e não exigir nenhuma configuração de build ou hospedagem.

## 3. Mapa do site / seções (ordem final)

Ordem otimizada para conversão: mostra valor e preço logo no início, depois reforça confiança institucional.

1. **Header fixo (sticky)** — logo, nav por âncora (Início, Diferenciais, Catálogo, Como Funciona, Quem Somos, Depoimentos, Onde Estamos), botão "Falar no WhatsApp" sempre visível, menu hambúrguer no mobile.
2. **Hero** — headline de impacto + subheadline (30+ anos, foco tapeceiros/revendedores/consumidor final), CTA primário (WhatsApp) e secundário ("Ver catálogo", scroll para seção 4), contador animado (+30 anos de experiência), imagem/placeholder de fundo (pilhas de espuma) com overlay escuro/dourado.
3. **Diferenciais** ("Por que escolher a Rocha") — 4 cards com ícone: +30 anos de mercado; cortes sob medida; preços especiais para revendedores e tapeceiros; distribuidor oficial Pró-Relax.
4. **Catálogo por densidade** — grid responsivo de cards (uma por densidade). Cada card: nome da densidade, uso sugerido, faixa de preço, botão "Consultar no WhatsApp" com mensagem pré-preenchida específica daquela densidade. Nota de rodapé da seção: preço final varia conforme espessura/corte/quantidade, valor exato é combinado no WhatsApp.
5. **Como funciona / Como comprar** — 4 passos: escolha a densidade → fale no WhatsApp → receba orçamento → retire na loja ou receba em casa.
6. **Quem Somos** — texto institucional adaptado do post do Instagram (empresa especializada em distribuição de espumas de qualidade, +30 anos, "parceria e qualidade para quem faz acontecer"), com foto/placeholder do depósito ou equipe.
7. **Depoimentos** — carrossel/slider com 3 depoimentos placeholder (nome, foto placeholder, texto, estrelas) — **marcados claramente como exemplo**, a substituir por depoimentos reais antes do lançamento. Comportamento: rotação automática a cada poucos segundos, pausa ao passar o mouse/tocar, com navegação manual por setas/dots.
8. **Onde Estamos** — endereço completo, mapa do Google Maps incorporado (iframe), botão "Como chegar" (deep link Google Maps) e botão "Falar no WhatsApp". Horário de funcionamento como placeholder a confirmar.
9. **Footer** — logo, link do Instagram, WhatsApp, endereço curto, copyright.
10. **Botão flutuante de WhatsApp** — fixo no canto inferior direito, visível em todas as seções ao rolar (elemento transversal, não uma seção isolada).

## 4. Modelo de dados do catálogo

Preços e densidades vivem separados do HTML/CSS, em `js/catalogo-data.js`, para que o usuário edite sem tocar em layout:

```js
const CATALOGO = [
  {
    densidade: "D18",
    uso: "Almofadas decorativas e assentos leves",
    precoMin: 25,
    precoMax: 35,
    unidade: "m²",
    mensagemWhatsApp: "Olá! Gostaria de saber mais sobre a espuma D18."
  },
  // D26, D28, D33, D45, D60 — mesma estrutura, todos com dados placeholder
];
```

`main.js` lê `CATALOGO`, renderiza os cards dinamicamente (via template/`createElement`) e monta o link de cada botão como:

```
https://wa.me/5543984888884?text=<mensagemWhatsApp codificada via encodeURIComponent>
```

Todos os valores de `precoMin`/`precoMax`/densidades no primeiro commit são **placeholder explícito** (dados de exemplo realistas do mercado brasileiro de espumas) — trocar pelos valores reais antes de publicar.

## 5. Direção visual

Seguir a identidade de marca já estabelecida no Instagram/logo: fundo preto/quase-preto, dourado como cor de destaque (CTAs, ícones, detalhes, bordas), tipografia forte e elegante (títulos em peso alto, corpo de texto legível). Tom premium/sofisticado — não "vibrante/promocional". O logo fornecido (render 3D preto/dourado) é o ativo real de marca e deve ser usado (o usuário precisa fornecer o arquivo de imagem antes da implementação final; usar placeholder com as mesmas cores até lá).

## 6. Animação e interação

Nível "elegante e sutil" (escolha do usuário) — reforça a sensação premium sem distrair:

- Fade/slide-in ao rolar a página, via `IntersectionObserver` nativo (sem biblioteca externa)
- Contador numérico animado (ex.: 0 → 30+ anos) quando a seção entra na tela
- Hover discreto em botões e cards (leve elevação/brilho dourado)
- Scroll suave para navegação por âncora
- Transições CSS (não JS) para tudo que for puramente visual (hover, menu mobile abrindo/fechando)

Sem GSAP, AOS.js ou qualquer dependência externa — tudo em CSS transitions/keyframes + JS vanilla mínimo. Mantém o site leve e rápido em conexões móveis.

## 7. Responsividade

Mobile-first. Breakpoints aproximados:

- `< 480px`: mobile pequeno — catálogo em 1 coluna, menu hambúrguer
- `480–768px`: mobile grande / tablet retrato — catálogo em 2 colunas
- `768–1024px`: tablet paisagem — catálogo em 2-3 colunas
- `> 1024px`: desktop — catálogo em 3-4 colunas, nav completa no header

## 8. Acessibilidade e robustez

- Contraste dourado/preto verificado para leitura (dourado mais claro/saturado para texto pequeno; dourado escuro reservado para elementos decorativos)
- Preços, textos e CTAs em HTML real (não em imagem) — ajuda SEO e leitores de tela
- Todas as imagens com `alt` descritivo
- Progressive enhancement: conteúdo visível e CTAs clicáveis mesmo se o JS falhar ao carregar (animação é bônus, não requisito de funcionamento)
- Links `wa.me` funcionam tanto em mobile (abre app) quanto desktop (abre WhatsApp Web)

## 9. Deploy

GitHub Pages a partir da raiz do repositório `rochadecorespumas` (branch `main`), sem build step. Basta ativar Pages nas configurações do repositório apontando para a raiz.

## 10. Checklist de conteúdo/assets pendentes (antes de publicar)

Estes itens estão com **placeholder** e precisam ser substituídos pelo usuário antes do lançamento real:

- [ ] Arquivo do logo real (PNG/SVG) em `assets/img/`
- [ ] Fotos reais (hero, depósito, equipe) substituindo os placeholders
- [ ] Preços reais por densidade em `js/catalogo-data.js`
- [ ] Lista real de densidades disponíveis (confirmar quais além de D18/D26/D28/D33/D45/D60)
- [ ] Depoimentos reais de clientes (nome, foto, texto)
- [ ] Horário de funcionamento
- [ ] Confirmar handle exato do Instagram para o link no footer

## 11. Testes / QA manual

- Testar em Chrome/Safari mobile e desktop, de 360px até ultra-wide
- Validar que todos os links `wa.me` abrem com a mensagem correta por densidade
- Rodar Lighthouse (performance/acessibilidade/SEO) e ajustar problemas relevantes
- Confirmar que imagens placeholder têm dimensões definidas (evitar layout shift)
- Confirmar que o site funciona com JS desabilitado (conteúdo e CTAs ainda visíveis/clicáveis)
