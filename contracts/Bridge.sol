// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pausable} from '@openzeppelin/contracts/utils/Pausable.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

interface IERC20Burnable is IERC20 {
    function burn(uint256 value) external;
}

/// @title Simple HALL cross-chain bridge
/// @notice Locks HALL tokens for bridging to other chains and burns a portion of the bridge fee
contract Bridge is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20Burnable;

    IERC20Burnable public immutable token;

    // fee in basis points (parts per 10,000)
    uint256 public feeRate;
    // part of the fee to burn in basis points
    uint256 public burnRate;

    event BridgeInitiated(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 dstChainId,
        uint256 fee
    );
    event TokensReleased(address indexed to, uint256 amount);
    event FeeRateUpdated(uint256 newFeeRate);
    event BurnRateUpdated(uint256 newBurnRate);

    constructor(address tokenAddress, uint256 _feeRate, uint256 _burnRate) Ownable(msg.sender) {
        token = IERC20Burnable(tokenAddress);
        feeRate = _feeRate;
        burnRate = _burnRate;
    }

    /// @notice set fee rate (in basis points)
    function setFeeRate(uint256 _feeRate) external onlyOwner {
        feeRate = _feeRate;
        emit FeeRateUpdated(_feeRate);
    }

    /// @notice set burn rate (in basis points of the fee)
    function setBurnRate(uint256 _burnRate) external onlyOwner {
        burnRate = _burnRate;
        emit BurnRateUpdated(_burnRate);
    }

    /// @notice deposit tokens for bridging to another chain
    /// @param amount amount of tokens user is willing to send (before fee)
    /// @param dstChainId destination chain identifier
    /// @param recipient address on the destination chain
    function bridge(uint256 amount, uint256 dstChainId, address recipient)
        external
        nonReentrant
        whenNotPaused
    {
        require(recipient != address(0), "invalid recipient");
        uint256 fee = (amount * feeRate) / 10_000;
        uint256 burnAmount = (fee * burnRate) / 10_000;
        uint256 amountAfterFee = amount - fee;

        // pull tokens from user
        token.safeTransferFrom(msg.sender, address(this), amount);

        if (burnAmount > 0) {
            token.burn(burnAmount);
        }

        emit BridgeInitiated(msg.sender, recipient, amountAfterFee, dstChainId, fee);
    }

    /// @notice release bridged tokens on this chain
    function release(address to, uint256 amount)
        external
        onlyOwner
        nonReentrant
        whenNotPaused
    {
        token.safeTransfer(to, amount);
        emit TokensReleased(to, amount);
    }

    /// @notice pause the bridge
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice unpause the bridge
    function unpause() external onlyOwner {
        _unpause();
    }
}

