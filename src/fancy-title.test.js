import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'module';

// JSDOM depends on a CommonJS module that requires `lru-cache`.
// Node 22 ships `lru-cache` as ESM only, so we shim the require
// to return an object with the expected `LRUCache` export.
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'lru-cache') {
    const mod = originalLoad(request, parent, isMain);
    if (mod && typeof mod === 'function') return { LRUCache: mod };
    if (mod && typeof mod === 'object' && 'default' in mod)
      return { LRUCache: mod.default };
    return mod;
  }
  return originalLoad(request, parent, isMain);
};

async function setupDom(html = '') {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM(html);
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.customElements = dom.window.customElements;
  return dom;
}

test('renders h1 with data-text and aria-level', async () => {
  await setupDom();
  await import('./fancy-title.ts?test=1');
  const el = document.createElement('hc-fancy-title');
  el.setAttribute('text', 'Hello');
  el.setAttribute('size', 'medium');
  document.body.appendChild(el);
  const h1 = el.shadowRoot.querySelector('h1');
  assert.equal(h1.getAttribute('data-text'), 'Hello');
  assert.equal(el.getAttribute('aria-level'), '2');
});

test('applyFancyTitles converts headings and preserves attributes', async () => {
  await setupDom(
    '<h1 class="hero" data-i18n="t1">Title</h1><h2 class="sub" data-i18n="t2" id="intro">Sub</h2>'
  );
  const { applyFancyTitles } = await import('./fancy-title.ts?test=2');
  applyFancyTitles();
  assert.equal(document.querySelectorAll('h1, h2').length, 0);
  const titles = document.querySelectorAll('hc-fancy-title');
  assert.equal(titles.length, 2);
  const [first, second] = titles;
  assert.equal(first.className, 'hero');
  assert.equal(first.getAttribute('data-i18n'), 't1');
  assert.equal(first.getAttribute('text'), 'Title');
  assert.equal(first.getAttribute('size'), 'large');
  assert.equal(second.className, 'sub');
  assert.equal(second.getAttribute('data-i18n'), 't2');
  assert.equal(second.getAttribute('text'), 'Sub');
  assert.equal(second.getAttribute('size'), 'medium');
  assert.equal(second.id, 'intro');
});
