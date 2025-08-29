import { h } from './h.js';

export function Resources() {
  return h(
    'section',
    { id: 'resources' },
    h('h2', { 'data-i18n': 'resources_title' }),
    h('ul', { id: 'resources-list', className: 'icon-list' })
  );
}
