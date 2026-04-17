'use strict';

/**
 * Sidebar toggle for mobile
 */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () {
  sidebar.classList.toggle("active");
});

/**
 * Tab Navigation
 */
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

/**
 * Contact Form Validation
 */
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

/**
 * Project Slider
 */
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

  // Keyboard navigation
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

/**
 * Avatar Tilt Effect (Optimized for new sidebar)
 */
(function () {
  const frame = document.querySelector('.avatar-box');
  if (!frame) return;

  const MAX_TILT = 10;
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

    frame.style.transform = `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

    const settled = Math.abs(currentX - targetX) < 0.01 && Math.abs(currentY - targetY) < 0.01 && Math.abs(velX) < 0.01 && Math.abs(velY) < 0.01;

    if (!settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      currentX = targetX;
      currentY = targetY;
      velX = 0;
      velY = 0;
      frame.style.transform = `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
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
