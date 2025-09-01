const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HallyuToken", function () {
  let owner, addr1, token;
  const initialSupply = ethers.parseUnits("10000000000", 18);

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const HallyuToken = await ethers.getContractFactory("HallyuToken");
    token = await HallyuToken.deploy(owner.address);
    await token.waitForDeployment();
  });

  it("assigns initial supply to deployer", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("burns 3% on transfers", async function () {
    const amount = ethers.parseUnits("100", 18);
    await token.transfer(addr1.address, amount);
    const received = (amount * 97n) / 100n;
    const burned = amount - received;
    expect(await token.balanceOf(addr1.address)).to.equal(received);
    expect(await token.totalSupply()).to.equal(initialSupply - burned);
  });

  it("only DAO can mint within annual limit", async function () {
    const limit = await token.yearlyMintLimit();
    await token.burn(limit);
    await expect(token.mint(owner.address, limit + 1n)).to.be.revertedWith(
      "Mint exceeds annual limit"
    );
    await token.mint(owner.address, limit);
    await expect(
      token.connect(addr1).mint(addr1.address, 1n)
    ).to.be.revertedWith("Not DAO");
  });
});
