// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestingVault is Ownable {
    IERC20 public immutable token;
    address public immutable beneficiary;
    uint64 public immutable start;
    uint64 public immutable cliff;
    uint64 public immutable duration;
    uint256 public released;

    constructor(
        address token_,
        address beneficiary_,
        uint64 startTimestamp,
        uint64 cliffDuration,
        uint64 duration_,
        address owner_
    ) Ownable(owner_) {
        require(beneficiary_ != address(0), "beneficiary zero address");
        require(duration_ > 0, "duration is zero");
        require(duration_ >= cliffDuration, "cliff longer than duration");
        token = IERC20(token_);
        beneficiary = beneficiary_;
        start = startTimestamp;
        cliff = startTimestamp + cliffDuration;
        duration = duration_;
    }

    function releasable() public view returns (uint256) {
        return vestedAmount(uint64(block.timestamp)) - released;
    }

    function vestedAmount(uint64 timestamp) public view returns (uint256) {
        uint256 total = token.balanceOf(address(this)) + released;
        if (timestamp < cliff) {
            return 0;
        } else if (timestamp >= start + duration) {
            return total;
        } else {
            return (total * (timestamp - start)) / duration;
        }
    }

    function release() public {
        uint256 amount = releasable();
        require(amount > 0, "nothing to release");
        released += amount;
        require(token.transfer(beneficiary, amount), "transfer failed");
    }
}

