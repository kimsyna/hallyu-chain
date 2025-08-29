import { h } from '../lib/dom.js';

export function Technology() {
  return h(
    'section',
    { id: 'technology' },
    h('h2', { 'data-i18n': 'technology_title' }),
    h(
      'ul',
      { className: 'icon-list' },
      item('layers', 'tech_list1'),
      item('gavel', 'tech_list2'),
      item('shield', 'tech_list3'),
      item('compare_arrows', 'tech_list4')
    ),
    h('h2', { 'data-i18n': 'features_title' }),
    h(
      'div',
      { className: 'card-grid' },
      card('group', 'feat1_title', 'feat1_text'),
      card('volunteer_activism', 'feat2_title', 'feat2_text'),
      card('public', 'feat3_title', 'feat3_text'),
      card('token', 'feat4_title', 'feat4_text')
    )
  );
}

function item(icon, key) {
  return h(
    'li',
    {},
    h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, icon),
    h('span', { 'data-i18n': key })
  );
}

function card(icon, titleKey, textKey) {
  return h(
    'div',
    { className: 'card' },
    h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, icon),
    h('h3', { 'data-i18n': titleKey }),
    h('p', { 'data-i18n': textKey })
  );
}
