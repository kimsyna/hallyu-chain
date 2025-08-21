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
    await expect(token.mint(owner.address, 1n))
      .to.be.revertedWithCustomError(token, "ERC20ExceededCap")
      .withArgs(cap + 1n, cap);
  });

  it("burn reduces total supply", async function () {
    const burnAmount = ethers.parseUnits("500", 18);
    await token.burn(burnAmount);
    expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
  });

  it("reverts transfers when balance is insufficient", async function () {
    const amount = ethers.parseUnits("1", 18);
    await expect(
      token.connect(addr1).transfer(addr2.address, amount)
    )
      .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
      .withArgs(addr1.address, 0n, amount);
  });

  it("handles allowance and transferFrom flows", async function () {
    const approveAmount = ethers.parseUnits("100", 18);
    await token.approve(addr1.address, approveAmount);
    expect(await token.allowance(owner.address, addr1.address)).to.equal(
      approveAmount
    );

    const transferAmount = ethers.parseUnits("50", 18);
    await token
      .connect(addr1)
      .transferFrom(owner.address, addr2.address, transferAmount);

    expect(await token.balanceOf(addr2.address)).to.equal(transferAmount);
    expect(await token.allowance(owner.address, addr1.address)).to.equal(
      approveAmount - transferAmount
    );
  });

  it("emits Transfer events", async function () {
    const amount = ethers.parseUnits("10", 18);
    await expect(token.transfer(addr1.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr1.address, amount);

    await token.approve(addr1.address, amount);
    await expect(
      token
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, amount)
    )
      .to.emit(token, "Transfer")
      .withArgs(owner.address, addr2.address, amount);
  });
});
