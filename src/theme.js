export function isDark() {
  return (
    document.body.classList.contains('dark-mode') ||
    (!document.body.classList.contains('light-mode') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}
export function updateThemeIcon(themeToggle) {
  if (!themeToggle) return;
  themeToggle.innerHTML = isDark()
    ? '<i class="material-symbols-outlined" aria-hidden="true">light_mode</i>'
    : '<i class="material-symbols-outlined" aria-hidden="true">dark_mode</i>';
}
export function setTheme(theme, themeToggle = document.querySelector('.theme-toggle')) {
  document.body.classList.toggle('dark-mode', theme === 'dark');
  document.body.classList.toggle('light-mode', theme === 'light');
  if (theme) {
    localStorage.setItem('theme', theme);
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
