import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

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
