import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><body><button class="theme-toggle"></button></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
function reset() {
  document.body.className = '';
  const oldBtn = document.querySelector('.theme-toggle');
  if (oldBtn) {
    const newBtn = oldBtn.cloneNode(false);
    oldBtn.replaceWith(newBtn);
  }
  localStorage.clear();
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  });
}

reset();

test('setTheme applies dark mode', async () => {
  reset();
  const { setTheme } = await import('./theme.ts');
  const btn = document.querySelector('.theme-toggle');
  setTheme('dark', btn);
  assert.ok(document.body.classList.contains('dark-mode'));
  assert.equal(localStorage.getItem('theme'), 'dark');
});

test('isDark detects dark-mode class', async () => {
  reset();
  document.body.classList.add('dark-mode');
  const { isDark } = await import('./theme.ts');
  assert.equal(isDark(), true);
});

test('isDark uses matchMedia when no explicit class', async () => {
  reset();
  window.matchMedia = () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  });
  const { isDark } = await import('./theme.ts');
  assert.equal(isDark(), true);
});

test('isDark prefers light-mode class over media query', async () => {
  reset();
  document.body.classList.add('light-mode');
  window.matchMedia = () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  });
  const { isDark } = await import('./theme.ts');
  assert.equal(isDark(), false);
});

test('updateThemeIcon inserts light mode icon in dark theme', async () => {
  reset();
  document.body.classList.add('dark-mode');
  const { updateThemeIcon } = await import('./theme.ts');
  const btn = document.querySelector('.theme-toggle');
  updateThemeIcon(btn);
  const icon = btn.querySelector('i');
  assert.ok(icon);
  assert.equal(icon.textContent, 'light_mode');
});

test('updateThemeIcon inserts dark mode icon in light theme', async () => {
  reset();
  document.body.classList.add('light-mode');
  const { updateThemeIcon } = await import('./theme.ts');
  const btn = document.querySelector('.theme-toggle');
  updateThemeIcon(btn);
  const icon = btn.querySelector('i');
  assert.ok(icon);
  assert.equal(icon.textContent, 'dark_mode');
});

test('updateThemeIcon handles null toggle gracefully', async () => {
  reset();
  const { updateThemeIcon } = await import('./theme.ts');
  assert.doesNotThrow(() => updateThemeIcon(null));
});

test('initTheme applies saved theme from localStorage', async () => {
  reset();
  localStorage.setItem('theme', 'dark');
  const { initTheme } = await import('./theme.ts');
  initTheme();
  const btn = document.querySelector('.theme-toggle');
  assert.ok(document.body.classList.contains('dark-mode'));
  assert.equal(btn.querySelector('i')?.textContent, 'light_mode');
});

test('initTheme toggles theme and persists choice', async () => {
  reset();
  const { initTheme } = await import('./theme.ts');
  const btn = document.querySelector('.theme-toggle');
  initTheme();
  btn.click();
  assert.ok(document.body.classList.contains('dark-mode'));
  assert.equal(localStorage.getItem('theme'), 'dark');
  btn.click();
  assert.ok(document.body.classList.contains('light-mode'));
  assert.equal(localStorage.getItem('theme'), 'light');
});
