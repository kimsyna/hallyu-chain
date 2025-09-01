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
    await token.connect(voter1).delegate(voter1.address);
    await token.connect(voter2).delegate(voter2.address);
  });

});

