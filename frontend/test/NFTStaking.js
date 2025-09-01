const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("NFTStaking", function () {
  it("emits RewardPaid on successful claim", async function () {
    const [owner, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("HallyuNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    const Token = await ethers.getContractFactory("HallyuToken");
    const token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const Staking = await ethers.getContractFactory("NFTStaking");
    const staking = await Staking.deploy(
      await nft.getAddress(),
      await token.getAddress(),
      ethers.parseUnits("1", 18)
    );
    await staking.waitForDeployment();

    await nft.mint(user.address, "");
    await nft.connect(user).approve(await staking.getAddress(), 0);
    await staking.connect(user).stake(0);

    const deposit = ethers.parseUnits("2000", 18);
    await token.transfer(await staking.getAddress(), deposit);

    await ethers.provider.send("evm_increaseTime", [1000]);
    await ethers.provider.send("evm_mine", []);

    await expect(staking.connect(user).claim())
      .to.emit(staking, "RewardPaid")
      .withArgs(user.address, anyValue);
  });

  it("reverts when reward token transfer fails", async function () {
    const [, user] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("HallyuNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    const BadToken = await ethers.getContractFactory("NonStandardToken");
    const badToken = await BadToken.deploy();
    await badToken.waitForDeployment();

    const Staking = await ethers.getContractFactory("NFTStaking");
    const staking = await Staking.deploy(
      await nft.getAddress(),
      await badToken.getAddress(),
      ethers.parseUnits("1", 18)
    );
    await staking.waitForDeployment();

    await nft.mint(user.address, "");
    await nft.connect(user).approve(await staking.getAddress(), 0);
    await staking.connect(user).stake(0);

    await ethers.provider.send("evm_increaseTime", [1000]);
    await ethers.provider.send("evm_mine", []);

    await expect(staking.connect(user).claim())
      .to.be.revertedWithCustomError(staking, "SafeERC20FailedOperation")
      .withArgs(await badToken.getAddress());
  });

  it("emits RewardRateUpdated when rate changes", async function () {
    const [owner] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("HallyuNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    const Token = await ethers.getContractFactory("HallyuToken");
    const token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const Staking = await ethers.getContractFactory("NFTStaking");
    const staking = await Staking.deploy(
      await nft.getAddress(),
      await token.getAddress(),
      0n
    );
    await staking.waitForDeployment();

    const newRate = ethers.parseUnits("2", 18);
    await expect(staking.setRewardRate(newRate))
      .to.emit(staking, "RewardRateUpdated")
      .withArgs(newRate);
  });
});
