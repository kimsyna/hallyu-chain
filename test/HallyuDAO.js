const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HallyuDAO Quorum", function () {
  let owner, voter1, voter2, dao, token;

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();

    const HallyuDAO_Test = await ethers.getContractFactory("HallyuDAO_Test");
    dao = await HallyuDAO_Test.deploy();
    await dao.waitForDeployment();

    const HallyuToken = await ethers.getContractFactory("HallyuToken");
    token = await HallyuToken.deploy(await dao.getAddress());
    await token.waitForDeployment();

    await dao.setToken(await token.getAddress());

    // Distribute tokens for voting.
    // Give voter1 3% of the initial supply and voter2 2%.
    // This makes their combined vote > 4% quorum, but voter1 alone is < 4%.
    const initialSupply = await token.totalSupply();
    const threePercent = (initialSupply * 3n) / 100n;
    const twoPercent = (initialSupply * 2n) / 100n;

    await token.transfer(voter1.address, threePercent);
    await token.transfer(voter2.address, twoPercent);

    // Delegate votes
    await token.connect(voter1).delegate(voter1.address);
    await token.connect(voter2).delegate(voter2.address);
  });

  it("should fail to execute a proposal if quorum is not met", async function () {
    const tx = await dao.propose(owner.address, "0x", "Test Proposal");
    const receipt = await tx.wait();

    const proposalEvent = dao.interface.parseLog(receipt.logs[0]);
    const { id: proposalId } = proposalEvent.args;
    const proposal = await dao.proposals(proposalId);
    const snapshot = proposal.snapshot;

    // Get the actual total supply at the snapshot block to calculate the real quorum
    const actualTotalSupply = await token.getPastTotalSupply(snapshot);
    const quorum = (actualTotalSupply * 4n) / 100n;

    // voter1 votes. Let's check if their vote is less than the quorum.
    const voter1Votes = await token.getPastVotes(voter1.address, snapshot);
    expect(voter1Votes).to.be.lt(quorum);

    await dao.connect(voter1).vote(proposalId, true);

    // Fast-forward time
    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(dao.execute(proposalId)).to.be.revertedWith("quorum not met");
  });

  it("should succeed in executing a proposal if quorum is met", async function () {
    const tx = await dao.propose(owner.address, "0x", "Test Proposal");
    const receipt = await tx.wait();
    const proposalEvent = dao.interface.parseLog(receipt.logs[0]);
    const { id: proposalId } = proposalEvent.args;
    const proposal = await dao.proposals(proposalId);
    const snapshot = proposal.snapshot;

    // Get the actual total supply and quorum
    const actualTotalSupply = await token.getPastTotalSupply(snapshot);
    const quorum = (actualTotalSupply * 4n) / 100n;

    // Both voters vote
    await dao.connect(voter1).vote(proposalId, true);
    await dao.connect(voter2).vote(proposalId, true);

    // Check that their combined votes meet the quorum
    const voter1Votes = await token.getPastVotes(voter1.address, snapshot);
    const voter2Votes = await token.getPastVotes(voter2.address, snapshot);
    expect(voter1Votes + voter2Votes).to.be.gte(quorum);

    // Fast-forward time
    await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]);
    await ethers.provider.send("evm_mine", []);

    await expect(dao.execute(proposalId)).to.not.be.reverted;
  });
});
