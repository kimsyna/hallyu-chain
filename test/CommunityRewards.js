const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityRewards", function () {
  let owner, token, rewards;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("HallyuToken");
    token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const CommunityRewards = await ethers.getContractFactory("CommunityRewards");
    rewards = await CommunityRewards.deploy(token.target, 1n);
    await rewards.waitForDeployment();
  });

  it("emits event when conversion rate updates", async function () {
    await expect(rewards.setConversionRate(2n))
      .to.emit(rewards, "ConversionRateUpdated")
      .withArgs(2n);
  });
});
