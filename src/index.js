import { initTheme } from './theme.js';
import { loadStakingStatus } from './staking.js';
import { initI18n, loadLanguage, translate, DEFAULT_LANG } from './i18n.js';

gsap.registerPlugin(ScrollTrigger);

// Respect users who prefer reduced motion by checking their system setting
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let prefersReducedMotion = reduceMotionQuery.matches;

function updateNavHeight() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const height = navbar.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--nav-height', `${height}px`);
  document.documentElement.style.scrollPaddingTop = `${height}px`;
  document.body.style.paddingTop = `${height}px`;
}

updateNavHeight();
window.addEventListener('resize', updateNavHeight);

// Hide decorative icons from screen readers
document
  .querySelectorAll('.material-symbols-outlined')
  .forEach((icon) => icon.setAttribute('aria-hidden', 'true'));

class HCFancyTitle extends HTMLElement {
  static get observedAttributes() {
    return ['text', 'size'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback() {
    this.render();
  }
  render() {
    const text = this.getAttribute('text') || '';
    const size = this.getAttribute('size') || 'large';
    const root = this.shadowRoot;

    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }

    const style = document.createElement('style');
    style.textContent = `
        :host { display: inline-block; }
        h1 {
          font-family: 'Poppins', sans-serif;
          font-size: ${size === 'medium' ? '1.8rem' : 'clamp(2.5rem, 8vw, 4rem)'};
          margin: 0;
          position: relative;
          background: linear-gradient(45deg,#ff0080,#ffcd00,#00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        h1::before, h1::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          mix-blend-mode: screen;
          animation: glitch 2s infinite;
        }
        h1::before { color: #f0f; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
        h1::after { color: #0ff; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px,-2px); }
          40% { transform: translate(2px,2px); }
          60% { transform: translate(-2px,2px); }
          80% { transform: translate(2px,-2px); }
          100% { transform: translate(0); }
        }
    `;
    root.appendChild(style);

    this.setAttribute('role', 'heading');
    this.setAttribute('aria-level', size === 'medium' ? '2' : '1');

    const h1 = document.createElement('h1');
    h1.textContent = text;
    h1.setAttribute('data-text', text);
    root.appendChild(h1);
  }
}

customElements.define('hc-fancy-title', HCFancyTitle);

function applyFancyTitles() {
  document.querySelectorAll('h1').forEach((h1) => {
    if (h1.closest('hc-fancy-title')) return;
    const fancy = document.createElement('hc-fancy-title');
    fancy.setAttribute('size', 'large');
    fancy.setAttribute('text', h1.textContent.trim());
    if (h1.className) fancy.className = h1.className;
    if (h1.dataset.i18n) fancy.setAttribute('data-i18n', h1.dataset.i18n);
    h1.replaceWith(fancy);
  });
  document.querySelectorAll('h2').forEach((h2) => {
    if (h2.closest('hc-fancy-title')) return;
    const fancy = document.createElement('hc-fancy-title');
    fancy.setAttribute('size', 'medium');
    fancy.setAttribute('text', h2.textContent.trim());
    if (h2.className) fancy.className = h2.className;
    if (h2.id) fancy.id = h2.id;
    if (h2.dataset.i18n) fancy.setAttribute('data-i18n', h2.dataset.i18n);
    h2.replaceWith(fancy);
  });
}
window.applyFancyTitles = applyFancyTitles;

applyFancyTitles();

function applyAnimations() {
  // Remove any existing ScrollTriggers to avoid duplicates
  ScrollTrigger.getAll().forEach((t) => t.kill());

  const sections = document.querySelectorAll('section, .wp-section');
  if (!prefersReducedMotion) {
    sections.forEach((section) => {
      // Clear inline styles that may have been set when motion was reduced
      section.style.opacity = '';
      section.style.transform = '';
      gsap.from(section, {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      });
    });
  } else {
    // Make sure sections remain visible without animation
    sections.forEach((section) => {
      section.style.opacity = 1;
      section.style.transform = 'none';
    });
  }
}

applyAnimations();

reduceMotionQuery.addEventListener('change', (event) => {
  prefersReducedMotion = event.matches;
  applyAnimations();
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('primary-navigation');
if (navLinks) navLinks.setAttribute('aria-hidden', 'true');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const navbar = document.querySelector('.navbar');
    const open = navbar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    navLinks.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) {
      const firstLink = navLinks.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      const navbar = document.querySelector('.navbar');
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'true');
    }
  });
  navLinks.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const navbar = document.querySelector('.navbar');
    if (!navbar.classList.contains('open')) return;
    const links = navLinks.querySelectorAll('a');
    const firstLink = links[0];
    const lastLink = links[links.length - 1];
    if (!e.shiftKey && document.activeElement === lastLink) {
      e.preventDefault();
      firstLink.focus();
    } else if (e.shiftKey && document.activeElement === firstLink) {
      e.preventDefault();
      lastLink.focus();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const navbar = document.querySelector('.navbar');
  if (!navbar.classList.contains('open')) return;
  navbar.classList.remove('open');
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  if (navLinks) navLinks.setAttribute('aria-hidden', 'true');
});

const hero = document.querySelector('.hero');
const fancy = document.querySelector('.hero-title');
// Disable fancy hero animation if reduced motion is requested
if (hero && fancy && !prefersReducedMotion) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(fancy, {
      rotationY: x * 30,
      rotationX: -y * 30,
      ease: 'power2.out',
    });
  });
  hero.addEventListener('mouseleave', () => {
    gsap.to(fancy, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  });
}

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterMessage = document.querySelector('.newsletter-success');
let newsletterTimeout;

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem('lang') || DEFAULT_LANG;
    // Load the selected language and use the resolved value to handle fallbacks
    const resolvedLang = (await loadLanguage(lang)) || DEFAULT_LANG;
    newsletterMessage.textContent =
      translate('newsletter_success', resolvedLang);
    newsletterMessage.hidden = false;
    clearTimeout(newsletterTimeout);
    newsletterTimeout = setTimeout(() => {
      newsletterMessage.hidden = true;
      newsletterMessage.textContent = '';
    }, 5000);
    newsletterForm.reset();
  });
}

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  // Respect reduced motion setting for scroll behavior
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  });
}



initTheme();
initI18n();
loadStakingStatus();
