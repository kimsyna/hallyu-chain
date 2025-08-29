import { h } from './h.js';

export function Partners() {
  return h(
    'section',
    { id: 'partners' },
    h('h2', { 'data-i18n': 'partners_title' }),
    h('div', { id: 'partners-grid', className: 'logo-grid' })
  );
}
