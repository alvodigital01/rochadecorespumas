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
