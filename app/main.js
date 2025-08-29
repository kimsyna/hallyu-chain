import { initTheme } from './theme.js';
import { loadStakingStatus } from './staking.js';
import {
  initI18n,
  loadLanguage,
  t,
  DEFAULT_LANG,
  currentLang,
} from './i18n.js';
import { initNav } from './nav.js';
import { applyFancyTitles } from './fancy-title.js';
import { initAnimations, prefersReducedMotion } from './animations.js';
import { initRouter } from './router.js';
import { h } from './lib/dom.js';

applyFancyTitles();
initNav();
initAnimations();
initRouter();

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterMessage = document.querySelector(
  '.newsletter-success'
);
let newsletterTimeout;

if (newsletterForm && newsletterMessage) {
  const endpoint =
    newsletterForm.dataset.endpoint || window.NEWSLETTER_API_URL || '';
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector(
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
      newsletterMessage.textContent = t(
        'newsletter_success',
        resolvedLang
      );
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      newsletterMessage.textContent = t(
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
      const item = h(
        'div',
        { className: 'logo-item' },
        h(
          'a',
          {
            href: p.url,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          h('img', { src: p.logo, alt: p.alt, loading: 'lazy' }),
          h(
            'i',
            { className: 'material-symbols-outlined', 'aria-hidden': 'true' },
            p.icon
          ),
          h(
            'span',
            { 'data-i18n': p.nameKey },
            t(p.nameKey)
          ),
          h(
            'p',
            { 'data-i18n': p.descKey },
            t(p.descKey)
          )
        )
      );
      container.append(item);
    });
  } catch (err) {
    console.error('Failed to load partners:', err);
  }
}

async function loadResources() {
  const list = document.getElementById('resources-list');
  if (!list) return;
  list.innerHTML = '';
  try {
    await loadLanguage(currentLang);
    const [resResp, addrResp] = await Promise.all([
      fetch('resources.json'),
      fetch('token-address.json'),
    ]);
    if (!resResp.ok) throw new Error(`HTTP error ${resResp.status}`);
    const resources = await resResp.json();
    if (addrResp.ok) {
      const addresses = await addrResp.json();
      if (addresses.mainnet?.HallyuToken) {
        resources.push({
          nameKey: 'res_token_mainnet',
          icon: 'token',
          url: `https://etherscan.io/token/${addresses.mainnet.HallyuToken}`,
        });
      }
      if (addresses.testnet?.HallyuToken) {
        resources.push({
          nameKey: 'res_token_testnet',
          icon: 'token',
          url: `https://sepolia.etherscan.io/token/${addresses.testnet.HallyuToken}`,
        });
      }
    }
    resources.forEach((r) => {
      const linkProps = { href: r.url };
      if (r.url.startsWith('http')) {
        linkProps.target = '_blank';
        linkProps.rel = 'noopener noreferrer';
      }
      const li = h(
        'li',
        {},
        h(
          'i',
          { className: 'material-symbols-outlined', 'aria-hidden': 'true' },
          r.icon
        ),
        h(
          'a',
          linkProps,
          h('span', { 'data-i18n': r.nameKey }, t(r.nameKey))
        )
      );
      list.append(li);
    });
  } catch (err) {
    console.error('Failed to load resources:', err);
  }
}

async function loadTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  try {
    await loadLanguage(currentLang);
    const resp = await fetch('team.json');
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    const team = await resp.json();
    team.forEach((m) => {
      const member = h(
        'div',
        { className: 'member' },
        h(
          'a',
          { href: m.link, target: '_blank', rel: 'noopener noreferrer' },
          h('img', {
            src: m.image,
            alt: t(m.altKey),
            loading: 'lazy',
            'data-i18n-alt': m.altKey,
          }),
          h('h3', {}, m.name)
        ),
        h('p', { 'data-i18n': m.roleKey }, t(m.roleKey)),
        h('p', { 'data-i18n': m.bioKey }, t(m.bioKey))
      );
      grid.append(member);
    });
  } catch (err) {
    console.error('Failed to load team:', err);
  }
}

initTheme();
initI18n();
loadStakingStatus();
loadPartners();
loadResources();
loadTeam();
