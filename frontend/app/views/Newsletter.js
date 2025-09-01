import { h } from '../lib/dom.js';

export function Newsletter() {
  return h(
    'section',
    { id: 'newsletter' },
    h('h2', { 'data-i18n': 'newsletter_title' }),
    h('p', { 'data-i18n': 'newsletter_text' }),
    h(
      'form',
      { className: 'newsletter-form' },
      h('input', {
        type: 'email',
        required: '',
        'data-i18n-placeholder': 'newsletter_placeholder',
        'data-i18n-aria-label': 'newsletter_placeholder'
      }),
      h('button', { type: 'submit', className: 'btn', 'data-i18n': 'newsletter_button' })
    ),
    h('p', { className: 'newsletter-success', role: 'status', hidden: '' })
  );
}
