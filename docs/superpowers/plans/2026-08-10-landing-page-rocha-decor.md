# Landing Page Rocha Decor Espumas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-page, static (HTML/CSS/JS, no build step) landing page for Rocha Decor Espumas that showcases a foam-density catalog with placeholder price ranges and drives every visitor toward a WhatsApp conversation.

**Architecture:** Single `index.html` with all sections, one growing `css/styles.css` (delimited by section comments), and small single-responsibility JS modules loaded as native ES modules from `js/main.js`. Pure, non-DOM logic (WhatsApp link building, price formatting, easing math) lives in `js/utils.js` and is unit-tested with Node's built-in test runner. Everything else is verified manually in a browser.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, grid/flexbox, `clamp()`), vanilla JS (ES modules, `IntersectionObserver`, `requestAnimationFrame`). Zero npm dependencies. Node.js is used only as a dev-time test runner (`node --test`), never shipped.

**Spec:** `docs/superpowers/specs/2026-08-10-landing-page-rocha-decor-design.md` — read it once for business context (WhatsApp number, address, brand) before starting Task 1.

## Global Constraints

- No frameworks, no bundlers, no npm dependencies. Pure HTML/CSS/JS, deployable as-is to GitHub Pages.
- WhatsApp number used everywhere: `5543984888884`.
- Address used everywhere: `Rua Ruy Virmond Carnascialli, 791, Jardim Leonor, Londrina - PR`.
- Foam brand name: **Pró-Relax** (never "Pró-Rolex").
- Visual identity: dark background (`#0b0b0d`), gold accent (`#d9b25c` / `#f2cf82`), premium/sophisticated tone — not vibrant/promotional.
- Animation level: "elegante e sutil" — CSS transitions + `IntersectionObserver`, no animation libraries.
- Every generic WhatsApp CTA (header, hero, quem-somos, onde-estamos, floating button) must have its real `https://wa.me/...` link **hardcoded directly in the HTML**, not assigned by JS — the site must keep working if JS fails to load. Only the catálogo cards (per-density message) are JS-rendered, and that section gets a `<noscript>` fallback.
- Breakpoints: `480px`, `768px`, `1024px` (mobile-first, `min-width` media queries).
- Anchor navigation must scroll smoothly (`scroll-behavior: smooth`), disabled under `prefers-reduced-motion: reduce`.
- Local dev/test server for manual verification: `python -m http.server 8000` (confirmed available on this machine), then open `http://localhost:8000/`. **Never verify by double-clicking `index.html`** — `<script type="module">` is blocked by CORS on the `file://` protocol.
- Node.js (confirmed v24.15.0) is used for `node --test tests/*.test.js` only. Use the glob, not a bare directory (`node --test tests/` reproducibly fails with `MODULE_NOT_FOUND` on this Node build on Windows — verified empirically; the glob form works whether or not the shell expands it).
- This is a Windows dev environment with no Safari/iOS available. Every manual-verification step in this plan uses Chrome/DevTools emulation; real Safari/iOS spot-checking is called out explicitly as a follow-up for the user, not something executed during these tasks.

## File Structure

| File | Responsibility |
|---|---|
| `index.html` | All markup, one page, semantic sections with stable `id`s for anchor nav |
| `css/styles.css` | All styles, grown incrementally, one `/* ==== SECTION ==== */` block per feature |
| `js/main.js` | Entry point; imports and initializes every other module on `DOMContentLoaded` |
| `js/scroll-reveal.js` | Generic `IntersectionObserver` fade/slide-in for any `[data-reveal]` element |
| `js/nav.js` | Mobile header menu open/close behavior only |
| `js/counter.js` | Animated number counters (hero stats) |
| `js/utils.js` | Pure, DOM-free, Node-testable helpers: `buildWhatsAppLink`, `formatPriceRange`, `easeOutQuad` |
| `js/catalogo-data.js` | `CATALOGO` array — placeholder densities/prices, single source of truth |
| `js/catalogo-render.js` | Renders catálogo cards from `catalogo-data.js` using `utils.js` |
| `js/testimonials.js` | Depoimentos carousel (autoplay, arrows, dots) |
| `tests/utils.test.js` | `node:test` unit tests for `js/utils.js` |
| `package.json` | Minimal — `"type": "module"` + a `test` script, zero dependencies |
| `assets/icons/favicon.svg` | Site favicon (gold "R" on dark circle) |
| `assets/img/quem-somos-placeholder.svg` | Placeholder warehouse photo |
| `assets/img/avatar-placeholder.svg` | Placeholder avatar for depoimentos |
| `README.md` | Updated in the final task with setup/preview/deploy instructions |

---

### Task 1: Estrutura base do projeto (scaffold)

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `js/main.js`
- Create: `assets/icons/favicon.svg`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: the empty section shells (`#header`, `#hero`, `#diferenciais`, `#catalogo`, `#como-funciona`, `#quem-somos`, `#depoimentos`, `#onde-estamos`, `#footer`, `#whatsapp-float`) that every later task fills in; CSS custom properties (`--bg`, `--bg-elevated`, `--bg-elevated-2`, `--gold`, `--gold-light`, `--gold-dark`, `--text`, `--text-muted`, `--border`, `--radius`, `--container-width`, `--transition`, `--font-display`, `--font-body`); shared classes `.container`, `.section`, `.section-header`, `.section-eyebrow`, `.section-title`, `.section-subtitle`, `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--small`.

**Design note:** Typography is a deliberate pairing, not a single system-font stack everywhere: `--font-display` (Georgia-led serif, warm/sturdy — evokes decades of trade craft) for headlines and logos, `--font-body` (system sans) for everything else. Both are zero-network-request (no webfont files, no CDN) — the pairing comes from *which* system faces are chosen and *where* each is applied, not from downloading anything.

- [ ] **Step 1: Create the folder structure**

```bash
mkdir -p css js assets/img assets/icons tests
```

- [ ] **Step 2: Create the favicon**

Create `assets/icons/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="32" fill="#0b0b0d"/>
  <text x="32" y="42" fill="#d9b25c" font-family="Arial, sans-serif" font-size="32" font-weight="800" text-anchor="middle">R</text>
</svg>
```

- [ ] **Step 3: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rocha Decor Espumas | Distribuidora de Espumas em Londrina</title>
  <meta name="description" content="Distribuidora de espumas Pró-Relax em Londrina - PR. Preços especiais para tapeceiros, estofadores e revendedores. Cortes sob medida. Fale no WhatsApp.">
  <link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="header" id="header">
    <!-- HEADER: preenchido na Tarefa 4 -->
  </header>

  <main>
    <section class="hero" id="hero">
      <!-- HERO: preenchido na Tarefa 5 -->
    </section>

    <section class="diferenciais section" id="diferenciais">
      <!-- DIFERENCIAIS: preenchido na Tarefa 6 -->
    </section>

    <section class="catalogo section" id="catalogo">
      <!-- CATALOGO: preenchido na Tarefa 7 -->
    </section>

    <section class="como-funciona section" id="como-funciona">
      <!-- COMO FUNCIONA: preenchido na Tarefa 8 -->
    </section>

    <section class="quem-somos section" id="quem-somos">
      <!-- QUEM SOMOS: preenchido na Tarefa 9 -->
    </section>

    <section class="depoimentos section" id="depoimentos">
      <!-- DEPOIMENTOS: preenchido na Tarefa 10 -->
    </section>

    <section class="onde-estamos section" id="onde-estamos">
      <!-- ONDE ESTAMOS: preenchido na Tarefa 11 -->
    </section>
  </main>

  <footer class="footer" id="footer">
    <!-- FOOTER: preenchido na Tarefa 12 -->
  </footer>

  <a id="whatsapp-float" class="whatsapp-float" href="#" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <!-- Ícone preenchido na Tarefa 12 -->
  </a>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create `css/styles.css`**

```css
/* ==== RESET ==== */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
}
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; margin: 0; padding: 0; }
h1, h2, h3, p { margin: 0; }
button { font: inherit; cursor: pointer; }

/* ==== DESIGN TOKENS ==== */
:root {
  --bg: #0b0b0d;
  --bg-elevated: #16161a;
  --bg-elevated-2: #1e1e23;
  --gold: #d9b25c;
  --gold-light: #f2cf82;
  --gold-dark: #8f6f2e;
  --text: #f4f1ea;
  --text-muted: #a8a29b;
  --border: rgba(217, 178, 92, 0.25);
  --radius: 14px;
  --container-width: 1180px;
  --transition: 280ms ease;
  --font-display: Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', ui-serif, serif;
  --font-body: -apple-system, 'Segoe UI', system-ui, 'Helvetica Neue', Arial, sans-serif;
}

/* ==== LAYOUT HELPERS ==== */
.container {
  width: 100%;
  max-width: var(--container-width);
  margin-inline: auto;
  padding-inline: clamp(1rem, 4vw, 2rem);
}

.section {
  padding-block: clamp(3rem, 8vw, 6rem);
}

.section-header {
  text-align: center;
  max-width: 640px;
  margin-inline: auto;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.section-eyebrow {
  display: inline-block;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-top: 0.75rem;
}

/* ==== BUTTONS ==== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid transparent;
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition), color var(--transition);
  white-space: nowrap;
}

.btn--primary {
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  color: #1a1305;
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px -10px rgba(217, 178, 92, 0.6);
}

.btn--secondary {
  background: transparent;
  border-color: var(--border);
  color: var(--text);
}

.btn--secondary:hover {
  border-color: var(--gold);
  color: var(--gold-light);
}

.btn--small {
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
}
```

- [ ] **Step 5: Create the `js/main.js` entry stub**

```js
console.log('Rocha Decor Espumas — site carregado');
```

- [ ] **Step 6: Verify in the browser**

Run: `python -m http.server 8000` (leave it running), then open `http://localhost:8000/`.

Expected:
- Page background is near-black, no visible content (sections are empty — expected at this stage).
- DevTools console shows `Rocha Decor Espumas — site carregado` and zero errors.
- "View Page Source" shows all ten section/anchor elements listed in the Produces block above.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/main.js assets/icons/favicon.svg
git commit -m "feat: scaffold static site structure with design tokens"
```

---

### Task 2: Utilitário de scroll-reveal

**Files:**
- Create: `js/scroll-reveal.js`
- Modify: `css/styles.css` (append)
- Modify: `js/main.js` (replace entirely)
- Modify: `index.html` (temporary test element, added then removed in this task)

**Interfaces:**
- Consumes: nothing new
- Produces: `initScrollReveal(selector = '[data-reveal]', options = {}): void` — call once on load; any element with a `data-reveal` attribute gets class `is-visible` added when it scrolls into view. Also produces the `[data-reveal]` / `.is-visible` CSS contract every later section relies on.

- [ ] **Step 1: Create `js/scroll-reveal.js`**

```js
export function initScrollReveal(selector = '[data-reveal]', options = {}) {
  const elements = document.querySelectorAll(selector);
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options });

  elements.forEach((el) => observer.observe(el));
}
```

- [ ] **Step 2: Append reveal styles to `css/styles.css`**

```css

/* ==== SCROLL REVEAL ==== */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 700ms ease, transform 700ms ease;
}

[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }

  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 3: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
});
```

- [ ] **Step 4: Add a temporary test element to verify the mechanism**

In `index.html`, temporarily add this line immediately before `<script type="module" src="js/main.js"></script>`:

```html
<div data-reveal style="height:400px;margin-top:900px;background:#222;color:#fff;display:flex;align-items:center;justify-content:center;">TESTE REVEAL — REMOVER</div>
```

- [ ] **Step 5: Verify in the browser**

With the server from Task 1 still running, reload `http://localhost:8000/`. Scroll down past the fold.

Expected: the "TESTE REVEAL — REMOVER" box is invisible until it's about 85% scrolled into view, then fades and slides up into place smoothly. Console has zero errors.

- [ ] **Step 6: Remove the temporary test element**

Delete the `<div data-reveal ...>TESTE REVEAL — REMOVER</div>` line added in Step 4. Confirm the page still loads with no console errors after removing it.

- [ ] **Step 7: Commit**

```bash
git add js/scroll-reveal.js js/main.js css/styles.css
git commit -m "feat: add generic IntersectionObserver scroll-reveal utility"
```

---

### Task 3: Utilitários puros (WhatsApp link, formatação de preço) com testes automatizados

**Files:**
- Create: `package.json`
- Create: `tests/utils.test.js`
- Create: `js/utils.js`

**Interfaces:**
- Consumes: nothing new
- Produces: `buildWhatsAppLink(phone: string, message: string): string` and `formatPriceRange(min: number, max: number, unit: string): string`, both pure and DOM-free — later consumed by `js/catalogo-render.js` (Task 7).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "rochadecorespumas",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.js"
  }
}
```

- [ ] **Step 2: Write the failing test file — `tests/utils.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppLink, formatPriceRange } from '../js/utils.js';

test('buildWhatsAppLink strips non-digit characters from the phone number', () => {
  const link = buildWhatsAppLink('55 43 98488-8884', 'Olá');
  assert.equal(link.startsWith('https://wa.me/5543984888884'), true);
});

test('buildWhatsAppLink encodes the message as a text query param', () => {
  const link = buildWhatsAppLink('5543984888884', 'Olá! Gostaria de saber sobre D18');
  assert.equal(
    link,
    'https://wa.me/5543984888884?text=Ol%C3%A1!%20Gostaria%20de%20saber%20sobre%20D18'
  );
});

test('buildWhatsAppLink omits the text param when the message is empty', () => {
  const link = buildWhatsAppLink('5543984888884', '');
  assert.equal(link, 'https://wa.me/5543984888884');
});

test('formatPriceRange formats two distinct values as a range', () => {
  const result = formatPriceRange(25, 35, 'm²');
  assert.equal(result, 'R$ 25,00 – R$ 35,00 / m²');
});

test('formatPriceRange collapses to a single price when min equals max', () => {
  const result = formatPriceRange(40, 40, 'm²');
  assert.equal(result, 'R$ 40,00 / m²');
});

test('formatPriceRange groups thousands with a dot', () => {
  const result = formatPriceRange(1234, 1234, 'm²');
  assert.equal(result, 'R$ 1.234,00 / m²');
});
```

- [ ] **Step 3: Run the tests and verify they fail**

Run: `node --test tests/*.test.js`
Expected: FAIL — `Cannot find module '../js/utils.js'` (the file doesn't exist yet).

- [ ] **Step 4: Implement `js/utils.js`**

```js
function formatBRL(value) {
  const [intPart, decPart = '00'] = value.toFixed(2).split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${withThousands},${decPart}`;
}

export function buildWhatsAppLink(phone, message) {
  const digitsOnly = String(phone).replace(/\D/g, '');
  const encoded = encodeURIComponent(message ?? '');
  return `https://wa.me/${digitsOnly}${encoded ? `?text=${encoded}` : ''}`;
}

export function formatPriceRange(min, max, unit) {
  if (min === max) {
    return `${formatBRL(min)} / ${unit}`;
  }
  return `${formatBRL(min)} – ${formatBRL(max)} / ${unit}`;
}
```

- [ ] **Step 5: Run the tests again and verify they pass**

Run: `node --test tests/*.test.js`
Expected: PASS — `# pass 6`, `# fail 0`.

- [ ] **Step 6: Commit**

```bash
git add package.json tests/utils.test.js js/utils.js
git commit -m "feat: add pure WhatsApp link and price formatting utils with tests"
```

---

### Task 4: Header / navegação

**Files:**
- Modify: `index.html` (replace the `<header>` block's contents)
- Modify: `css/styles.css` (append)
- Create: `js/nav.js`
- Modify: `js/main.js` (replace entirely)

**Interfaces:**
- Consumes: nothing new (the header's WhatsApp CTA is a static hardcoded link, not JS-driven)
- Produces: `initHeaderNav(): void` — wires the mobile hamburger toggle and closes the menu when a nav link is clicked.

- [ ] **Step 1: Replace the `<header>` element in `index.html`**

Replace:
```html
  <header class="header" id="header">
    <!-- HEADER: preenchido na Tarefa 4 -->
  </header>
```

With:
```html
  <header class="header" id="header">
    <div class="container header__inner">
      <a href="#hero" class="header__logo">Rocha <span>Decor Espumas</span></a>

      <nav class="header__nav" id="header-nav">
        <ul>
          <li><a href="#hero" class="nav-link">Início</a></li>
          <li><a href="#diferenciais" class="nav-link">Diferenciais</a></li>
          <li><a href="#catalogo" class="nav-link">Catálogo</a></li>
          <li><a href="#como-funciona" class="nav-link">Como Funciona</a></li>
          <li><a href="#quem-somos" class="nav-link">Quem Somos</a></li>
          <li><a href="#depoimentos" class="nav-link">Depoimentos</a></li>
          <li><a href="#onde-estamos" class="nav-link">Onde Estamos</a></li>
        </ul>
      </nav>

      <a
        class="btn btn--primary btn--small header__cta"
        href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20espumas."
        target="_blank"
        rel="noopener"
      >
        Falar no WhatsApp
      </a>

      <button
        class="header__toggle"
        id="header-toggle"
        aria-label="Abrir menu"
        aria-expanded="false"
        aria-controls="header-nav"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>
```

- [ ] **Step 2: Append header styles to `css/styles.css`**

```css

/* ==== HEADER ==== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 11, 13, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 1rem;
  gap: 1.5rem;
}

.header__logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text);
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.header__logo span {
  color: var(--gold);
}

.header__nav ul {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color var(--transition);
}

.nav-link:hover {
  color: var(--gold-light);
}

.header__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  padding: 0;
  flex-shrink: 0;
}

.header__toggle span {
  display: block;
  height: 2px;
  background: var(--gold);
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}

.header__toggle[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.header__toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}
.header__toggle[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 1023px) {
  .header__nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--bg-elevated);
    border-bottom: 1px solid var(--border);
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition);
  }

  .header__nav.is-open {
    max-height: 70vh;
    overflow-y: auto;
  }

  .header__nav ul {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .header__toggle {
    display: flex;
  }
}
```

- [ ] **Step 3: Create `js/nav.js`**

```js
export function initHeaderNav() {
  const toggle = document.getElementById('header-toggle');
  const nav = document.getElementById('header-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}
```

- [ ] **Step 4: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
});
```

- [ ] **Step 5: Verify in the browser**

Reload `http://localhost:8000/`.

Expected:
- Desktop width (≥1024px): full nav list + "Falar no WhatsApp" button visible inline, no hamburger.
- Narrow the window below 1024px: nav list disappears, hamburger icon appears.
- Click the hamburger: icon animates into an "X", menu slides open below the header showing all 7 links.
- Click any link: menu closes, icon reverts, page jumps to that anchor (sections are still empty — that's expected).
- Inspect the "Falar no WhatsApp" button: its `href` starts with `https://wa.me/5543984888884?text=`. Do not click through and send a real message.
- Console has zero errors.

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/nav.js js/main.js
git commit -m "feat: add sticky header with mobile nav and static WhatsApp CTA"
```

---

### Task 5: Hero

**Files:**
- Modify: `index.html` (replace the `<section id="hero">` block's contents)
- Modify: `css/styles.css` (append)
- Modify: `js/utils.js` (append `easeOutQuad`)
- Modify: `tests/utils.test.js` (append tests for `easeOutQuad`)
- Create: `js/counter.js`
- Modify: `js/main.js` (replace entirely)

**Interfaces:**
- Consumes: nothing new for the markup (hero's CTA is a static hardcoded link, same pattern as Task 4)
- Produces: `easeOutQuad(progress: number): number` appended to `js/utils.js`; `initCounters(selector = '[data-counter]'): void` from `js/counter.js` — animates any element with `data-counter-target` (and optional `data-counter-suffix`) from 0 to its target once visible.

- [ ] **Step 1: Write failing tests for `easeOutQuad`**

Append to `tests/utils.test.js` (add the import name and the new tests):

Change the import line at the top from:
```js
import { buildWhatsAppLink, formatPriceRange } from '../js/utils.js';
```
to:
```js
import { buildWhatsAppLink, formatPriceRange, easeOutQuad } from '../js/utils.js';
```

Then append at the end of the file:
```js

test('easeOutQuad returns 0 at progress 0 and 1 at progress 1', () => {
  assert.equal(easeOutQuad(0), 0);
  assert.equal(easeOutQuad(1), 1);
});

test('easeOutQuad clamps values outside the 0-1 range', () => {
  assert.equal(easeOutQuad(-0.5), 0);
  assert.equal(easeOutQuad(1.5), 1);
});

test('easeOutQuad is strictly between 0 and 1 at the midpoint', () => {
  const mid = easeOutQuad(0.5);
  assert.ok(mid > 0 && mid < 1);
});
```

- [ ] **Step 2: Run the tests and verify the new ones fail**

Run: `node --test tests/*.test.js`
Expected: FAIL on the 3 new tests — `easeOutQuad is not a function` (it isn't exported yet). The 6 tests from Task 3 still pass.

- [ ] **Step 3: Append `easeOutQuad` to `js/utils.js`**

Add this export at the end of `js/utils.js`:

```js

export function easeOutQuad(progress) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return 1 - (1 - clamped) * (1 - clamped);
}
```

- [ ] **Step 4: Run the tests again and verify all pass**

Run: `node --test tests/*.test.js`
Expected: PASS — `# pass 9`, `# fail 0`.

- [ ] **Step 5: Create `js/counter.js`**

```js
import { easeOutQuad } from './utils.js';

function animateCounter(el) {
  const target = Number(el.dataset.counterTarget || '0');
  const suffix = el.dataset.counterSuffix || '';
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(easeOutQuad(progress) * target);
    el.textContent = `${value}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function initCounters(selector = '[data-counter]') {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(animateCounter);
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  elements.forEach((el) => observer.observe(el));
}
```

- [ ] **Step 6: Replace the `<section id="hero">` element in `index.html`**

Replace:
```html
    <section class="hero" id="hero">
      <!-- HERO: preenchido na Tarefa 5 -->
    </section>
```

With:
```html
    <section class="hero" id="hero" data-reveal>
      <div class="container hero__inner">
        <div class="hero__badge">
          <span class="hero__badge-number" data-counter data-counter-target="30" data-counter-suffix="+">0</span>
          <span class="hero__badge-label">anos de experiência em Londrina</span>
        </div>

        <h1 class="hero__title">Uma densidade certa<br>para cada projeto.</h1>
        <p class="hero__subtitle">
          Distribuidora oficial Pró-Relax. Preços especiais para tapeceiros,
          estofadores e revendedores, com cortes sob medida.
        </p>

        <div class="hero__actions">
          <a
            class="btn btn--primary"
            href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20espumas."
            target="_blank"
            rel="noopener"
          >
            Falar no WhatsApp
          </a>
          <a class="btn btn--secondary" href="#catalogo">Ver catálogo de densidades</a>
        </div>

        <a href="#catalogo" class="hero__spectrum">
          <div class="hero__spectrum-bar">
            <span class="hero__spectrum-tick hero__spectrum-tick--start" style="left:0%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D18</b><i>macia</i></span>
            </span>
            <span class="hero__spectrum-tick" style="left:20%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D26</b></span>
            </span>
            <span class="hero__spectrum-tick" style="left:40%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D28</b></span>
            </span>
            <span class="hero__spectrum-tick" style="left:60%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D33</b></span>
            </span>
            <span class="hero__spectrum-tick" style="left:80%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D45</b></span>
            </span>
            <span class="hero__spectrum-tick hero__spectrum-tick--end" style="left:100%">
              <span class="hero__spectrum-tick-mark"></span>
              <span class="hero__spectrum-tick-label"><b>D60</b><i>firme</i></span>
            </span>
          </div>
          <p class="hero__spectrum-caption">Do mais macio ao mais firme — encontre sua densidade no catálogo abaixo ↓</p>
        </a>
      </div>
    </section>
```

**Why this shape:** a row of three generic stat tiles (years / count / percent) is the default hero almost any AI-generated landing page reaches for. This hero keeps exactly one animated number (the trust badge — "+30 anos"), and replaces the other two stats with something that actually encodes real product information: a density spectrum from soft (D18) to firm (D60), the same vocabulary a tapeceiro already thinks in. It doubles as a visual teaser for the catálogo section and is a link straight to it.

- [ ] **Step 7: Append hero styles to `css/styles.css`**

```css

/* ==== HERO ==== */
.hero {
  position: relative;
  padding-top: calc(clamp(3rem, 8vw, 6rem) + 80px);
  padding-bottom: clamp(3rem, 8vw, 6rem);
  background:
    radial-gradient(circle at 15% 20%, rgba(217, 178, 92, 0.16), transparent 45%),
    linear-gradient(180deg, var(--bg) 0%, var(--bg-elevated) 100%);
  overflow: hidden;
  text-align: center;
}

.hero__inner {
  max-width: 760px;
  margin-inline: auto;
}

.hero__badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  margin-bottom: 1.5rem;
  background: var(--bg-elevated);
}

.hero__badge-number {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--gold-light);
}

.hero__badge-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 6vw, 3.6rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.hero__subtitle {
  margin-top: 1.25rem;
  color: var(--text-muted);
  font-size: 1.1rem;
  max-width: 560px;
  margin-inline: auto;
}

.hero__actions {
  margin-top: 2.25rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__spectrum {
  display: block;
  margin-top: 3.5rem;
  max-width: 640px;
  margin-inline: auto;
}

.hero__spectrum-bar {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(242, 207, 130, 0.3), var(--gold) 45%, var(--gold-dark) 100%);
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1200ms ease 300ms;
}

.hero.is-visible .hero__spectrum-bar {
  clip-path: inset(0 0% 0 0);
}

.hero__spectrum-tick {
  position: absolute;
  top: 100%;
}

.hero__spectrum-tick-mark {
  position: absolute;
  left: 0;
  top: 0;
  width: 1px;
  height: 0.6rem;
  background: var(--border);
}

.hero__spectrum-tick-label {
  position: absolute;
  left: 0;
  top: 0.7rem;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.3;
  white-space: nowrap;
}

.hero__spectrum-tick--start .hero__spectrum-tick-label {
  transform: translateX(0);
  align-items: flex-start;
}

.hero__spectrum-tick--end .hero__spectrum-tick-label {
  transform: translateX(-100%);
  align-items: flex-end;
}

.hero__spectrum-tick b {
  color: var(--gold-light);
  font-weight: 700;
  letter-spacing: 0.02em;
}

.hero__spectrum-tick i {
  font-style: normal;
  color: var(--text-muted);
  font-size: 0.68rem;
}

.hero__spectrum-caption {
  margin-top: 2.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (hover: hover) {
  .hero__spectrum:hover .hero__spectrum-caption {
    color: var(--gold-light);
  }
}
```

- [ ] **Step 8: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';
import { initCounters } from './counter.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
  initCounters();
});
```

- [ ] **Step 9: Verify in the browser**

Reload `http://localhost:8000/`.

Expected:
- Hero content fades in shortly after load (it's above the fold, so the reveal fires almost immediately).
- The "+30" badge number counts up from 0 to 30 over about 1.2 seconds.
- The density spectrum bar fills in from left to right shortly after the hero reveals (the gold gradient bar animates its `clip-path` from fully clipped to fully visible).
- All 6 density tick labels (D18…D60) are readable, evenly spaced, and aligned under their tick mark — the "D18/macia" and "D60/firme" end labels must sit fully inside the bar's width, not clipped or overflowing past the container edge, even at 360px.
- Headline and section titles render in the serif display font (Georgia or its fallback), visibly different from the sans-serif body text.
- "Falar no WhatsApp" button `href` starts with `https://wa.me/5543984888884?text=` (inspect, don't click through).
- Both "Ver catálogo de densidades" and clicking the spectrum itself scroll smoothly down to the (still empty) catálogo section.
- No horizontal scrollbar at 360px width. No console errors.

- [ ] **Step 10: Commit**

```bash
git add index.html css/styles.css js/utils.js js/counter.js js/main.js tests/utils.test.js
git commit -m "feat: add hero section with density spectrum signature element"
```

---

### Task 6: Diferenciais

**Files:**
- Modify: `index.html` (replace the `<section id="diferenciais">` block's contents)
- Modify: `css/styles.css` (append)

**Interfaces:**
- Consumes: `.section`, `.section-header`, `.section-eyebrow`, `.section-title`, `.section-subtitle` (Task 1); `[data-reveal]` (Task 2)
- Produces: nothing new for later tasks (self-contained section)

- [ ] **Step 1: Replace the `<section id="diferenciais">` element in `index.html`**

Replace:
```html
    <section class="diferenciais section" id="diferenciais">
      <!-- DIFERENCIAIS: preenchido na Tarefa 6 -->
    </section>
```

With:
```html
    <section class="diferenciais section" id="diferenciais">
      <div class="container">
        <div class="section-header" data-reveal>
          <p class="section-eyebrow">Por que a Rocha</p>
          <h2 class="section-title">Feito para quem faz acontecer</h2>
          <p class="section-subtitle">
            Mais de três décadas fornecendo espuma de qualidade para quem transforma isso em negócio.
          </p>
        </div>

        <div class="diferenciais__grid">
          <article class="diferencial-card" data-reveal>
            <span class="diferencial-card__icon" aria-hidden="true">⏳</span>
            <h3>+30 anos de mercado</h3>
            <p>Décadas de experiência distribuindo espuma de qualidade em Londrina e região.</p>
          </article>

          <article class="diferencial-card" data-reveal>
            <span class="diferencial-card__icon" aria-hidden="true">✂️</span>
            <h3>Cortes sob medida</h3>
            <p>Cortamos a espuma no tamanho exato que você precisa, sem desperdício.</p>
          </article>

          <article class="diferencial-card" data-reveal>
            <span class="diferencial-card__icon" aria-hidden="true">🤝</span>
            <h3>Preços para revendedores</h3>
            <p>Condições exclusivas para tapeceiros, estofadores e revendedores.</p>
          </article>

          <article class="diferencial-card" data-reveal>
            <span class="diferencial-card__icon" aria-hidden="true">🏆</span>
            <h3>Distribuidor oficial Pró-Relax</h3>
            <p>Conforto, durabilidade e qualidade com a garantia de uma marca reconhecida.</p>
          </article>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append diferenciais styles to `css/styles.css`**

```css

/* ==== DIFERENCIAIS ==== */
.diferenciais__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.diferencial-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  transition: transform var(--transition), border-color var(--transition);
}

.diferencial-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
}

.diferencial-card__icon {
  font-size: 1.75rem;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.diferencial-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.diferencial-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to "Diferenciais".

Expected: section header and all 4 cards fade/slide in as they cross into view. At ≥ ~900px wide the 4 cards sit in one row (auto-fit); on narrow widths they stack to 1 column with no overflow. Hovering a card (desktop) lifts it slightly and its border turns gold.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add diferenciais section"
```

---

### Task 7: Catálogo por densidade

**Files:**
- Create: `js/catalogo-data.js`
- Create: `js/catalogo-render.js`
- Modify: `index.html` (replace the `<section id="catalogo">` block's contents)
- Modify: `css/styles.css` (append)
- Modify: `js/main.js` (replace entirely)

**Interfaces:**
- Consumes: `buildWhatsAppLink`, `formatPriceRange` from `js/utils.js` (Task 3); `.section`/`.section-header`/`[data-reveal]` (Tasks 1–2); `.btn.btn--secondary.btn--small` (Task 1)
- Produces: `CATALOGO: Array<{densidade: string, uso: string, precoMin: number, precoMax: number, unidade: string, mensagemWhatsApp: string}>` from `catalogo-data.js`; `renderCatalogo(selector = '#catalogo-grid'): void` from `catalogo-render.js`.

- [ ] **Step 1: Create `js/catalogo-data.js`**

```js
// Dados de exemplo (placeholder) — substituir pelos valores reais
// (densidades disponíveis e faixas de preço) antes de publicar o site.
export const CATALOGO = [
  {
    densidade: 'D18',
    uso: 'Almofadas decorativas e assentos leves',
    precoMin: 25,
    precoMax: 35,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D18.',
  },
  {
    densidade: 'D26',
    uso: 'Colchões e assentos de uso residencial',
    precoMin: 32,
    precoMax: 44,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D26.',
  },
  {
    densidade: 'D28',
    uso: 'Estofados de sofás e poltronas',
    precoMin: 38,
    precoMax: 52,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D28.',
  },
  {
    densidade: 'D33',
    uso: 'Uso comercial e alta rotatividade',
    precoMin: 45,
    precoMax: 60,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D33.',
  },
  {
    densidade: 'D45',
    uso: 'Estofamento de alta resistência',
    precoMin: 58,
    precoMax: 75,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D45.',
  },
  {
    densidade: 'D60',
    uso: 'Uso industrial e ortopédico',
    precoMin: 70,
    precoMax: 95,
    unidade: 'm²',
    mensagemWhatsApp: 'Olá! Gostaria de saber mais sobre a espuma D60.',
  },
];
```

- [ ] **Step 2: Create `js/catalogo-render.js`**

```js
import { CATALOGO } from './catalogo-data.js';
import { buildWhatsAppLink, formatPriceRange } from './utils.js';

const WHATSAPP_NUMBER = '5543984888884';

function createCatalogCard(item) {
  const card = document.createElement('article');
  card.className = 'catalog-card';
  card.setAttribute('data-reveal', '');

  const title = document.createElement('h3');
  title.className = 'catalog-card__title';
  title.textContent = item.densidade;

  const uso = document.createElement('p');
  uso.className = 'catalog-card__uso';
  uso.textContent = item.uso;

  const preco = document.createElement('p');
  preco.className = 'catalog-card__preco';
  preco.textContent = formatPriceRange(item.precoMin, item.precoMax, item.unidade);

  const cta = document.createElement('a');
  cta.className = 'btn btn--secondary btn--small catalog-card__cta';
  cta.href = buildWhatsAppLink(WHATSAPP_NUMBER, item.mensagemWhatsApp);
  cta.target = '_blank';
  cta.rel = 'noopener';
  cta.textContent = 'Consultar no WhatsApp';

  card.append(title, uso, preco, cta);

  return card;
}

export function renderCatalogo(selector = '#catalogo-grid') {
  const grid = document.querySelector(selector);
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  CATALOGO.forEach((item) => {
    fragment.appendChild(createCatalogCard(item));
  });

  grid.appendChild(fragment);
}
```

- [ ] **Step 3: Replace the `<section id="catalogo">` element in `index.html`**

Replace:
```html
    <section class="catalogo section" id="catalogo">
      <!-- CATALOGO: preenchido na Tarefa 7 -->
    </section>
```

With:
```html
    <section class="catalogo section" id="catalogo">
      <div class="container">
        <div class="section-header" data-reveal>
          <p class="section-eyebrow">Catálogo</p>
          <h2 class="section-title">Espuma por densidade</h2>
          <p class="section-subtitle">
            Encontre a densidade ideal para o seu projeto. Valores de referência —
            o preço final varia conforme espessura, corte e quantidade.
          </p>
        </div>

        <div class="catalogo__grid" id="catalogo-grid"></div>

        <!-- Se editar as densidades em js/catalogo-data.js, atualize também esta lista de fallback abaixo. -->
        <noscript>
          <p class="catalogo__noscript-aviso">
            Ative o JavaScript para ver os cartões do catálogo, ou fale
            diretamente com a gente:
          </p>
          <ul class="catalogo__noscript-lista">
            <li>D18 — Almofadas decorativas e assentos leves</li>
            <li>D26 — Colchões e assentos de uso residencial</li>
            <li>D28 — Estofados de sofás e poltronas</li>
            <li>D33 — Uso comercial e alta rotatividade</li>
            <li>D45 — Estofamento de alta resistência</li>
            <li>D60 — Uso industrial e ortopédico</li>
          </ul>
          <a
            class="btn btn--primary"
            href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20densidades%20de%20espuma."
          >
            Falar no WhatsApp
          </a>
        </noscript>

        <p class="catalogo__nota" data-reveal>
          * Preços variam conforme espessura, corte e quantidade. Fale com a
          gente no WhatsApp para um orçamento exato.
        </p>
      </div>
    </section>
```

- [ ] **Step 4: Append catálogo styles to `css/styles.css`**

```css

/* ==== CATALOGO ==== */
.catalogo__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 480px) {
  .catalogo__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .catalogo__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.catalog-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform var(--transition), border-color var(--transition);
}

.catalog-card:hover {
  transform: translateY(-4px);
  border-color: var(--gold);
}

.catalog-card__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--gold-light);
}

.catalog-card__uso {
  color: var(--text-muted);
  font-size: 0.9rem;
  min-height: 2.7em;
}

.catalog-card__preco {
  font-size: 1.1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.catalog-card__cta {
  margin-top: 0.5rem;
  align-self: flex-start;
}

.catalogo__noscript-aviso,
.catalogo__noscript-lista {
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 1rem;
}

.catalogo__noscript-lista li {
  padding: 0.25rem 0;
}

.catalogo__nota {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}
```

- [ ] **Step 5: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';
import { initCounters } from './counter.js';
import { renderCatalogo } from './catalogo-render.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
  initCounters();
  renderCatalogo();
});
```

- [ ] **Step 6: Verify in the browser**

Reload and scroll to "Catálogo".

Expected:
- 6 cards render (D18, D26, D28, D33, D45, D60), each showing its `uso` text and a price formatted like `R$ 25,00 – R$ 35,00 / m²`.
- Inspect two different cards' "Consultar no WhatsApp" links: each `href` must contain the matching density (e.g. the D28 card's link text includes "espuma D28", not D18).
- Resize: 1 column below 480px, 2 columns between 480–1023px, 3 columns at ≥1024px.
- With DevTools → disable JavaScript (or use a private/incognito test with an extension) and reload: the grid is empty but the `<noscript>` block shows the 6 densities as plain text plus a working "Falar no WhatsApp" link.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/catalogo-data.js js/catalogo-render.js js/main.js
git commit -m "feat: render foam density catalog from data with WhatsApp deep links"
```

---

### Task 8: Como Funciona

**Files:**
- Modify: `index.html` (replace the `<section id="como-funciona">` block's contents)
- Modify: `css/styles.css` (append)

**Interfaces:**
- Consumes: `.section`/`.section-header`/`[data-reveal]` (Tasks 1–2)
- Produces: nothing new for later tasks

- [ ] **Step 1: Replace the `<section id="como-funciona">` element in `index.html`**

Replace:
```html
    <section class="como-funciona section" id="como-funciona">
      <!-- COMO FUNCIONA: preenchido na Tarefa 8 -->
    </section>
```

With:
```html
    <section class="como-funciona section" id="como-funciona">
      <div class="container">
        <div class="section-header" data-reveal>
          <p class="section-eyebrow">Como funciona</p>
          <h2 class="section-title">Do pedido até a entrega</h2>
        </div>

        <ol class="passos">
          <li class="passo" data-reveal>
            <span class="passo__numero">1</span>
            <h3>Escolha a densidade</h3>
            <p>Veja o catálogo e identifique a espuma ideal para o seu projeto.</p>
          </li>
          <li class="passo" data-reveal>
            <span class="passo__numero">2</span>
            <h3>Fale no WhatsApp</h3>
            <p>Clique em qualquer botão do site e converse direto com a gente.</p>
          </li>
          <li class="passo" data-reveal>
            <span class="passo__numero">3</span>
            <h3>Receba seu orçamento</h3>
            <p>Informamos o valor exato com base em espessura, corte e quantidade.</p>
          </li>
          <li class="passo" data-reveal>
            <span class="passo__numero">4</span>
            <h3>Retire ou receba em casa</h3>
            <p>Venha até a loja em Londrina ou combine a entrega com a gente.</p>
          </li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: Append como-funciona styles to `css/styles.css`**

```css

/* ==== COMO FUNCIONA ==== */
.passos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .passos {
    grid-template-columns: repeat(4, 1fr);
  }
}

.passo {
  text-align: center;
}

.passo__numero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  color: var(--gold-light);
  font-weight: 800;
  margin-bottom: 1rem;
}

.passo h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.passo p {
  color: var(--text-muted);
  font-size: 0.9rem;
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to "Como Funciona".

Expected: 4 numbered steps in a row at ≥768px, stacked vertically below that; each fades in independently as it enters view.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add como funciona steps section"
```

---

### Task 9: Quem Somos

**Files:**
- Modify: `index.html` (replace the `<section id="quem-somos">` block's contents)
- Modify: `css/styles.css` (append)
- Create: `assets/img/quem-somos-placeholder.svg`

**Interfaces:**
- Consumes: `.section`/`.section-header`/`[data-reveal]`/`.btn.btn--primary` (Tasks 1–2)
- Produces: nothing new for later tasks

- [ ] **Step 1: Create `assets/img/quem-somos-placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="420" viewBox="0 0 560 420">
  <rect width="560" height="420" fill="#16161a"/>
  <rect x="1" y="1" width="558" height="418" fill="none" stroke="#8f6f2e" stroke-width="2"/>
  <text x="280" y="200" fill="#d9b25c" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle">Foto do depósito</text>
  <text x="280" y="232" fill="#a8a29b" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">(placeholder — substituir)</text>
</svg>
```

- [ ] **Step 2: Replace the `<section id="quem-somos">` element in `index.html`**

Replace:
```html
    <section class="quem-somos section" id="quem-somos">
      <!-- QUEM SOMOS: preenchido na Tarefa 9 -->
    </section>
```

With:
```html
    <section class="quem-somos section" id="quem-somos">
      <div class="container quem-somos__grid">
        <div class="quem-somos__media" data-reveal>
          <img
            src="assets/img/quem-somos-placeholder.svg"
            alt="Depósito da Rocha Decor Espumas com pilhas de espuma organizadas"
            width="560"
            height="420"
            loading="lazy"
          >
        </div>

        <div class="quem-somos__texto" data-reveal>
          <p class="section-eyebrow">Quem somos</p>
          <h2 class="section-title">Parceria e qualidade para quem faz acontecer</h2>
          <p>
            A Rocha Decor Espumas é especializada na distribuição de espumas de
            qualidade, com mais de 30 anos de experiência no mercado de Londrina
            e região.
          </p>
          <p>
            Somos distribuidores oficiais das espumas Pró-Relax, que oferecem
            conforto, durabilidade e qualidade — do tipo mais fino ao mais
            espesso, sempre com o tamanho ideal para cada necessidade.
          </p>
          <a
            class="btn btn--primary"
            href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20espumas."
            target="_blank"
            rel="noopener"
          >
            Fale com a gente
          </a>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append quem-somos styles to `css/styles.css`**

```css

/* ==== QUEM SOMOS ==== */
.quem-somos__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .quem-somos__grid {
    grid-template-columns: 1fr 1fr;
  }
}

.quem-somos__media img {
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.quem-somos__texto p {
  color: var(--text-muted);
  margin-top: 1rem;
  line-height: 1.7;
}

.quem-somos__texto .btn {
  margin-top: 1.5rem;
}
```

- [ ] **Step 4: Verify in the browser**

Reload and scroll to "Quem Somos".

Expected: image and text sit side-by-side at ≥768px (image left, text right), stack vertically (image on top) below that. Both fade in independently. Placeholder image clearly shows "Foto do depósito (placeholder — substituir)".

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css assets/img/quem-somos-placeholder.svg
git commit -m "feat: add quem somos section with placeholder photo"
```

---

### Task 10: Depoimentos (carrossel)

**Files:**
- Modify: `index.html` (replace the `<section id="depoimentos">` block's contents)
- Modify: `css/styles.css` (append)
- Create: `js/testimonials.js`
- Create: `assets/img/avatar-placeholder.svg`
- Modify: `js/main.js` (replace entirely)

**Interfaces:**
- Consumes: `.section`/`.section-header`/`[data-reveal]` (Tasks 1–2)
- Produces: `initTestimonialsCarousel(): void` — autoplays every 5s, pauses on hover, wraps around, exposes prev/next buttons and dot navigation.

- [ ] **Step 1: Create `assets/img/avatar-placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <circle cx="48" cy="48" r="48" fill="#1e1e23"/>
  <circle cx="48" cy="38" r="18" fill="#8f6f2e"/>
  <rect x="18" y="60" width="60" height="36" rx="18" fill="#8f6f2e"/>
</svg>
```

- [ ] **Step 2: Replace the `<section id="depoimentos">` element in `index.html`**

Replace:
```html
    <section class="depoimentos section" id="depoimentos">
      <!-- DEPOIMENTOS: preenchido na Tarefa 10 -->
    </section>
```

With:
```html
    <section class="depoimentos section" id="depoimentos">
      <div class="container">
        <div class="section-header" data-reveal>
          <p class="section-eyebrow">Depoimentos</p>
          <h2 class="section-title">Quem compra, recomenda</h2>
        </div>

        <div class="carousel" id="testimonials-carousel" data-reveal>
          <div class="carousel__track" id="testimonials-track">
            <blockquote class="testimonial-card">
              <img src="assets/img/avatar-placeholder.svg" alt="" width="64" height="64">
              <p class="testimonial-card__estrelas" aria-hidden="true">★★★★★</p>
              <p class="testimonial-card__texto">
                "Depoimento de exemplo — substituir por um depoimento real de
                cliente antes de publicar o site."
              </p>
              <footer class="testimonial-card__autor">Nome do Cliente — Tapeceiro</footer>
            </blockquote>

            <blockquote class="testimonial-card">
              <img src="assets/img/avatar-placeholder.svg" alt="" width="64" height="64">
              <p class="testimonial-card__estrelas" aria-hidden="true">★★★★★</p>
              <p class="testimonial-card__texto">
                "Depoimento de exemplo — substituir por um depoimento real de
                cliente antes de publicar o site."
              </p>
              <footer class="testimonial-card__autor">Nome do Cliente — Estofador</footer>
            </blockquote>

            <blockquote class="testimonial-card">
              <img src="assets/img/avatar-placeholder.svg" alt="" width="64" height="64">
              <p class="testimonial-card__estrelas" aria-hidden="true">★★★★★</p>
              <p class="testimonial-card__texto">
                "Depoimento de exemplo — substituir por um depoimento real de
                cliente antes de publicar o site."
              </p>
              <footer class="testimonial-card__autor">Nome do Cliente — Revendedor</footer>
            </blockquote>
          </div>

          <div class="carousel__controls">
            <button class="carousel__arrow" id="testimonials-prev" aria-label="Depoimento anterior">‹</button>
            <div class="carousel__dots" id="testimonials-dots"></div>
            <button class="carousel__arrow" id="testimonials-next" aria-label="Próximo depoimento">›</button>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Append carousel styles to `css/styles.css`**

```css

/* ==== DEPOIMENTOS / CAROUSEL ==== */
.carousel {
  max-width: 640px;
  margin-inline: auto;
}

.carousel__track {
  display: flex;
  transition: transform 500ms ease;
}

.testimonial-card {
  flex: 0 0 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  text-align: center;
  margin: 0;
}

.testimonial-card img {
  border-radius: 50%;
  margin-inline: auto;
}

.testimonial-card__estrelas {
  color: var(--gold);
  margin-top: 1rem;
}

.testimonial-card__texto {
  color: var(--text-muted);
  margin-top: 0.75rem;
  line-height: 1.6;
}

.testimonial-card__autor {
  margin-top: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
}

.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.carousel__arrow {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--gold-light);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.2rem;
  line-height: 1;
}

.carousel__arrow:hover {
  border-color: var(--gold);
}

.carousel__dots {
  display: flex;
  gap: 0.5rem;
}

.carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  border: none;
  padding: 0;
}

.carousel__dot.is-active {
  background: var(--gold);
}
```

- [ ] **Step 4: Create `js/testimonials.js`**

```js
const AUTOPLAY_DELAY = 5000;

export function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const dotsContainer = document.getElementById('testimonials-dots');
  const prevBtn = document.getElementById('testimonials-prev');
  const nextBtn = document.getElementById('testimonials-next');

  if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.children);
  let activeIndex = 0;
  let autoplayId = null;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    dot.addEventListener('click', () => {
      goTo(index);
      startAutoplay();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function update() {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === activeIndex);
    });
  }

  function goTo(index) {
    activeIndex = (index + slides.length) % slides.length;
    update();
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function prev() {
    goTo(activeIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(next, AUTOPLAY_DELAY);
  }

  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }

  prevBtn.addEventListener('click', () => {
    prev();
    startAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    next();
    startAutoplay();
  });

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  update();
  startAutoplay();
}
```

- [ ] **Step 5: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';
import { initCounters } from './counter.js';
import { renderCatalogo } from './catalogo-render.js';
import { initTestimonialsCarousel } from './testimonials.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
  initCounters();
  renderCatalogo();
  initTestimonialsCarousel();
});
```

- [ ] **Step 6: Verify in the browser**

Reload and scroll to "Depoimentos".

Expected: one testimonial card visible at a time; it auto-advances every 5 seconds; hovering the carousel pauses autoplay, moving the mouse away resumes it; the `‹`/`›` arrows navigate and wrap around (from the 3rd back to the 1st and vice versa); the dots reflect the active slide and clicking a dot jumps straight to it.

- [ ] **Step 7: Commit**

```bash
git add index.html css/styles.css js/testimonials.js js/main.js assets/img/avatar-placeholder.svg
git commit -m "feat: add testimonials carousel with autoplay and manual nav"
```

---

### Task 11: Onde Estamos

**Files:**
- Modify: `index.html` (replace the `<section id="onde-estamos">` block's contents)
- Modify: `css/styles.css` (append)

**Interfaces:**
- Consumes: `.section`/`.section-header`/`[data-reveal]`/`.btn` variants (Tasks 1–2)
- Produces: nothing new for later tasks

- [ ] **Step 1: Replace the `<section id="onde-estamos">` element in `index.html`**

Replace:
```html
    <section class="onde-estamos section" id="onde-estamos">
      <!-- ONDE ESTAMOS: preenchido na Tarefa 11 -->
    </section>
```

With:
```html
    <section class="onde-estamos section" id="onde-estamos">
      <div class="container onde-estamos__grid">
        <div class="onde-estamos__info" data-reveal>
          <p class="section-eyebrow">Onde estamos</p>
          <h2 class="section-title">Venha nos visitar</h2>
          <p class="onde-estamos__endereco">
            Rua Ruy Virmond Carnascialli, 791<br>
            Jardim Leonor, Londrina - PR
          </p>
          <p class="onde-estamos__horario">
            Segunda a sábado — horário a confirmar
          </p>
          <div class="onde-estamos__actions">
            <a
              class="btn btn--primary"
              href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20espumas."
              target="_blank"
              rel="noopener"
            >
              Falar no WhatsApp
            </a>
            <a
              class="btn btn--secondary"
              href="https://www.google.com/maps/search/?api=1&query=Rua+Ruy+Virmond+Carnascialli+791+Londrina+PR"
              target="_blank"
              rel="noopener"
            >
              Como chegar
            </a>
          </div>
        </div>

        <div class="onde-estamos__mapa" data-reveal>
          <iframe
            title="Mapa até a Rocha Decor Espumas"
            src="https://www.google.com/maps?q=Rua+Ruy+Virmond+Carnascialli+791+Londrina+PR&output=embed"
            width="100%"
            height="360"
            style="border:0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Append onde-estamos styles to `css/styles.css`**

```css

/* ==== ONDE ESTAMOS ==== */
.onde-estamos__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .onde-estamos__grid {
    grid-template-columns: 1fr 1fr;
  }
}

.onde-estamos__endereco {
  margin-top: 1rem;
  font-size: 1.05rem;
  line-height: 1.6;
}

.onde-estamos__horario {
  margin-top: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.onde-estamos__actions {
  margin-top: 1.75rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.onde-estamos__mapa iframe {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  filter: grayscale(20%) contrast(1.05);
}
```

- [ ] **Step 3: Verify in the browser**

Reload and scroll to "Onde Estamos" (requires internet access for the map tiles to render).

Expected: address and map sit side-by-side at ≥768px, stacked below that; the map shows the Londrina area around the given address; "Como chegar" opens Google Maps directions in a new tab; "Falar no WhatsApp" `href` is the same hardcoded generic link used elsewhere.

- [ ] **Step 4: Commit**

```bash
git add index.html css/styles.css
git commit -m "feat: add onde estamos section with embedded map"
```

---

### Task 12: Footer + botão flutuante do WhatsApp

**Files:**
- Modify: `index.html` (replace the `<footer>` block's contents and the `<a id="whatsapp-float">` element)
- Modify: `css/styles.css` (append)
- Modify: `js/main.js` (replace entirely)

**Interfaces:**
- Consumes: nothing new (floating button uses the same static hardcoded WhatsApp link pattern as Tasks 4/5/9/11)
- Produces: nothing new for later tasks

- [ ] **Step 1: Replace the `<footer>` element in `index.html`**

Replace:
```html
  <footer class="footer" id="footer">
    <!-- FOOTER: preenchido na Tarefa 12 -->
  </footer>
```

With:
```html
  <footer class="footer" id="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <p class="footer__logo">Rocha <span>Decor Espumas</span></p>
        <p class="footer__endereco">
          Rua Ruy Virmond Carnascialli, 791 — Jardim Leonor, Londrina - PR
        </p>
      </div>

      <div class="footer__links">
        <!-- Handle assumido a partir do nome do repositório/bio truncada — confirmar antes de publicar. -->
        <a href="https://instagram.com/rochadecorespumas" target="_blank" rel="noopener">Instagram</a>
        <a href="https://wa.me/5543984888884" target="_blank" rel="noopener">WhatsApp</a>
      </div>

      <p class="footer__copy">
        © <span id="footer-year"></span> Rocha Decor Espumas. Todos os direitos reservados.
      </p>
    </div>
  </footer>
```

- [ ] **Step 2: Replace the `<a id="whatsapp-float">` element in `index.html`**

Replace:
```html
  <a id="whatsapp-float" class="whatsapp-float" href="#" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <!-- Ícone preenchido na Tarefa 12 -->
  </a>
```

With:
```html
  <a
    id="whatsapp-float"
    class="whatsapp-float"
    href="https://wa.me/5543984888884?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20espumas."
    target="_blank"
    rel="noopener"
    aria-label="Falar no WhatsApp"
  >
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
      <path fill="#0b0b0d" d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-2c1.9 1 4 1.5 6.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3z"/>
    </svg>
  </a>
```

- [ ] **Step 3: Append footer + floating button styles to `css/styles.css`**

```css

/* ==== FOOTER ==== */
.footer {
  border-top: 1px solid var(--border);
  padding-block: 2.5rem;
  background: var(--bg-elevated);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.footer__logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
}

.footer__logo span {
  color: var(--gold);
}

.footer__endereco {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer__links {
  display: flex;
  gap: 1.25rem;
}

.footer__links a {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  transition: color var(--transition);
}

.footer__links a:hover {
  color: var(--gold-light);
}

.footer__copy {
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* ==== BOTAO FLUTUANTE WHATSAPP ==== */
.whatsapp-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.6);
  z-index: 90;
  transition: transform var(--transition);
}

.whatsapp-float:hover {
  transform: scale(1.08);
}
```

- [ ] **Step 4: Replace `js/main.js` entirely**

```js
import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';
import { initCounters } from './counter.js';
import { renderCatalogo } from './catalogo-render.js';
import { initTestimonialsCarousel } from './testimonials.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
  initCounters();
  renderCatalogo();
  initTestimonialsCarousel();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
```

- [ ] **Step 5: Verify in the browser**

Reload and scroll through the whole page.

Expected: gold circular WhatsApp button stays fixed in the bottom-right corner through every section; its `href` is the same hardcoded generic link; footer shows the logo, Instagram + WhatsApp links, address, and "© 2026 Rocha Decor Espumas..." with the year filled in automatically (not hardcoded "2026" in the HTML source).

- [ ] **Step 6: Commit**

```bash
git add index.html css/styles.css js/main.js
git commit -m "feat: add footer and floating WhatsApp button"
```

---

### Task 13: Polimento final, acessibilidade e preparação para deploy

**Files:**
- Modify: `README.md`
- No other files expected to change unless verification below finds a concrete bug

**Interfaces:**
- Consumes: the whole site built in Tasks 1–12
- Produces: nothing (final task)

- [ ] **Step 1: Full responsive sweep**

With the server still running, open `http://localhost:8000/` and check each width using DevTools device toolbar: `360px`, `480px`, `768px`, `1024px`, `1440px`.

Expected at every width: no horizontal scrollbar, no overlapping text, header always readable, catálogo grid at the correct column count for that width (see Task 7), carousel and hero stats never clipped.

If any width breaks, fix the specific CSS rule causing it (most likely a missing `flex-wrap`, a fixed width instead of `max-width`, or a `min-width` breakpoint boundary) and re-check that width before moving on.

Note for the user (not something to execute here): this environment has no Safari/iOS device, so Safari-specific rendering (e.g. `backdrop-filter` fallback on the header, `100vh` quirks) has not been physically verified. Recommend a quick spot-check on an iPhone/Mac before publishing.

- [ ] **Step 2: Accessibility pass**

Contrast has already been computed against the WCAG formula for every text/background pair in this design (all pass AA and AAA for normal text):

| Pair | Ratio |
|---|---|
| `--text` on `--bg` | 17.43:1 |
| `--text-muted` on `--bg` | 7.78:1 |
| `--gold` on `--bg` | 9.81:1 |
| `--gold-light` on `--bg` | 13.13:1 |
| button text `#1a1305` on gold gradient | 9.19:1–12.31:1 |
| `--text-muted` on `--bg-elevated` | 7.14:1 |

Manually confirm instead:
- Every `<img>` has a non-empty, descriptive `alt` (the two decorative avatar images may use `alt=""` since they're purely decorative placeholders — already the case).
- Tab through the page using only the keyboard: header nav links, hamburger button, all WhatsApp/CTA buttons, carousel arrows and dots, and map/maps links must all be reachable and show a visible focus outline (browser default outline is acceptable — do not add `outline: none` anywhere in `css/styles.css`).
- In DevTools, open the "Rendering" tab → enable "Emulate CSS media feature prefers-reduced-motion: reduce" → reload. Scroll-reveal content must appear instantly with no fade/slide (already implemented in Task 2's CSS).

- [ ] **Step 3: JavaScript-disabled fallback check**

In Chrome DevTools → Command Menu (`Ctrl+Shift+P`) → "Disable JavaScript" → reload `http://localhost:8000/`.

Expected: header, hero, diferenciais, como funciona, quem somos, depoimentos (first card only, static), onde estamos, and footer are all fully visible with readable text. The catálogo grid is empty but the `<noscript>` fallback list and its WhatsApp link are visible instead. Every WhatsApp button across the whole page is still clickable and points to a valid `wa.me` link. Re-enable JavaScript before continuing.

- [ ] **Step 4: Lighthouse pass**

In Chrome DevTools → Lighthouse tab → run "Performance", "Accessibility", "Best Practices", "SEO" for mobile.

Expected: Accessibility and SEO scores in the 90s (title/meta description already set in Task 1; contrast already verified in Step 2). If Performance flags the Google Maps iframe as a large third-party resource, that's expected and acceptable — it's `loading="lazy"` already, and it's a deliberate feature, not a bug.

- [ ] **Step 5: Update `README.md`**

Read the current contents of `README.md` first, then replace them with:

```markdown
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
runner nativo do Node 18+.

## Editar preços e densidades do catálogo

Edite `js/catalogo-data.js`. Cada item tem `densidade`, `uso`, `precoMin`,
`precoMax` e `unidade`. Se adicionar ou remover uma densidade, atualize
também a lista dentro do `<noscript>` na seção "Catálogo" em `index.html`
(é o texto que aparece se o JavaScript não carregar).

## Antes de publicar

Ver a lista de pendências em
`docs/superpowers/specs/2026-08-10-landing-page-rocha-decor-design.md`
(seção 10): logo real, fotos reais, preços reais, depoimentos reais,
horário de funcionamento e confirmação do handle do Instagram.

## Deploy (GitHub Pages)

No repositório no GitHub: Settings → Pages → Source → Deploy from a
branch → `main` → `/ (root)`. Nenhuma configuração de build é necessária.
```

- [ ] **Step 6: Commit**

```bash
git add README.md
git commit -m "docs: add setup, testing, and deploy instructions to README"
```
