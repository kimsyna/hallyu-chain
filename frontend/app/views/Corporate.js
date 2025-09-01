import { h } from '../lib/dom.js';

export function Corporate() {
  return h(
    'section',
    { id: 'corporate' },
    h('h2', { 'data-i18n': 'corporate_hero_title' }),
    h('p', { 'data-i18n': 'corporate_hero_subtitle' }),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_brand_title' }),
      h('p', { 'data-i18n': 'corporate_brand_text' })
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_mission_title' }),
      h('p', { 'data-i18n': 'corporate_mission_text' })
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_vision_title' }),
      h('p', { 'data-i18n': 'corporate_vision_text' })
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_voice_title' }),
      h('p', { 'data-i18n': 'corporate_voice_text' })
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_color_title' }),
      h(
        'ul',
        { className: 'color-grid' },
        h(
          'li',
          {},
          h('span', { className: 'swatch', style: 'background:#ff4081' }),
          h('p', { 'data-i18n': 'corporate_color_accent' })
        ),
        h(
          'li',
          {},
          h('span', { className: 'swatch', style: 'background:#ffffff' }),
          h('p', { 'data-i18n': 'corporate_color_bg' })
        ),
        h(
          'li',
          {},
          h('span', { className: 'swatch', style: 'background:#222222' }),
          h('p', { 'data-i18n': 'corporate_color_fg' })
        )
      )
    ),
    h(
      'div',
      { className: 'logo-guidelines' },
      h('h3', { 'data-i18n': 'corporate_logo_title' }),
      h(
        'div',
        { className: 'logo-sample' },
        h('img', { src: './assets/hall-symbol.svg', alt: '', 'data-i18n-alt': 'corporate_logo_alt' })
      ),
      h('p', { 'data-i18n': 'corporate_logo_usage' }),
      h(
        'ul',
        {},
        h('li', { 'data-i18n': 'corporate_logo_clearspace' }),
        h('li', { 'data-i18n': 'corporate_logo_minimum' }),
        h('li', { 'data-i18n': 'corporate_logo_background' })
      )
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'corporate_typography_title' }),
      h('p', { 'data-i18n': 'corporate_typography_heading' }),
      h('p', { 'data-i18n': 'corporate_typography_body' })
    )
  );
}
