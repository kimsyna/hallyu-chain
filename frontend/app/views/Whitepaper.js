import { h } from '../lib/dom.js';

export function Whitepaper() {
  return h(
    'section',
    { id: 'whitepaper' },
    h('h2', { 'data-i18n': 'title_whitepaper' }),
    h(
      'select',
      { id: 'whitepaper-lang', className: 'lang-select', 'data-i18n-aria-label': 'nav_whitepaper' },
      option('ar', 'Arabic'),
      option('de', 'Deutsch'),
      option('en', 'English'),
      option('es', 'Español'),
      option('fr', 'Français'),
      option('hi', 'हिन्दी'),
      option('ja', '日本語'),
      option('ko', '한국어'),
      option('pt', 'Português'),
      option('ru', 'Русский'),
      option('zh', '中文')
    ),
    h('div', { id: 'whitepaper-content' })
  );
}

function option(value, label) {
  return h('option', { value }, label);
}
