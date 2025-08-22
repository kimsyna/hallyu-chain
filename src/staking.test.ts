import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';
import { loadStakingStatus, fetchStakingData } from './staking.ts';

const dom = new JSDOM('<!doctype html><body><span id="total-staked"></span><span id="user-rewards"></span><div id="staking-error" hidden></div></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;

test('loadStakingStatus populates elements', async () => {
  global.fetch = async () => ({ ok: true, json: async () => ({ totalStaked: '100', userRewards: '5' }) });
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, '100');
  assert.equal(document.getElementById('user-rewards').textContent, '5');
});

test('loadStakingStatus shows error on failure', async () => {
  global.fetch = async () => ({ ok: false, status: 500 });
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, 'N/A');
  assert.equal(document.getElementById('user-rewards').textContent, 'N/A');
  const err = document.getElementById('staking-error');
  assert.equal(err.hidden, false);
  assert.equal(err.textContent, 'Failed to load staking info.');
});

test('fetchStakingData throws on non-ok response', async () => {
  await assert.rejects(
    fetchStakingData(() => Promise.resolve({ ok: false, status: 500 }))
  );
});
