import { t } from './i18n.js';

// Fetch staking data either from a configured backend or the default path
export async function fetchStakingData(
  fetchFn = fetch,
  apiBase = window.STAKING_API_URL
) {
  const endpoint = apiBase
    ? `${apiBase.replace(/\/$/, '')}/staking`
    : 'staking.json';
  const resp = await fetchFn(endpoint);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function loadStakingStatus(
  fetchFn = fetch,
  apiBase = window.STAKING_API_URL
) {
  const total = document.getElementById('total-staked');
  const rewards = document.getElementById('user-rewards');
  const errorEl = document.getElementById('staking-error');
  const percentEl = document.getElementById('staking-percent');
  const progressBar = document.getElementById('staking-progress-bar');
  let data;
  try {
    data = await fetchStakingData(fetchFn, apiBase);
  } catch (err) {
    console.error('Failed to fetch staking info', err);
    try {
      const resp = await fetchFn('staking.json');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      data = await resp.json();
    } catch (fallbackErr) {
      console.error('Failed to fetch fallback staking info', fallbackErr);
      if (total) total.textContent = t('staking_unavailable');
      if (rewards) rewards.textContent = t('staking_unavailable');
      if (percentEl) percentEl.textContent = t('staking_unavailable');
      if (progressBar) progressBar.style.width = '0%';
      if (errorEl) {
        errorEl.textContent = t('staking_error_unavailable');
        errorEl.hidden = false;
      }
      return;
    }
  }
  if (total) total.textContent = data.totalStaked;
  if (rewards) rewards.textContent = data.userRewards;
  const percent =
    data.totalSupply
      ? (Number(data.totalStaked) / Number(data.totalSupply)) * 100
      : Number(data.stakingPercent ?? 0);
  if (percentEl) percentEl.textContent = `${percent.toFixed(2)}%`;
  if (progressBar) progressBar.style.width = `${percent}%`;
}
