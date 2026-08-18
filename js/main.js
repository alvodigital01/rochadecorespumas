import { initScrollReveal } from './scroll-reveal.js';
import { renderCatalogo } from './catalogo-render.js';
import { initTestimonialsCarousel } from './testimonials.js';

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  renderCatalogo();
  initTestimonialsCarousel();

  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
