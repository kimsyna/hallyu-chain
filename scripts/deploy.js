const { ethers } = require('hardhat');
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

  const HallyuToken = await ethers.getContractFactory('HallyuToken');
  const token = await HallyuToken.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log('HallyuToken deployed to:', tokenAddress);

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
    communityRewards: ethers.parseUnits('4000000000', 18),
    team: ethers.parseUnits('2000000000', 18),
    advisors: ethers.parseUnits('1000000000', 18),
    investors: ethers.parseUnits('3000000000', 18),
  };

  await token.transfer(communityRewards.address, allocations.communityRewards);
  await token.transfer(teamVestingAddress, allocations.team);
  await token.transfer(advisorVestingAddress, allocations.advisors);
  await token.transfer(investorVestingAddress, allocations.investors);
  console.log('Tokens distributed to allocation addresses');

  const filePath = path.join(__dirname, '..', 'token-address.json');
  const addresses = {
    HallyuToken: tokenAddress,
    TeamVesting: teamVestingAddress,
    AdvisorVesting: advisorVestingAddress,
    InvestorVesting: investorVestingAddress,
  };
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
