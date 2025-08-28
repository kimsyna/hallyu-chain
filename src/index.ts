import { initTheme } from './theme.ts';
import { loadStakingStatus } from './staking.ts';
import {
  initI18n,
  loadLanguage,
  translate,
  DEFAULT_LANG,
  currentLang,
} from './i18n.ts';
import { initNav } from './nav.ts';
import { applyFancyTitles } from './fancy-title.ts';
import { initAnimations, prefersReducedMotion } from './animations.ts';

applyFancyTitles();
initNav();
initAnimations();

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterMessage = document.querySelector('.newsletter-success');
let newsletterTimeout;

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = localStorage.getItem('lang') || DEFAULT_LANG;
    // Load the selected language and use the resolved value to handle fallbacks
    const resolvedLang = (await loadLanguage(lang)) || DEFAULT_LANG;
    newsletterMessage.textContent = translate(
      'newsletter_success',
      resolvedLang
    );
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

async function loadPartners() {
  const container = document.getElementById('partners-grid');
  if (!container) return;
  try {
    await loadLanguage(currentLang);
    const resp = await fetch('partners.json');
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    const partners = await resp.json();
    partners.forEach((p) => {
      const item = document.createElement('div');
      item.className = 'logo-item';

      const link = document.createElement('a');
      link.href = p.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.src = p.logo;
      img.alt = p.alt;
      img.loading = 'lazy';

      const icon = document.createElement('i');
      icon.className = 'material-symbols-outlined';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = p.icon;

      const name = document.createElement('span');
      name.setAttribute('data-i18n', p.nameKey);
      name.textContent = translate(p.nameKey);

      const desc = document.createElement('p');
      desc.setAttribute('data-i18n', p.descKey);
      desc.textContent = translate(p.descKey);

      link.append(img, icon, name, desc);
      item.append(link);
      container.append(item);
    });
  } catch (err) {
    console.error('Failed to load partners:', err);
  }
}

initTheme();
initI18n();
loadStakingStatus();
loadPartners();
