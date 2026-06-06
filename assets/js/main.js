/* ══════════════════════════════════════════════════════
   PRSS · main.js
   ══════════════════════════════════════════════════════ */

/* ── Navbar: transparent → scrolled ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile hamburger ── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

/* ── Intersection Observer: scroll-in animations ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* ── Smooth-scroll for all internal anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Counter animation for numbers section ── */
function animateCounter(el) {
  const raw   = el.dataset.target;
  const isInt = !raw.includes('.');
  const target = parseFloat(raw);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = target * ease;
    el.textContent = (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.numero-value[data-target]').forEach(el => counterObserver.observe(el));

/* ── Active nav highlight on scroll ── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const onScrollActive = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', onScrollActive, { passive: true });
