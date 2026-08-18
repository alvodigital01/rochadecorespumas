const initializedButtons = new WeakSet();
let effectsInitialized = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getMagneticOffset(pointerX, pointerY, rect) {
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);
  const ratioX = clamp((pointerX - rect.left) / width, 0, 1);
  const ratioY = clamp((pointerY - rect.top) / height, 0, 1);

  return {
    x: (ratioX - 0.5) * 10,
    y: (ratioY - 0.5) * 7,
    glowX: ratioX * 100,
    glowY: ratioY * 100,
  };
}

export function getRippleGeometry(pointerX, pointerY, rect) {
  const x = Number.isFinite(pointerX) ? pointerX - rect.left : rect.width / 2;
  const y = Number.isFinite(pointerY) ? pointerY - rect.top : rect.height / 2;
  const farthestX = Math.max(x, rect.width - x);
  const farthestY = Math.max(y, rect.height - y);

  return {
    x,
    y,
    diameter: Math.hypot(farthestX, farthestY) * 2,
  };
}

function playEntrance(button, delay = 0) {
  if (typeof button.animate !== 'function') return;

  button.animate(
    [
      { opacity: 0, filter: 'blur(5px)', scale: 0.96 },
      { opacity: 1, filter: 'blur(0)', scale: 1 },
    ],
    {
      duration: 560,
      delay,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'backwards',
    },
  );
}

function createRipple(button, event) {
  const rect = button.getBoundingClientRect();
  const isKeyboardClick = event.detail === 0;
  const geometry = getRippleGeometry(
    isKeyboardClick ? Number.NaN : event.clientX,
    isKeyboardClick ? Number.NaN : event.clientY,
    rect,
  );
  const ripple = document.createElement('span');

  ripple.className = 'button-fx__ripple';
  ripple.setAttribute('aria-hidden', 'true');
  ripple.style.left = `${geometry.x}px`;
  ripple.style.top = `${geometry.y}px`;
  ripple.style.width = `${geometry.diameter}px`;
  ripple.style.height = `${geometry.diameter}px`;
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  button.appendChild(ripple);
}

function isVisible(element) {
  const styles = window.getComputedStyle(element);
  return styles.display !== 'none' && styles.visibility !== 'hidden' && element.getClientRects().length > 0;
}

export function initButtonEffects() {
  if (effectsInitialized) return;

  const buttons = [...document.querySelectorAll('[data-button-effect]')];
  if (!buttons.length) return;
  effectsInitialized = true;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  buttons.forEach((button) => {
    button.classList.add('button-fx');
    if (initializedButtons.has(button) || reducedMotion.matches) return;

    initializedButtons.add(button);
    button.addEventListener('click', (event) => createRipple(button, event));

    if (finePointer.matches) {
      let frameId = 0;
      let latestEvent = null;

      button.addEventListener('pointermove', (event) => {
        latestEvent = event;
        if (frameId) return;

        frameId = window.requestAnimationFrame(() => {
          const rect = button.getBoundingClientRect();
          const offset = getMagneticOffset(latestEvent.clientX, latestEvent.clientY, rect);

          button.classList.remove('is-resetting');
          button.style.translate = `${offset.x.toFixed(2)}px ${offset.y.toFixed(2)}px`;
          button.style.setProperty('--button-glow-x', `${offset.glowX.toFixed(1)}%`);
          button.style.setProperty('--button-glow-y', `${offset.glowY.toFixed(1)}%`);
          frameId = 0;
        });
      });

      button.addEventListener('pointerleave', () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }

        button.classList.add('is-resetting');
        button.style.translate = '0px 0px';
        button.style.setProperty('--button-glow-x', '50%');
        button.style.setProperty('--button-glow-y', '50%');
        window.setTimeout(() => button.classList.remove('is-resetting'), 280);
      });
    }
  });

  if (reducedMotion.matches) return;

  window.requestAnimationFrame(() => {
    buttons.filter(isVisible).forEach((button, index) => playEntrance(button, 80 + index * 80));
  });

  const mobileNav = document.getElementById('header-nav');
  const mobileButton = document.querySelector('.header__mobile-button[data-button-effect]');

  if (mobileNav && mobileButton && typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      if (mobileNav.classList.contains('is-open')) playEntrance(mobileButton, 80);
    });

    observer.observe(mobileNav, { attributes: true, attributeFilter: ['class'] });
  }
}
