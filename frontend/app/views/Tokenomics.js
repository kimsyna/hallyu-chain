import { h } from '../lib/dom.js';

export function Tokenomics() {
  return h(
    'section',
    { id: 'tokenomics' },
    h('h2', { 'data-i18n': 'tokenomics_title' }),
    h(
      'ul',
      { className: 'icon-list' },
      item('pie_chart', 'tok_list1'),
      item('account_balance', 'tok_list2'),
      item('card_giftcard', 'tok_list3'),
      item('groups', 'tok_list4'),
      item('support_agent', 'tok_list5'),
      item('trending_up', 'tok_list6'),
      item('local_fire_department', 'tok_list7')
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
