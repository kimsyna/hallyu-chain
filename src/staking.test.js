import { JSDOM } from 'jsdom';
import { test } from 'node:test';
import assert from 'node:assert';

const dom = new JSDOM('<!doctype html><body><span id="total-staked"></span><span id="user-rewards"></span><div id="staking-error" hidden></div></body>', { url: 'http://localhost' });
global.window = dom.window;
global.document = dom.window.document;

global.fetch = async () => ({ ok: true, json: async () => ({ totalStaked: '100', userRewards: '5' }) });

test('loadStakingStatus populates elements', async () => {
  const { loadStakingStatus } = await import('./staking.js');
  await loadStakingStatus();
  assert.equal(document.getElementById('total-staked').textContent, '100');
  assert.equal(document.getElementById('user-rewards').textContent, '5');
});
