/**
 * AURORA GLASS — VIBRANT PORTFOLIO LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Reveal Animations on Scroll
   */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));


  /**
   * Dock Navigation Active State
   */
  const sections = document.querySelectorAll('section');
  const dockLinks = document.querySelectorAll('.dock-link');

  window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    dockLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });


  /**
   * Aurora Blobs Mouse Tracking (Subtle Interactivity)
   */
  const auroraContainer = document.querySelector('.aurora-container');
  const blobs = document.querySelectorAll('.aurora-blob');

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    blobs.forEach((blob, index) => {
      const speed = (index + 1) * 20;
      const xOffset = (x - 0.5) * speed;
      const yOffset = (y - 0.5) * speed;
      blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });


  /**
   * Hero Image Tilt Effect
   */
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }


  /**
   * Simple Form Handling
   */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const originalText = btn.innerText;
      
      btn.innerText = 'Sending...';
      btn.disabled = true;

      // Simulate sending
      setTimeout(() => {
        btn.innerText = 'Message Sent!';
        btn.style.background = 'var(--accent-2)';
        contactForm.reset();
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = 'var(--accent-1)';
          btn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

});
