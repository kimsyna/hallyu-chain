export async function loadStakingStatus() {
  const total = document.getElementById('total-staked');
  const rewards = document.getElementById('user-rewards');
  const errorEl = document.getElementById('staking-error');
  try {
    const resp = await fetch('staking.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (total) total.textContent = data.totalStaked;
    if (rewards) rewards.textContent = data.userRewards;
  } catch (err) {
    console.error('Failed to fetch staking info', err);
    if (total) total.textContent = 'N/A';
    if (rewards) rewards.textContent = 'N/A';
    if (errorEl) {
      errorEl.textContent = 'Failed to load staking info.';
      errorEl.hidden = false;
    }
  }
}
