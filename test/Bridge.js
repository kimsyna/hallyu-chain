const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Bridge', function () {
  let owner, bridge, token;
  const feeRate = 100; // 1%
  const burnRate = 5000; // 50% of fee
  const amount = ethers.parseUnits('1000', 18);

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const HallyuToken = await ethers.getContractFactory('HallyuToken');
    token = await HallyuToken.deploy(owner.address);
    await token.waitForDeployment();

    const Bridge = await ethers.getContractFactory('Bridge');
    bridge = await Bridge.deploy(await token.getAddress(), feeRate, burnRate);
    await bridge.waitForDeployment();
  });

  it('burns part of the bridge fee', async function () {
    await token.approve(await bridge.getAddress(), amount);
    const supplyBefore = await token.totalSupply();
    await bridge.bridge(amount, 1, owner.address);
    const supplyAfter = await token.totalSupply();

    const expectedBurn =
      (amount * 3n) / 100n + // token's internal burn
      ((amount * BigInt(feeRate)) / 10000n * BigInt(burnRate)) / 10000n; // fee burn
    expect(supplyBefore - supplyAfter).to.equal(expectedBurn);
  });

  it('blocks bridge and release when paused', async function () {
    await bridge.pause();

    await expect(
      bridge.bridge(amount, 1, owner.address)
    ).to.be.revertedWithCustomError(bridge, 'EnforcedPause');

    await expect(
      bridge.release(owner.address, amount)
    ).to.be.revertedWithCustomError(bridge, 'EnforcedPause');
  });
});
