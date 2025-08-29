import { showNotice } from './notice.ts';
import createDOMPurify from 'dompurify';
const DOMPurify = createDOMPurify(window);

export const translations = {};
export const DEFAULT_LANG = 'en';
const FALLBACK_NOTICES = {
  notice_load_fail: 'Localization failed to load.',
  notice_lang_unavailable:
    'Selected language unavailable. Using default language.',
};
let tokenomicsCache = null;

export let currentLang = localStorage.getItem('lang') || DEFAULT_LANG;

async function loadTokenomics() {
  if (!tokenomicsCache) {
    const resp = await fetch('tokenomics.json');
    if (!resp.ok) throw new Error(`HTTP error ${resp.status}`);
    tokenomicsCache = await resp.json();
  }
  return tokenomicsCache;
}

function replaceTokenomicsPlaceholders(root, data) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    walker.currentNode.textContent = walker.currentNode.textContent.replace(
      /\{(supply|dao|community|team|advisors|investors|burn)\}/g,
      (_, key) => {
        const value = data[key];
        if (value === undefined) return '';
        return key === 'supply'
          ? Number(value).toLocaleString()
          : String(value);
      }
    );
  }
}

export async function applyTokenomics(root = document) {
  try {
    const data = await loadTokenomics();
    replaceTokenomicsPlaceholders(root, data);
  } catch (err) {
    console.error('Failed to load tokenomics:', err);
  }
}

export async function loadLanguage(lang) {
  if (!translations[lang]) {
    try {
      const response = await fetch(`locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      translations[lang] = await response.json();
    } catch (err) {
      console.error(`Failed to load language '${lang}':`, err);
      if (lang !== DEFAULT_LANG) {
        return await loadLanguage(DEFAULT_LANG);
      }
      return null;
    }
  }
  return lang;
}

export function translate(key, lang = currentLang) {
  return (
    translations[lang]?.[key] ||
    translations[DEFAULT_LANG]?.[key] ||
    FALLBACK_NOTICES[key] ||
    key
  );
}

export async function setLanguage(lang) {
  const loadedLang = await loadLanguage(lang);
  if (!loadedLang) {
    showNotice(translate('notice_load_fail', DEFAULT_LANG));
    return;
  }
  if (loadedLang !== lang) {
    showNotice(translate('notice_lang_unavailable', loadedLang));
  }
  lang = loadedLang;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text) {
      if (el.tagName === 'HC-FANCY-TITLE') {
        el.setAttribute('text', text);
      } else {
        el.textContent = text;
      }
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = translations[lang][key];
    if (text) {
      el.setAttribute('placeholder', text);
    }
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const key = el.getAttribute('data-i18n-alt');
    const text = translations[lang][key];
    if (text) {
      el.setAttribute('alt', text);
    }
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    const text = translations[lang][key];
    if (text) {
      el.setAttribute('aria-label', text);
    }
  });
  document.querySelectorAll('[data-i18n-meta]').forEach((el) => {
    const key = el.getAttribute('data-i18n-meta');
    const text = translations[lang][key];
    if (text) {
      el.setAttribute('content', text);
    }
  });
  if (location.hash === '#whitepaper') {
    const wpSelect = document.getElementById(
      'whitepaper-lang'
    ) as HTMLSelectElement | null;
    const wpLang = wpSelect?.value || lang;
    await loadWhitepaper(wpLang);
  }
  await applyTokenomics();
  const page = document.body.dataset.page;
  const titleKey = `title_${page}`;
  if (translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }
  const select = document.querySelector('.lang-select');
  if (select) select.value = lang;
}

export async function loadWhitepaper(lang) {
  const container = document.getElementById('whitepaper-content');
  if (!container) return;
  try {
    const resp = await fetch(`whitepaper/${lang}/index.html`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();
    container.innerHTML = DOMPurify.sanitize(html);
    await applyTokenomics(container);
    window.applyFancyTitles?.();
  } catch (err) {
    console.error('Failed to load whitepaper:', err);
    const fallback = `<p>${translate('notice_whitepaper_unavailable', lang)}</p>`;
    container.innerHTML = DOMPurify.sanitize(fallback);
  }
}

function handleHash() {
  if (location.hash === '#whitepaper') {
    const wpSelect = document.getElementById(
      'whitepaper-lang'
    ) as HTMLSelectElement | null;
    const wpLang =
      wpSelect?.value || localStorage.getItem('lang') || currentLang;
    loadWhitepaper(wpLang);
  }
}

export async function initI18n() {
  try {
    await setLanguage(currentLang);
  } catch (err) {
    console.error('Failed to initialize i18n:', err);
  }
  window.addEventListener('hashchange', handleHash);
  handleHash();
  const select = document.querySelector('.lang-select');
  if (select) {
    select.addEventListener('change', (e) => setLanguage(e.target.value));
  }
  const wpSelect = document.getElementById('whitepaper-lang');
  if (wpSelect) {
    wpSelect.addEventListener('change', (e) =>
      loadWhitepaper((e.target as HTMLSelectElement).value)
    );
  }
}

// Expose helpers for standalone pages
declare global {
  interface Window {
    translate?: typeof translate;
    applyTokenomics?: typeof applyTokenomics;
  }
}

if (typeof window !== 'undefined') {
  window.translate = translate;
  window.applyTokenomics = applyTokenomics;
}
