import { test } from 'node:test';
import assert from 'node:assert/strict';
import Module from 'module';

// Shim lru-cache for jsdom on Node 22 (similar to fancy-title tests).
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

const require = Module.createRequire(import.meta.url);
const { JSDOM } = require('jsdom');

function setupDom(prefers) {
  const dom = new JSDOM('<section id="a"></section>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.window.matchMedia = () => ({
    matches: prefers,
    addEventListener: () => {},
  });
  global.matchMedia = global.window.matchMedia;

  const calls = [];
  global.ScrollTrigger = {
    getAll: () => [],
  };
  global.gsap = {
    registerPlugin: () => {},
    from: (el, vars) => {
      el.style.opacity = String(vars.opacity);
      el.style.transform = `translate(0, ${vars.y}px)`;
      calls.push({ el, vars });
    },
    to: () => {},
  };
  return { section: dom.window.document.querySelector('section'), calls };
}

test('animated sections have styles when motion allowed', async () => {
  const { section, calls } = setupDom(false);
  const { initAnimations } = await import('./animations.ts');
  initAnimations();
  assert.equal(calls.length, 1);
  assert.equal(section.style.opacity, '0');
  assert.notEqual(section.style.transform, '');
});

test('sections remain visible without animation when motion reduced', async () => {
  const { section, calls } = setupDom(true);
  const { initAnimations } = await import('./animations.ts?test=1');
  initAnimations();
  assert.equal(calls.length, 0);
  assert.equal(section.style.opacity, '1');
  assert.equal(section.style.transform, 'none');
});
