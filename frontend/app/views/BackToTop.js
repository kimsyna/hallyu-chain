import { h } from '../lib/dom.js';

export function BackToTop() {
  return h(
    'button',
    {
      className: 'back-to-top',
      'data-i18n-aria-label': 'back_to_top'
    },
    h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, 'arrow_upward')
  );
}
