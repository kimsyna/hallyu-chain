const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KPPToken", function () {
  it("assigns initial supply to deployer", async function () {
    const [owner] = await ethers.getSigners();
    const KPPToken = await ethers.getContractFactory("KPPToken");
    const initialSupply = ethers.parseUnits("1000000", 18);
    const token = await KPPToken.deploy(initialSupply);
    await token.waitForDeployment();
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("transfers tokens between accounts", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const KPPToken = await ethers.getContractFactory("KPPToken");
    const initialSupply = ethers.parseUnits("1000000", 18);
    const token = await KPPToken.deploy(initialSupply);
    await token.waitForDeployment();

    await token.transfer(addr1.address, ethers.parseUnits("100", 18));
    expect(await token.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));

    await token.connect(addr1).transfer(addr2.address, ethers.parseUnits("50", 18));
    expect(await token.balanceOf(addr2.address)).to.equal(ethers.parseUnits("50", 18));
  });
});
