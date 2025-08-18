gsap.registerPlugin(ScrollTrigger);

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

class KPPFancyTitle extends HTMLElement {
  static get observedAttributes() { return ['text', 'size']; }
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

    const h1 = document.createElement('h1');
    h1.textContent = text;
    h1.setAttribute('data-text', text);
    root.appendChild(h1);
  }
}

customElements.define('kpp-fancy-title', KPPFancyTitle);

function applyFancyTitles() {
  document.querySelectorAll('h1').forEach(h1 => {
    if (h1.closest('kpp-fancy-title')) return;
    const fancy = document.createElement('kpp-fancy-title');
    fancy.setAttribute('size', 'large');
    fancy.setAttribute('text', h1.textContent.trim());
    if (h1.className) fancy.className = h1.className;
    if (h1.dataset.i18n) fancy.setAttribute('data-i18n', h1.dataset.i18n);
    h1.replaceWith(fancy);
  });
  document.querySelectorAll('h2').forEach(h2 => {
    const fancy = document.createElement('kpp-fancy-title');
    fancy.setAttribute('size', 'medium');
    fancy.setAttribute('text', h2.textContent.trim());
    if (h2.className) fancy.className = h2.className;
    if (h2.id) fancy.id = h2.id;
    if (h2.dataset.i18n) fancy.setAttribute('data-i18n', h2.dataset.i18n);
    h2.replaceWith(fancy);
  });
}

applyFancyTitles();

document.querySelectorAll('section, .wp-section').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 40,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%'
    }
  });
});

const translations = {}

async function loadLanguage(lang) {
  if (!translations[lang]) {
    const response = await fetch(`locales/${lang}.json`);
    translations[lang] = await response.json();
  }
}


async function setLanguage(lang) {
  await loadLanguage(lang);
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) {
      if (el.tagName === 'KPP-FANCY-TITLE') {
        el.setAttribute('text', text);
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = translations[lang][key];
    if (text) {
      el.setAttribute('placeholder', text);
    }
  });
  document.querySelectorAll('.lang-block').forEach(block => {
    block.style.display = block.dataset.lang === lang ? 'block' : 'none';
  });
  const page = document.body.dataset.page;
  const titleKey = `title_${page}`;
  if (translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }
  const select = document.querySelector('.lang-select');
  if (select) select.value = lang;
}

const currentLang = localStorage.getItem('lang') || 'ko';
setLanguage(currentLang);

const select = document.querySelector('.lang-select');
if (select) {
  select.addEventListener('change', e => setLanguage(e.target.value));
}

const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('open');
  });
}

const themeBtn = document.querySelector('.theme-toggle');
if (themeBtn) {
  const setIcon = theme => {
    themeBtn.innerHTML = theme === 'dark'
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  };
  setIcon(savedTheme);
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIcon(next);
  });
}

const hero = document.querySelector('.hero');
const fancy = document.querySelector('.hero-title');
if (hero && fancy) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(fancy, { rotationY: x * 30, rotationX: -y * 30, ease: 'power2.out' });
  });
  hero.addEventListener('mouseleave', () => {
    gsap.to(fancy, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
  });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async e => {
    e.preventDefault();
    const lang = localStorage.getItem('lang') || 'ko';
    await loadLanguage(lang);
    alert(translations[lang].newsletter_success);
    newsletterForm.reset();
  });
}
