import { h } from '../lib/dom.js';

export function Navbar() {
  return h(
    'nav',
    { className: 'navbar' },
    h(
      'a',
      { href: '/', className: 'logo' },
      h('img', { src: './assets/hall-symbol.svg', alt: 'HALL logo', width: '24', height: '24' }),
      'Hallyu Chain'
    ),
    h(
      'button',
      {
        className: 'menu-toggle',
        'aria-label': 'Toggle navigation',
        'aria-controls': 'primary-navigation',
        'aria-expanded': 'false'
      },
      h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, 'menu')
    ),
    h(
      'ul',
      { id: 'primary-navigation', className: 'nav-links', 'aria-hidden': 'true' },
      navItem('#about', 'info', 'nav_about'),
      navItem('#technology', 'memory', 'nav_technology'),
      navItem('#tokenomics', 'paid', 'nav_tokenomics'),
      navItem('#roadmap', 'map', 'nav_roadmap'),
      navItem('#dao', 'groups', 'nav_dao'),
      navItem('#partners', 'handshake', 'nav_partners'),
      navItem('#resources', 'menu_book', 'nav_resources'),
      navItem('#newsletter', 'mail', 'nav_newsletter'),
      navItem('#faq', 'help', 'nav_faq'),
      navItem('#corporate', 'apartment', 'nav_corporate'),
      navItem('#team', 'group', 'nav_team'),
      navItem('#whitepaper', 'description', 'nav_whitepaper')
    ),
    h(
      'button',
      { className: 'theme-toggle', 'data-i18n-aria-label': 'nav_theme' }
    ),
    h(
      'select',
      { className: 'lang-select', 'data-i18n-aria-label': 'nav_change_lang' },
      option('ko', '🇰🇷'),
      option('en', '🇺🇸'),
      option('zh', '🇨🇳'),
      option('es', '🇪🇸'),
      option('fr', '🇫🇷'),
      option('de', '🇩🇪'),
      option('ja', '🇯🇵'),
      option('ru', '🇷🇺'),
      option('pt', '🇵🇹'),
      option('ar', '🇸🇦'),
      option('hi', '🇮🇳')
    )
  );
}

function navItem(href, icon, key) {
  return h(
    'li',
    {},
    h(
      'a',
      { href },
      h('i', { className: 'material-symbols-outlined', 'aria-hidden': 'true' }, icon),
      h('span', { 'data-i18n': key })
    )
  );
}

function option(value, label) {
  return h('option', { value }, label);
}
