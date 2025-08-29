import { h } from '../lib/dom.js';

export function DAO() {
  return h(
    'section',
    { id: 'dao' },
    h('h2', { 'data-i18n': 'dao_title' }),
    h('p', { 'data-i18n': 'dao_text' })
  );
}
