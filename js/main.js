const nav = document.getElementById('nav');
const body = document.body;
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function syncBodyLock() {
  body.classList.toggle('overlay-open', mobileMenu.classList.contains('open'));
}

function setMenuOpen(isOpen) {
  hamburger.classList.toggle('open', isOpen);
  mobileMenu.classList.toggle('open', isOpen);
  syncBodyLock();
}

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  setMenuOpen(!mobileMenu.classList.contains('open'));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((element) => observer.observe(element));

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((anchor) => anchor.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }),
  { threshold: 0.4 }
);
sections.forEach((section) => sectionObserver.observe(section));

/* ── Hero Tilt Effect ── */
(function () {
  const frame = document.querySelector('.hero-photo-frame');

  if (!frame) {
    return;
  }

  const MAX_TILT = 9;
  const STIFFNESS = 0.1;
  const DAMPING = 0.72;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let velX = 0;
  let velY = 0;
  let rafId = null;

  function tick() {
    const ax = (targetX - currentX) * STIFFNESS;
    const ay = (targetY - currentY) * STIFFNESS;
    velX = velX * DAMPING + ax;
    velY = velY * DAMPING + ay;
    currentX += velX;
    currentY += velY;

    frame.style.transform =
      `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

    const settled =
      Math.abs(currentX - targetX) < 0.01 &&
      Math.abs(currentY - targetY) < 0.01 &&
      Math.abs(velX) < 0.01 &&
      Math.abs(velY) < 0.01;

    if (!settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      currentX = targetX;
      currentY = targetY;
      velX = 0;
      velY = 0;
      frame.style.transform =
        `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  }

  frame.addEventListener('mousemove', (event) => {
    const rect = frame.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    targetX = -ny * MAX_TILT;
    targetY = nx * MAX_TILT;
    startTick();
  });

  frame.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startTick();
  });
})();

/* ── Project Slider ── */
(function () {
  const container = document.querySelector('.project-slider-container');
  if (!container) return;

  const gallery = container.querySelector('.project-gallery');
  const slides = container.querySelectorAll('.project-shot');
  const prevBtn = container.querySelector('.slider-arrow.prev');
  const nextBtn = container.querySelector('.slider-arrow.next');
  
  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlider() {
    gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Optional: Keyboard navigation
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });
})();

syncBodyLock();
