import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><body><button class="theme-toggle"></button></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

test('setTheme applies dark mode', async () => {
  const { setTheme } = await import('./theme.js');
  const btn = document.querySelector('.theme-toggle');
  setTheme('dark', btn);
  assert.ok(document.body.classList.contains('dark-mode'));
  assert.equal(localStorage.getItem('theme'), 'dark');
});
