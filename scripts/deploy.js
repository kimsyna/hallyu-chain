const { ethers, network } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [
    deployer,
    communityRewards,
    teamBeneficiary,
    advisorBeneficiary,
    investorBeneficiary,
  ] = await ethers.getSigners();
  console.log('Deploying with:', deployer.address);

  const HallyuDAO = await ethers.getContractFactory('HallyuDAO');
  const dao = await HallyuDAO.deploy();
  await dao.waitForDeployment();
  const daoAddress = await dao.getAddress();
  console.log('HallyuDAO deployed to:', daoAddress);

  const HallyuToken = await ethers.getContractFactory('HallyuToken');
  const token = await HallyuToken.deploy(daoAddress);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log('HallyuToken deployed to:', tokenAddress);
  await dao.setToken(tokenAddress);

  const Bridge = await ethers.getContractFactory('Bridge');
  const bridge = await Bridge.deploy(tokenAddress, 100, 5000); // 1% fee, 50% burn
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log('Bridge deployed to:', bridgeAddress);

  const VestingVault = await ethers.getContractFactory('VestingVault');
  const now = Math.floor(Date.now() / 1000);
  const year = 365 * 24 * 60 * 60;

  const teamVesting = await VestingVault.deploy(
    tokenAddress,
    teamBeneficiary.address,
    now,
    year,
    4 * year,
    deployer.address
  );
  await teamVesting.waitForDeployment();
  const teamVestingAddress = await teamVesting.getAddress();
  console.log('TeamVesting deployed to:', teamVestingAddress);

  const advisorVesting = await VestingVault.deploy(
    tokenAddress,
    advisorBeneficiary.address,
    now,
    0,
    2 * year,
    deployer.address
  );
  await advisorVesting.waitForDeployment();
  const advisorVestingAddress = await advisorVesting.getAddress();
  console.log('AdvisorVesting deployed to:', advisorVestingAddress);

  const investorVesting = await VestingVault.deploy(
    tokenAddress,
    investorBeneficiary.address,
    now,
    0,
    year,
    deployer.address
  );
  await investorVesting.waitForDeployment();
  const investorVestingAddress = await investorVesting.getAddress();
  console.log('InvestorVesting deployed to:', investorVestingAddress);

  const allocations = {
    dao: ethers.parseUnits('5000000000', 18),
    communityRewards: ethers.parseUnits('2000000000', 18),
    team: ethers.parseUnits('1500000000', 18),
    advisors: ethers.parseUnits('500000000', 18),
    investors: ethers.parseUnits('1000000000', 18),
  };

  await token.transfer(daoAddress, allocations.dao);
  await token.transfer(communityRewards.address, allocations.communityRewards);
  await token.transfer(teamVestingAddress, allocations.team);
  await token.transfer(advisorVestingAddress, allocations.advisors);
  await token.transfer(investorVestingAddress, allocations.investors);
  console.log('Tokens distributed to allocation addresses');

  const filePath = path.join(__dirname, '..', 'deployments', `${network.name}.json`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const addresses = {
    HallyuToken: tokenAddress,
    HallyuDAO: daoAddress,
    Bridge: bridgeAddress,
    TeamVesting: teamVestingAddress,
    AdvisorVesting: advisorVestingAddress,
    InvestorVesting: investorVestingAddress,
  };
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

  const tokenAddressPath = path.join(__dirname, '..', 'token-address.json');
  let tokenAddresses = {};
  if (fs.existsSync(tokenAddressPath)) {
    tokenAddresses = JSON.parse(fs.readFileSync(tokenAddressPath));
  }
  if (!tokenAddresses[network.name]) tokenAddresses[network.name] = {};
  tokenAddresses[network.name].HallyuToken = tokenAddress;
  fs.writeFileSync(tokenAddressPath, JSON.stringify(tokenAddresses, null, 2));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
