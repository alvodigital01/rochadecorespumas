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
