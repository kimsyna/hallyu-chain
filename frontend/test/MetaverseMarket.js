const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MetaverseMarket", function () {
  let buyer, token, market;
  const itemId = 1;
  const price = ethers.parseUnits("10", 18);

  beforeEach(async function () {
    [, buyer] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("NonStandardToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Market = await ethers.getContractFactory("MetaverseMarket");
    market = await Market.deploy(await token.getAddress());
    await market.waitForDeployment();

    await market.setItemPrice(itemId, price);
    await token.transfer(buyer.address, price);
    await token.connect(buyer).approve(await market.getAddress(), price);
  });

  it("reverts when payment token transfer fails", async function () {
    await expect(
      market.connect(buyer).purchase(itemId)
    ).to.be.revertedWithCustomError(market, "SafeERC20FailedOperation").withArgs(
      await token.getAddress()
    );
  });
});
