import { h } from '../lib/dom.js';

export function Roadmap() {
  return h(
    'section',
    { id: 'roadmap' },
    h('h2', { 'data-i18n': 'roadmap_title' }),
    h(
      'ol',
      { className: 'icon-list' },
      item('rocket_launch', 'road_q1'),
      item('code', 'road_q2'),
      item('handshake', 'road_q3'),
      item('link', 'road_q4'),
      item('storefront', 'road_q5'),
      item('smartphone', 'road_q6'),
      item('savings', 'road_q7'),
      item('how_to_vote', 'road_q8')
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
