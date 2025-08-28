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

const newsletterForm = document.querySelector<HTMLFormElement>('.newsletter-form');
const newsletterMessage = document.querySelector<HTMLElement>('.newsletter-success');
let newsletterTimeout: number;

if (newsletterForm && newsletterMessage) {
  const endpoint =
    newsletterForm.dataset.endpoint ||
    (window as any).NEWSLETTER_API_URL ||
    '';
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector<HTMLInputElement>(
      'input[type="email"]'
    );
    if (!emailInput) return;

    const lang = localStorage.getItem('lang') || DEFAULT_LANG;
    // Load the selected language and use the resolved value to handle fallbacks
    const resolvedLang = (await loadLanguage(lang)) || DEFAULT_LANG;
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.value }),
      });
      if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
      newsletterMessage.textContent = translate(
        'newsletter_success',
        resolvedLang
      );
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      newsletterMessage.textContent = translate(
        'newsletter_error',
        resolvedLang
      );
    }
    newsletterMessage.hidden = false;
    clearTimeout(newsletterTimeout);
    newsletterTimeout = window.setTimeout(() => {
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

async function loadResources() {
  const list = document.getElementById('resources-list');
  if (!list) return;
  try {
    await loadLanguage(currentLang);
    const resp = await fetch('resources.json');
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    const resources = await resp.json();
    resources.forEach((r) => {
      const li = document.createElement('li');

      const icon = document.createElement('i');
      icon.className = 'material-symbols-outlined';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = r.icon;

      const link = document.createElement('a');
      link.href = r.url;
      if (r.url.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }

      const label = document.createElement('span');
      label.setAttribute('data-i18n', r.nameKey);
      label.textContent = translate(r.nameKey);

      link.append(label);
      li.append(icon, link);
      list.append(li);
    });
  } catch (err) {
    console.error('Failed to load resources:', err);
  }
}

initTheme();
initI18n();
loadStakingStatus();
loadPartners();
loadResources();
