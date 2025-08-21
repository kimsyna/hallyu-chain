const { execSync } = require('child_process');

async function main() {
  const list = process.env.NETWORKS;
  if (!list) {
    console.error('Set NETWORKS env var with comma separated network names');
    process.exit(1);
  }
  for (const net of list.split(',')) {
    const n = net.trim();
    if (n) {
      console.log(`Deploying to ${n}...`);
      execSync(`npx hardhat run scripts/deploy.js --network ${n}`, {
        stdio: 'inherit',
      });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
