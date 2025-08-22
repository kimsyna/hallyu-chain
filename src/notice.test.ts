import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><body></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

test('showNotice displays message', async () => {
  const { showNotice } = await import('./notice.ts');
  showNotice('hello', 10);
  const el = document.querySelector('.notice');
  assert.equal(el.textContent, 'hello');
  assert.equal(el.hidden, false);
});
