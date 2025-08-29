const http = require('http');
const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
const stakingAddress = process.env.STAKING_ADDRESS;
const tokenAddress = process.env.TOKEN_ADDRESS;

const stakingAbi = [
  'function totalStaked() view returns (uint256)',
  'function earned(address user) view returns (uint256)'
];
const erc20Abi = ['function totalSupply() view returns (uint256)'];

const staking = stakingAddress ? new ethers.Contract(stakingAddress, stakingAbi, provider) : null;
const token = tokenAddress ? new ethers.Contract(tokenAddress, erc20Abi, provider) : null;

const server = http.createServer(async (req, res) => {
  if (!staking) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'staking contract not configured' }));
    return;
  }
  if (req.url && req.url.startsWith('/api/staking')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user = url.searchParams.get('user');
    try {
      const [totalStaked, totalSupply] = await Promise.all([
        staking.totalStaked(),
        token ? token.totalSupply() : Promise.resolve(null)
      ]);
      let userRewards = '0';
      if (user) {
        userRewards = (await staking.earned(user)).toString();
      }
      const result = {
        totalStaked: totalStaked.toString(),
        userRewards,
      };
      if (totalSupply) result.totalSupply = totalSupply.toString();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      console.error('staking api error', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'failed to fetch staking info' }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  server.listen(port, () => console.log(`Staking API listening on port ${port}`));
}

module.exports = server;
