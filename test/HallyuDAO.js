const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HallyuDAO", function () {
  let voter1, voter2, dao, token;

  beforeEach(async function () {
    [, voter1, voter2] = await ethers.getSigners();

    const HallyuDAO = await ethers.getContractFactory("HallyuDAO");
    dao = await HallyuDAO.deploy();
    await dao.waitForDeployment();

    const HallyuToken = await ethers.getContractFactory("HallyuToken");
    token = await HallyuToken.deploy(await dao.getAddress());
    await token.waitForDeployment();

    await dao.setToken(await token.getAddress());
    await token.transfer(voter1.address, ethers.parseUnits("100", 18));
    await token.transfer(voter2.address, ethers.parseUnits("100", 18));
  });

  it("mints tokens via passed proposal", async function () {
    const amount = ethers.parseUnits("5", 18);
    const tx = await dao
      .connect(voter1)
      .proposeMint(voter1.address, amount, "mint");
    await tx.wait();
    const proposalId = 1; // first proposal

    await dao.connect(voter1).vote(proposalId, true);
    await dao.connect(voter2).vote(proposalId, true);

    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine", []);

    await dao.execute(proposalId);
    expect(await token.balanceOf(voter1.address)).to.equal(
      ethers.parseUnits("102", 18)
    );
  });
});

