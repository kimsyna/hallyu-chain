import { initTheme } from './theme.ts';
import { loadStakingStatus } from './staking.ts';
import { initI18n, loadLanguage, translate, DEFAULT_LANG } from './i18n.ts';
import { initNav } from './nav.ts';
import { applyFancyTitles } from './fancy-title.ts';
import { initAnimations, prefersReducedMotion } from './animations.ts';

// Hide decorative icons from screen readers
document
  .querySelectorAll('.material-symbols-outlined')
  .forEach((icon) => icon.setAttribute('aria-hidden', 'true'));

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

initTheme();
initI18n();
loadStakingStatus();
