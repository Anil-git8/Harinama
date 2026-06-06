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
  if (chantCount >= total) {
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

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});
