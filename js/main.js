import { initScrollReveal } from './scroll-reveal.js';
import { initHeaderNav } from './nav.js';
import { renderCatalogo } from './catalogo-render.js';
import { initButtonEffects } from './button-effects.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initHeaderNav();
  renderCatalogo();
  initButtonEffects();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
