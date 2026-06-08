// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
    }
  }, 800);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = Math.random() * 0.6 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 500 + 300;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.life++;
      if (this.life > this.maxLife * 0.8) {
        this.opacity -= 0.003;
      }
      if (this.y < -10 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // Violet-tinted particles for the minimalist theme
      ctx.fillStyle = `rgba(183, 156, 250, ${this.opacity})`;
      ctx.fill();
    }
  }
  
  for (let i = 0; i < 40; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}
initParticles();

// ===== AOS INIT =====
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 900,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-in-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}
initScrollReveal();

// ===== CHANTING COUNTER =====
let chantCount = 0;
let targetRounds = 16;
const mantrasPerRound = 108;

function incrementChant() {
  chantCount++;
  const counter = document.getElementById('chantCount');
  if (counter) counter.textContent = chantCount;
  
  const circle = document.getElementById('chantCircle');
  if (circle) {
    circle.style.borderColor = 'var(--violet-400)';
    circle.style.boxShadow = '0 0 60px rgba(124, 77, 255, 0.2)';
    setTimeout(() => {
      circle.style.borderColor = 'rgba(124, 77, 255, 0.3)';
      circle.style.boxShadow = 'none';
    }, 300);
  }
  
  const total = targetRounds * mantrasPerRound;
  if (chantCount === total) {
    showCelebrationPopup(targetRounds);
    const progress = document.getElementById('roundProgress');
    if (progress) progress.textContent = 'Congratulations! You completed ' + targetRounds + ' rounds!';
  }
}

function setRounds(n) {
  targetRounds = n;
  chantCount = 0;
  const counter = document.getElementById('chantCount');
  if (counter) counter.textContent = '0';
  const progress = document.getElementById('roundProgress');
  if (progress) progress.textContent = 'Target: ' + n + ' rounds (' + (n * mantrasPerRound).toLocaleString() + ' mantras)';
  
  document.querySelectorAll('.round-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== KIRTANS FILTER BUTTONS =====
function initKirtansFilter() {
  const filterButtons = document.querySelectorAll('.round-options .round-btn');
  const kirtanSections = document.querySelectorAll('[data-kirtan-filter]');
  if (!filterButtons.length || !kirtanSections.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));

      kirtanSections.forEach(section => {
        section.hidden = filter !== 'all' && section.dataset.kirtanFilter !== filter;
      });
    });
  });
}

initKirtansFilter();

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});

// ===== CENTER MODE CAROUSEL INITIALIZER =====
function initCenterCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = container.querySelector('.carousel-track');
  const slides = Array.from(container.querySelectorAll('.carousel-slide'));
  const nextBtn = container.querySelector('.next-btn');
  const prevBtn = container.querySelector('.prev-btn');
  const dotsContainer = container.querySelector('.carousel-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0; // Start at first slide

  // Clear and create dot navigation
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('carousel-dot');
    if (idx === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));

  function updateCarousel() {
    const containerWidth = container.offsetWidth;
    const slideWidth = slides[0].offsetWidth;

    // Center Mode Translation Formula:
    // translateX = (containerWidth / 2) - (currentIndex * slideWidth + slideWidth / 2)
    const translateX = (containerWidth / 2) - (currentIndex * slideWidth + slideWidth / 2);
    
    track.style.transform = `translateX(${translateX}px)`;

    // Update slide classes for active scaling
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active-slide', idx === currentIndex);
    });

    // Update dot active state
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, slides.length - 1));
    updateCarousel();
  }

  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      goToSlide(0); // Loop back to start
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else {
      goToSlide(slides.length - 1); // Loop to end
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Swipe / Touch Gestures for Mobile
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentX = startX; // Reset currentX
    isDragging = true;
    track.style.transition = 'none'; // Disable transition during drag
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Show real-time drag position
    const containerWidth = container.offsetWidth;
    const slideWidth = slides[0].offsetWidth;
    const baseTranslateX = (containerWidth / 2) - (currentIndex * slideWidth + slideWidth / 2);
    track.style.transform = `translateX(${baseTranslateX + diff}px)`;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      // Re-align if swipe threshold not met
      updateCarousel();
    }
  });

  // Re-calculate on window resize
  window.addEventListener('resize', updateCarousel);

  // Call initially (with a small timeout to let the DOM settle and render)
  setTimeout(updateCarousel, 150);
}

// Initialize all page carousels
document.addEventListener('DOMContentLoaded', () => {
  initCenterCarousel('trending-carousel');
  initCenterCarousel('emotional-carousel');
  initCenterCarousel('meditation-carousel');
});

// ===== CONFETTI CELEBRATION EFFECT =====
function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '999999';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  const colors = ['#FF0D54', '#14D2F4', '#FFD700', '#7C4DFF', '#39FF14', '#FF6700'];
  const confettiCount = 120;
  const particles = [];

  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height - 20;
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 4 + 4;
      this.speedX = (Math.random() - 0.5) * 3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.4);
      ctx.restore();
    }
  }

  for (let i = 0; i < confettiCount; i++) {
    particles.push(new ConfettiParticle());
  }

  let animationFrameId;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    let alive = false;
    
    particles.forEach(p => {
      p.update();
      p.draw();
      if (p.y < height + 20) {
        alive = true;
      }
    });

    if (alive && Date.now() - startTime < 5000) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.remove();
    }
  }

  animate();
}

// ===== CELEBRATION POPUP MODAL =====
function showCelebrationPopup(rounds) {
  triggerConfetti();

  const overlay = document.createElement('div');
  overlay.className = 'celebration-popup-overlay';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.backgroundColor = 'rgba(16, 44, 87, 0.45)';
  overlay.style.backdropFilter = 'blur(12px)';
  overlay.style.webkitBackdropFilter = 'blur(12px)';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';

  const content = document.createElement('div');
  content.className = 'celebration-popup-content';
  content.style.background = 'var(--white)';
  content.style.border = '2px solid var(--violet-300)';
  content.style.borderRadius = '24px';
  content.style.padding = '40px 30px';
  content.style.maxWidth = '420px';
  content.style.width = '90%';
  content.style.textAlign = 'center';
  content.style.boxShadow = 'var(--shadow-xl)';
  content.style.transform = 'scale(0.8) translateY(20px)';
  content.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

  content.innerHTML = `
    <div style="font-size: 3.5rem; margin-bottom: 20px; animation: float 3s ease-in-out infinite;">🦚</div>
    <h2 style="font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 12px; font-size: 2rem; font-weight: 900;">Haribol!</h2>
    <p style="color: var(--brand-blue-dark); font-weight: 700; font-size: 1.15rem; margin-bottom: 8px;">Round Completed Successfully!</p>
    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 28px;">
      Congratulations! You have completed your target of <strong>${rounds} ${rounds === 1 ? 'Round' : 'Rounds'}</strong> (${(rounds * 108).toLocaleString()} mantras). Keep chanting and stay blessed!
    </p>
    <button class="btn-golden" id="closeCelebrationBtn" style="padding: 12px 36px; font-size: 0.88rem; font-weight: 700; border-radius: 100px; cursor: pointer; border: none; background: var(--gradient-saffron); color: var(--white); text-transform: uppercase; letter-spacing: 0.04em;">
      Chant Again
    </button>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Trigger reflow to start transition
  overlay.offsetWidth;

  // Fade in and scale up
  overlay.style.opacity = '1';
  content.style.transform = 'scale(1) translateY(0)';

  const closePopup = () => {
    overlay.style.opacity = '0';
    content.style.transform = 'scale(0.8) translateY(20px)';
    setTimeout(() => {
      overlay.remove();
    }, 400);
  };

  content.querySelector('#closeCelebrationBtn').addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });
}
