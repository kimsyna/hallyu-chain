import { h } from './h.js';

export function Hero() {
  const title = h('hc-fancy-title', {
    className: 'hero-title',
    'data-i18n': 'hero_title'
  });
  const hero = h(
    'header',
    { className: 'hero' },
    title,
    h('p', { 'data-i18n': 'hero_subtitle' }),
    h('a', { href: '#whitepaper', className: 'btn', 'data-i18n': 'hero_button' })
  );
  const handleMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    title.style.transform = `rotateY(${x * 30}deg) rotateX(${-y * 30}deg)`;
  };
  const reset = () => {
    title.style.transform = '';
  };
  hero.addEventListener('mousemove', handleMove);
  hero.addEventListener('mouseleave', reset);
  return hero;
}
