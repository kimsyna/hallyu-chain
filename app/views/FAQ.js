import { h } from './h.js';

export function FAQ() {
  return h(
    'section',
    { id: 'faq' },
    h('h2', { 'data-i18n': 'faq_title' }),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q1' }),
      h('p', { 'data-i18n': 'faq_a1' })
    ),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q2' }),
      h('p', { 'data-i18n': 'faq_a2' })
    ),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q3' }),
      h('p', { 'data-i18n': 'faq_a3' }, h('a', { href: '#staking' }))
    ),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q8' }),
      h('p', { 'data-i18n': 'faq_a8' })
    ),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q9' }),
      h('p', { 'data-i18n': 'faq_a9' })
    ),
    h(
      'details',
      {},
      h('summary', { 'data-i18n': 'faq_q10' }),
      h('p', { 'data-i18n': 'faq_a10' })
    )
  );
}
