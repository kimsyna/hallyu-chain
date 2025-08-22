import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'module';
import { applyLruCacheShim } from './test-helpers/lru-cache-shim.js';

applyLruCacheShim();

const require = Module.createRequire(import.meta.url);
const { JSDOM } = require('jsdom');

function setupDom() {
  const dom = new JSDOM(`
    <nav class="navbar">
      <button class="menu-toggle" aria-expanded="false"></button>
      <ul id="primary-navigation" aria-hidden="true">
        <li><a href="#one">One</a></li>
        <li><a href="#two">Two</a></li>
      </ul>
    </nav>
  `);
  global.window = dom.window;
  global.document = dom.window.document;
  return dom;
}

test('clicking menu-toggle opens menu, updates aria and focuses first link', async () => {
  const dom = setupDom();
  const { initNav } = await import('./nav.ts?test=1');
  initNav();

  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.getElementById('primary-navigation');

  menuToggle.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  assert.ok(navbar.classList.contains('open'));
  assert.equal(menuToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(navLinks.getAttribute('aria-hidden'), 'false');
  const firstLink = navLinks.querySelector('a');
  assert.equal(document.activeElement, firstLink);
});

test('Tab cycles within navigation links when menu is open', async () => {
  const dom = setupDom();
  const { initNav } = await import('./nav.ts?test=2');
  initNav();

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('primary-navigation');

  menuToggle.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  const links = navLinks.querySelectorAll('a');
  const first = links[0];
  const last = links[links.length - 1];

  last.focus();
  last.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  assert.equal(document.activeElement, first);

  first.focus();
  first.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
  );
  assert.equal(document.activeElement, last);
});

test('Escape closes the menu and resets aria attributes', async () => {
  const dom = setupDom();
  const { initNav } = await import('./nav.ts?test=3');
  initNav();

  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.getElementById('primary-navigation');

  menuToggle.dispatchEvent(new dom.window.Event('click', { bubbles: true }));

  document.dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
  );

  assert.ok(!navbar.classList.contains('open'));
  assert.equal(menuToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(navLinks.getAttribute('aria-hidden'), 'true');
});
