// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title StakingPool
/// @notice Simple HALL staking with interest and voting power
contract StakingPool is Ownable {
    IERC20 public immutable token;
    uint256 public interestRate; // per year, scaled by 1e18
    uint256 public constant YEAR = 365 days;

    struct StakeInfo {
        uint256 amount;
        uint256 reward;
        uint256 lastUpdated;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public votingPower;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address token_, uint256 rate_) Ownable(msg.sender) {
        token = IERC20(token_);
        interestRate = rate_;
    }

    function setInterestRate(uint256 rate) external onlyOwner {
        interestRate = rate;
    }

    function updateRewards(address user) internal {
        StakeInfo storage s = stakes[user];
        if (s.amount > 0) {
            uint256 timeDiff = block.timestamp - s.lastUpdated;
            uint256 reward = (s.amount * interestRate * timeDiff) / (1e18 * YEAR);
            s.reward += reward;
        }
        s.lastUpdated = block.timestamp;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "amount zero");
        updateRewards(msg.sender);
        require(token.transferFrom(msg.sender, address(this), amount), "transfer failed");
        stakes[msg.sender].amount += amount;
        votingPower[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        StakeInfo storage s = stakes[msg.sender];
        require(s.amount >= amount, "insufficient stake");
        updateRewards(msg.sender);
        s.amount -= amount;
        votingPower[msg.sender] -= amount;
        totalStaked -= amount;
        require(token.transfer(msg.sender, amount), "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function claim() external {
        updateRewards(msg.sender);
        uint256 reward = stakes[msg.sender].reward;
        stakes[msg.sender].reward = 0;
        require(token.transfer(msg.sender, reward), "transfer failed");
        emit RewardPaid(msg.sender, reward);
    }

    function earned(address user) external view returns (uint256) {
        StakeInfo storage s = stakes[user];
        uint256 reward = s.reward;
        if (s.amount > 0) {
            uint256 timeDiff = block.timestamp - s.lastUpdated;
            reward += (s.amount * interestRate * timeDiff) / (1e18 * YEAR);
        }
        return reward;
    }
}

