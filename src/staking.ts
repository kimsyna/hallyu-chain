export async function fetchStakingData(fetchFn = fetch, url = 'staking.json') {
  const resp = await fetchFn(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

export async function loadStakingStatus(fetchFn = fetch) {
  const total = document.getElementById('total-staked');
  const rewards = document.getElementById('user-rewards');
  const errorEl = document.getElementById('staking-error');
  const percentEl = document.getElementById('staking-percent');
  const progressBar = document.getElementById('staking-progress-bar');
  try {
    const data = await fetchStakingData(fetchFn);
    if (total) total.textContent = data.totalStaked;
    if (rewards) rewards.textContent = data.userRewards;
    const percent =
      data.totalSupply
        ? (Number(data.totalStaked) / Number(data.totalSupply)) * 100
        : Number(data.stakingPercent ?? 0);
    if (percentEl) percentEl.textContent = `${percent.toFixed(2)}%`;
    if (progressBar) progressBar.style.width = `${percent}%`;
  } catch (err) {
    console.error('Failed to fetch staking info', err);
    if (total) total.textContent = 'N/A';
    if (rewards) rewards.textContent = 'N/A';
    if (percentEl) percentEl.textContent = 'N/A';
    if (progressBar) progressBar.style.width = '0%';
    if (errorEl) {
      errorEl.textContent = 'Failed to load staking info.';
      errorEl.hidden = false;
    }
  }
}
