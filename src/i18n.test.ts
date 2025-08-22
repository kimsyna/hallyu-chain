import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

test('translate returns key when missing', async () => {
  const { translations, translate } = await import('./i18n.ts');
  translations.en = { hello: 'Hello' };
  assert.equal(translate('hello', 'en'), 'Hello');
  assert.equal(translate('unknown', 'en'), 'unknown');
});

test('loadWhitepaper uses translated fallback', async () => {
  const { translations, translate, loadWhitepaper } = await import('./i18n.ts');
  translations.en = {
    notice_whitepaper_unavailable: 'Whitepaper not available.',
  };
  const container = document.createElement('div');
  container.id = 'whitepaper-content';
  document.body.appendChild(container);
  const originalFetch = global.fetch;
  global.fetch = async () => ({ ok: false, status: 404 });
  try {
    await loadWhitepaper('en');
  } finally {
    global.fetch = originalFetch;
  }
  assert.equal(
    container.innerHTML,
    `<p>${translate('notice_whitepaper_unavailable')}</p>`
  );
});
