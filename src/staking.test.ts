import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><body><span id="total-staked"></span><span id="user-rewards"></span><span id="staking-percent"></span><div class="staking-progress"><div id="staking-progress-bar"></div></div><div id="staking-error" hidden></div></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

const { loadStakingStatus, fetchStakingData } = await import('./staking.ts');
const { translations } = await import('./i18n.ts');
translations.en = {
  staking_unavailable: 'N/A',
  staking_error_unavailable: 'Unable to fetch staking data. Please try again later.',
};

test('loadStakingStatus populates elements', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ totalStaked: '100', userRewards: '5', totalSupply: '200' }) });
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, '100');
  assert.equal(document.getElementById('user-rewards').textContent, '5');
  assert.equal(document.getElementById('staking-percent').textContent, '50.00%');
  assert.equal(document.getElementById('staking-progress-bar').style.width, '50%');
});

test('loadStakingStatus falls back to staking.json', async () => {
  global.fetch = async (url) => {
    if (url === '/api/staking') return { ok: false, status: 500 };
    return {
      ok: true,
      json: async () => ({ totalStaked: '50', userRewards: '2', totalSupply: '100' }),
    };
  };
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, '50');
  assert.equal(document.getElementById('user-rewards').textContent, '2');
  assert.equal(document.getElementById('staking-percent').textContent, '50.00%');
  assert.equal(document.getElementById('staking-progress-bar').style.width, '50%');
  const err = document.getElementById('staking-error');
  assert.equal(err.hidden, true);
});

test('loadStakingStatus shows error when both API and fallback fail', async () => {
  global.fetch = async () => ({ ok: false, status: 500 });
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, 'N/A');
  assert.equal(document.getElementById('user-rewards').textContent, 'N/A');
  assert.equal(document.getElementById('staking-percent').textContent, 'N/A');
  assert.equal(document.getElementById('staking-progress-bar').style.width, '0%');
  const err = document.getElementById('staking-error');
  assert.equal(err.hidden, false);
  assert.equal(
    err.textContent,
    'Unable to fetch staking data. Please try again later.'
  );
});

test('fetchStakingData throws on non-ok response', async () => {
  await assert.rejects(
    fetchStakingData(() => Promise.resolve({ ok: false, status: 500 }))
  );
});
