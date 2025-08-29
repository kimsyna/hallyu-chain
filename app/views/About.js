import { h } from './h.js';

export function About() {
  return h(
    'section',
    { id: 'about' },
    h('h2', { 'data-i18n': 'about_title' }),
    h('p', { 'data-i18n': 'about_text' }),
    h('p', { 'data-i18n': 'about_text2' }),
    h('p', { 'data-i18n': 'about_text3' }),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'about_mission_title' }),
      h('ul', {},
        h('li', { 'data-i18n': 'about_mission_list1' }),
        h('li', { 'data-i18n': 'about_mission_list2' })
      )
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'about_usecases_title' }),
      h('ul', {},
        h('li', { 'data-i18n': 'about_usecases_list1' }),
        h('li', { 'data-i18n': 'about_usecases_list2' })
      )
    ),
    h(
      'div',
      {},
      h('h3', { 'data-i18n': 'about_benefits_title' }),
      h('ul', {},
        h('li', { 'data-i18n': 'about_benefits_list1' }),
        h('li', { 'data-i18n': 'about_benefits_list2' })
      )
    )
  );
}
