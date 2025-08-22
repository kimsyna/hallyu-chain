const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("StakingPool", function () {
  it("emits InterestRateUpdated when rate changes", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("StakingPool");
    const pool = await Pool.deploy(await token.getAddress(), 0n);
    await pool.waitForDeployment();

    const newRate = ethers.parseUnits("1", 18);
    await expect(pool.setInterestRate(newRate))
      .to.emit(pool, "InterestRateUpdated")
      .withArgs(newRate);
  });

  it("allows owner to deposit and withdraw rewards", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("StakingPool");
    const pool = await Pool.deploy(await token.getAddress(), 0n);
    await pool.waitForDeployment();

    const amount = ethers.parseUnits("100", 18);
    await token.approve(await pool.getAddress(), amount);
    await expect(pool.depositRewards(amount))
      .to.emit(pool, "RewardsDeposited")
      .withArgs(owner.address, amount);

    const withdrawAmount = ethers.parseUnits("50", 18);
    await expect(pool.withdrawExcess(withdrawAmount))
      .to.emit(pool, "ExcessWithdrawn")
      .withArgs(owner.address, withdrawAmount);
  });

  it("allows users to claim rewards after funding", async function () {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("StakingPool");
    const rate = ethers.parseUnits("1", 18); // 100% per year
    const pool = await Pool.deploy(await token.getAddress(), rate);
    await pool.waitForDeployment();

    const rewardDeposit = ethers.parseUnits("200", 18);
    await token.approve(await pool.getAddress(), rewardDeposit);
    await pool.depositRewards(rewardDeposit);

    const stakeAmount = ethers.parseUnits("100", 18);
    await token.mint(user.address, stakeAmount);
    await token.connect(user).approve(await pool.getAddress(), stakeAmount);
    await pool.connect(user).stake(stakeAmount);

    await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await expect(pool.connect(user).claim())
      .to.emit(pool, "RewardPaid")
      .withArgs(user.address, anyValue);
  });
});
