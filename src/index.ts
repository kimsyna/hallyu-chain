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
import { initRouter } from './router.ts';

applyFancyTitles();
initNav();
initAnimations();
initRouter();

const newsletterForm =
  document.querySelector<HTMLFormElement>('.newsletter-form');
const newsletterMessage = document.querySelector<HTMLElement>(
  '.newsletter-success'
);
let newsletterTimeout: number;

if (newsletterForm && newsletterMessage) {
  const endpoint =
    newsletterForm.dataset.endpoint || (window as any).NEWSLETTER_API_URL || '';
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

async function loadTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  try {
    await loadLanguage(currentLang);
    const resp = await fetch('team.json');
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    type TeamMember = {
      name: string;
      image: string;
      roleKey: string;
      bioKey: string;
      altKey: string;
      link: string;
    };
    const team: TeamMember[] = await resp.json();
    team.forEach((m) => {
      const member = document.createElement('div');
      member.className = 'member';

      const link = document.createElement('a');
      link.href = m.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.src = m.image;
      img.alt = translate(m.altKey);
      img.loading = 'lazy';
      img.setAttribute('data-i18n-alt', m.altKey);

      const name = document.createElement('h3');
      name.textContent = m.name;

      link.append(img, name);

      const role = document.createElement('p');
      role.setAttribute('data-i18n', m.roleKey);
      role.textContent = translate(m.roleKey);

      const bio = document.createElement('p');
      bio.setAttribute('data-i18n', m.bioKey);
      bio.textContent = translate(m.bioKey);

      member.append(link, role, bio);
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
