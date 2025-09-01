// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title CommunityRewards
/// @notice Converts off-chain activity points to HALL tokens
contract CommunityRewards is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    uint256 public conversionRate; // HALL per point (in wei)

    mapping(address => uint256) public points;

    event ConversionRateUpdated(uint256 newRate);
    event PointsAdded(address indexed user, uint256 amount);
    event Redeemed(address indexed user, uint256 points, uint256 hallAmount);

    constructor(address token_, uint256 rate_) Ownable(msg.sender) {
        token = IERC20(token_);
        conversionRate = rate_;
    }

    function setConversionRate(uint256 rate) external onlyOwner {
        conversionRate = rate;
        emit ConversionRateUpdated(rate);
    }

    function addPoints(address user, uint256 amount) external onlyOwner {
        points[user] += amount;
        emit PointsAdded(user, amount);
    }

    function redeem(uint256 amount) external nonReentrant {
        require(points[msg.sender] >= amount, "not enough points");
        uint256 hallAmount = amount * conversionRate;
        points[msg.sender] -= amount;
        token.safeTransfer(msg.sender, hallAmount);
        emit Redeemed(msg.sender, amount, hallAmount);
    }
}

