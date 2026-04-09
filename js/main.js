// Navbar scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => observer.observe(el));

// Active nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  }),
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── Nail-pivot physics tilt ───────────────────────────────────────────────
// The card rests balanced on a single pin at its center.
// Cursor position relative to center determines which edge sinks.
// Uses a simple spring simulation: current state chases a target each frame.

(function () {
  const frame = document.querySelector('.hero-photo-frame');
  if (!frame) return;

  // Spring config — tweak these to taste
  const MAX_TILT   = 9;      // max degrees of rotation in any direction
  const STIFFNESS  = 0.10;   // how quickly it chases the target (0–1)
  const DAMPING    = 0.72;   // how much velocity bleeds off each frame (0–1)

  let targetX = 0, targetY = 0;   // rotation angles we're chasing
  let currentX = 0, currentY = 0; // current rendered angles
  let velX = 0, velY = 0;         // spring velocity
  let rafId = null;
  let isHovering = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    // Spring: acceleration = (target - current) * stiffness
    // velocity = velocity * damping + acceleration
    const ax = (targetX - currentX) * STIFFNESS;
    const ay = (targetY - currentY) * STIFFNESS;
    velX = velX * DAMPING + ax;
    velY = velY * DAMPING + ay;
    currentX += velX;
    currentY += velY;

    frame.style.transform =
      `perspective(600px) rotateX(${currentX.toFixed(3)}deg) rotateY(${currentY.toFixed(3)}deg)`;

    // Keep animating until fully settled
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
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    // Normalised offset from center: -1 (top-left) to +1 (bottom-right)
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

    // rotateX: negative when cursor is near bottom (bottom sinks → front tilts down)
    // rotateY: positive when cursor is near right  (right sinks → front tilts right)
    targetX = -ny * MAX_TILT;
    targetY =  nx * MAX_TILT;
    startTick();
  });

  frame.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    startTick();
  });
})();
