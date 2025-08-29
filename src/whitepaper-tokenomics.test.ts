import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

const base = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
(global as any).window = base.window;
(global as any).document = base.window.document;
(global as any).localStorage = base.window.localStorage;
(global as any).location = base.window.location;
(global as any).NodeFilter = base.window.NodeFilter;

const tokenomics = JSON.parse(fs.readFileSync('tokenomics.json', 'utf-8'));

function assertTokenomics(text: string, lang: string) {
  assert.ok(!/\{\w+\}/.test(text), `placeholders remain in ${lang}`);
  assert.ok(
    text.includes(Number(tokenomics.supply).toLocaleString()),
    `supply mismatch in ${lang}`
  );
  for (const key of ['dao', 'community', 'team', 'advisors', 'investors']) {
    assert.ok(text.includes(String(tokenomics[key])), `${key} mismatch in ${lang}`);
  }
}

test('applyTokenomics populates whitepaper values', async () => {
  const { applyTokenomics } = await import('./i18n.ts');
  const originalFetch = (global as any).fetch;
  (global as any).fetch = async (url: string) => {
    if (String(url).includes('tokenomics.json')) {
      return { ok: true, json: async () => tokenomics } as Response;
    }
    throw new Error('unexpected url: ' + url);
  };
  try {
    const langs = fs
      .readdirSync('whitepaper', { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const lang of langs) {
      const html = fs.readFileSync(`whitepaper/${lang}/index.html`, 'utf-8');
      const dom = new JSDOM(html);
      await applyTokenomics(dom.window.document);
      const text = dom.window.document.body.textContent || '';
      assertTokenomics(text, lang);
    }
  } finally {
    (global as any).fetch = originalFetch;
  }
});
