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
