const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingPool", function () {
  it("emits InterestRateUpdated when rate changes", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("HallyuToken");
    const token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const Pool = await ethers.getContractFactory("StakingPool");
    const pool = await Pool.deploy(await token.getAddress(), 0n);
    await pool.waitForDeployment();

    const newRate = ethers.parseUnits("1", 18);
    await expect(pool.setInterestRate(newRate))
      .to.emit(pool, "InterestRateUpdated")
      .withArgs(newRate);
  });
});
