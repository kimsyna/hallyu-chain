const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KPOPProtocol", function () {
  let owner, addr1, addr2, token;
  const initialSupply = ethers.parseUnits("1000000", 18);
  const cap = ethers.parseUnits("2000000", 18);

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const KPOPProtocol = await ethers.getContractFactory("KPOPProtocol");
    token = await KPOPProtocol.deploy(initialSupply, cap);
    await token.waitForDeployment();
  });

  it("assigns initial supply to deployer", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("transfers tokens between accounts", async function () {
    await token.transfer(addr1.address, ethers.parseUnits("100", 18));
    expect(await token.balanceOf(addr1.address)).to.equal(
      ethers.parseUnits("100", 18)
    );

    await token
      .connect(addr1)
      .transfer(addr2.address, ethers.parseUnits("50", 18));
    expect(await token.balanceOf(addr2.address)).to.equal(
      ethers.parseUnits("50", 18)
    );
  });

  it("only owner can mint up to cap", async function () {
    const mintAmount = ethers.parseUnits("1000", 18);
    await token.mint(addr1.address, mintAmount);
    expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);

    await expect(
      token.connect(addr1).mint(addr1.address, mintAmount)
    )
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(addr1.address);

    const remaining = cap - (initialSupply + mintAmount);
    await token.mint(owner.address, remaining);
    await expect(token.mint(owner.address, 1n)).to.be.revertedWith(
      "cap exceeded"
    );
  });

  it("burn reduces total supply", async function () {
    const burnAmount = ethers.parseUnits("500", 18);
    await token.burn(burnAmount);
    expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
  });
});
