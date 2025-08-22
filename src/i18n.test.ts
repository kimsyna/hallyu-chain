import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

test('translate returns key when missing', async () => {
  const { translations, translate } = await import('./i18n.ts');
  translations.en = { hello: 'Hello' };
  assert.equal(translate('hello', 'en'), 'Hello');
  assert.equal(translate('unknown', 'en'), 'unknown');
});
