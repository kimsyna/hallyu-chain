import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.location = dom.window.location;

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

test('setLanguage fetches and applies translations', async () => {
  const { setLanguage } = await import('./i18n.ts');
  const el = document.createElement('h2');
  el.setAttribute('data-i18n', 'metaverse_title');
  document.body.appendChild(el);
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    if (String(url).includes('locales')) {
      return { ok: true, json: async () => ({ metaverse_title: 'Metaverse Market' }) };
    }
    if (String(url).includes('tokenomics.json')) {
      return { ok: true, json: async () => ({}) };
    }
    throw new Error('unexpected url');
  };
  try {
    await setLanguage('test');
  } finally {
    global.fetch = originalFetch;
  }
  assert.equal(el.textContent, 'Metaverse Market');
});

test('setLanguage applies alt translations', async () => {
  const { setLanguage, translations } = await import('./i18n.ts');
  delete translations.en;
  delete translations.ko;
  const img = document.createElement('img');
  img.setAttribute('data-i18n-alt', 'alt_daniel');
  document.body.appendChild(img);
  const originalFetch = global.fetch;
  global.fetch = async (url) => {
    if (String(url).includes('locales/en')) {
      return { ok: true, json: async () => ({ alt_daniel: 'Portrait EN' }) };
    }
    if (String(url).includes('locales/ko')) {
      return { ok: true, json: async () => ({ alt_daniel: '초상 KO' }) };
    }
    if (String(url).includes('tokenomics.json')) {
      return { ok: true, json: async () => ({}) };
    }
    throw new Error('unexpected url');
  };
  try {
    await setLanguage('en');
    assert.equal(img.getAttribute('alt'), 'Portrait EN');
    await setLanguage('ko');
    assert.equal(img.getAttribute('alt'), '초상 KO');
  } finally {
    global.fetch = originalFetch;
  }
});
