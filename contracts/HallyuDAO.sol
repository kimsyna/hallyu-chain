// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IHallyuToken is IERC20 {
    function mint(address to, uint256 amount) external;
}

/// @title HallyuDAO
/// @notice Simple token-based governance for HallyuToken
contract HallyuDAO is Ownable {
    struct Proposal {
        address proposer;
        address target;
        bytes data;
        string description;
        uint256 start;
        uint256 end;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        mapping(address => bool) voted;
    }

    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public proposalCount;
    IHallyuToken public token;

    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string description);
    event Voted(uint256 indexed id, address indexed voter, bool support, uint256 weight);
    event Executed(uint256 indexed id);

    constructor() Ownable(msg.sender) {}

    function setToken(address tokenAddress) external onlyOwner {
        require(address(token) == address(0), "token already set");
        token = IHallyuToken(tokenAddress);
    }

    function proposeMint(address to, uint256 amount, string calldata description)
        external
        returns (uint256)
    {
        bytes memory data = abi.encodeWithSelector(IHallyuToken.mint.selector, to, amount);
        return _propose(address(token), data, description);
    }

    function _propose(address target, bytes memory data, string memory description)
        internal
        returns (uint256)
    {
        require(address(token) != address(0), "token not set");
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.proposer = msg.sender;
        p.target = target;
        p.data = data;
        p.description = description;
        p.start = block.timestamp;
        p.end = block.timestamp + VOTING_PERIOD;
        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.timestamp >= p.start && block.timestamp <= p.end, "voting closed");
        require(!p.voted[msg.sender], "already voted");
        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "no voting power");
        if (support) {
            p.forVotes += weight;
        } else {
            p.againstVotes += weight;
        }
        p.voted[msg.sender] = true;
        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp > p.end, "voting not ended");
        require(!p.executed, "executed");
        require(p.forVotes > p.againstVotes, "proposal not passed");
        p.executed = true;
        (bool ok, ) = p.target.call(p.data);
        require(ok, "call failed");
        emit Executed(id);
    }
}

