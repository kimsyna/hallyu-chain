import { h } from './lib/dom.js';
import { setState } from './state/store.js';

export function isDark() {
  return (
    document.body.classList.contains('dark-mode') ||
    (!document.body.classList.contains('light-mode') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}
export function updateThemeIcon(themeToggle) {
  if (!themeToggle) return;
  // Clear existing icon/content
  themeToggle.textContent = '';

  themeToggle.appendChild(
    h(
      'i',
      { className: 'material-symbols-outlined', 'aria-hidden': 'true' },
      isDark() ? 'light_mode' : 'dark_mode'
    )
  );
}

export function setTheme(
  theme,
  themeToggle = document.querySelector('.theme-toggle')
) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.body.classList.toggle('light-mode', theme === 'light');
  if (theme) {
    localStorage.setItem('theme', theme);
    setState({ theme });
  }
  updateThemeIcon(themeToggle);
}
export function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved, themeToggle);
  else updateThemeIcon(themeToggle);
  themeToggle.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    setTheme(next, themeToggle);
  });
}
