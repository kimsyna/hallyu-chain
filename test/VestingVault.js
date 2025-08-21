const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VestingVault", function () {
  it("releases tokens linearly over time", async function () {
    const [owner, beneficiary] = await ethers.getSigners();

    const HallyuToken = await ethers.getContractFactory("HallyuToken");
    const token = await HallyuToken.deploy(owner.address);
    await token.waitForDeployment();

    const VestingVault = await ethers.getContractFactory("VestingVault");
    const year = 365 * 24 * 60 * 60;
    const latest = await ethers.provider.getBlock("latest");
    const start = latest.timestamp;
    const vault = await VestingVault.deploy(
      await token.getAddress(),
      beneficiary.address,
      start,
      0,
      year,
      owner.address
    );
    await vault.waitForDeployment();

    const amount = ethers.parseUnits("1000", 18);
    await token.transfer(await vault.getAddress(), amount);

    const deposited = await token.balanceOf(await vault.getAddress());

    await ethers.provider.send("evm_setNextBlockTimestamp", [start + year / 2]);
    await vault.release();
    const block1 = await ethers.provider.getBlock("latest");
    const vested1 = (deposited * BigInt(block1.timestamp - start)) / BigInt(year);
    const firstRelease = (vested1 * 97n) / 100n;
    expect(await token.balanceOf(beneficiary.address)).to.equal(firstRelease);

    await ethers.provider.send("evm_setNextBlockTimestamp", [start + year]);
    await vault.release();
    const block2 = await ethers.provider.getBlock("latest");
    const vested2 = (deposited * BigInt(block2.timestamp - start)) / BigInt(year);
    const total = (vested2 * 97n) / 100n;
    expect(await token.balanceOf(beneficiary.address)).to.equal(total);
  });
});
