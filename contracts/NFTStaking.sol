// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NFT Staking for Hallyu NFT holders
/// @notice Stake NFTs to earn HALL token rewards and gain metaverse privileges
contract NFTStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC721 public immutable nft;
    IERC20 public immutable rewardToken;
    uint256 public rewardRate; // reward per second per NFT (in token wei)

    struct Staker {
        uint256 balance;
        uint256 rewards;
        uint256 lastUpdate;
    }

    mapping(address => Staker) public stakers;
    mapping(uint256 => address) public tokenOwner;

    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);

    constructor(address _nft, address _rewardToken, uint256 _rewardRate) Ownable(msg.sender) {
        nft = IERC721(_nft);
        rewardToken = IERC20(_rewardToken);
        rewardRate = _rewardRate;
    }

    modifier updateReward(address account) {
        Staker storage staker = stakers[account];
        if (staker.balance > 0) {
            staker.rewards += staker.balance * rewardRate * (block.timestamp - staker.lastUpdate);
        }
        staker.lastUpdate = block.timestamp;
        _;
    }

    function stake(uint256 tokenId) external nonReentrant updateReward(msg.sender) {
        nft.transferFrom(msg.sender, address(this), tokenId);
        stakers[msg.sender].balance += 1;
        tokenOwner[tokenId] = msg.sender;
        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external nonReentrant updateReward(msg.sender) {
        require(tokenOwner[tokenId] == msg.sender, "Not owner");
        stakers[msg.sender].balance -= 1;
        tokenOwner[tokenId] = address(0);
        nft.transferFrom(address(this), msg.sender, tokenId);
        emit Unstaked(msg.sender, tokenId);
    }

    function claim() external nonReentrant updateReward(msg.sender) {
        uint256 reward = stakers[msg.sender].rewards;
        stakers[msg.sender].rewards = 0;
        rewardToken.safeTransfer(msg.sender, reward);
        emit RewardPaid(msg.sender, reward);
    }

    function earned(address account) public view returns (uint256) {
        Staker memory staker = stakers[account];
        return staker.rewards + staker.balance * rewardRate * (block.timestamp - staker.lastUpdate);
    }

    /// @notice check if user has metaverse access (at least one NFT staked)
    function hasMetaverseAccess(address account) external view returns (bool) {
        return stakers[account].balance > 0;
    }

    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
        emit RewardRateUpdated(_rate);
    }
}

