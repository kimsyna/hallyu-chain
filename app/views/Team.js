import { h } from '../lib/dom.js';

export function Team() {
  return h(
    'section',
    { id: 'team' },
    h('h2', { 'data-i18n': 'team_hero_title' }),
    h('p', { 'data-i18n': 'team_hero_subtitle' }),
    h(
      'ul',
      { className: 'team-roles' },
      h('li', { 'data-i18n': 'role_ceo' }),
      h('li', { 'data-i18n': 'role_cto' }),
      h('li', { 'data-i18n': 'role_lead' })
    ),
    h('h3', { 'data-i18n': 'team_links_title' }),
    h(
      'ul',
      { className: 'icon-list' },
      linkItem('https://twitter.com/hallyu_chain', 'public', 'team_link_twitter'),
      linkItem('https://discord.gg/example', 'chat', 'team_link_discord'),
      linkItem('https://github.com/hallyu-chain', 'code', 'team_link_github')
    )
  );
}

function linkItem(url, icon, key) {
  return h(
    'li',
    {},
    h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, icon),
    h('a', { href: url, target: '_blank', rel: 'noopener noreferrer', 'data-i18n': key })
  );
}
