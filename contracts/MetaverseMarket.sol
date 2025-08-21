// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MetaverseMarket
/// @notice Simple marketplace for virtual items using HALL tokens as payment
contract MetaverseMarket is Ownable {
    IERC20 public immutable paymentToken;

    mapping(uint256 => uint256) public itemPrices;

    event ItemPriceSet(uint256 indexed itemId, uint256 price);
    event ItemPurchased(address indexed buyer, uint256 indexed itemId, uint256 price);

    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }

    /// @notice owner can set price for an item
    function setItemPrice(uint256 itemId, uint256 price) external onlyOwner {
        itemPrices[itemId] = price;
        emit ItemPriceSet(itemId, price);
    }

    /// @notice purchase a virtual item using approved tokens
    function purchase(uint256 itemId) external {
        uint256 price = itemPrices[itemId];
        require(price > 0, "Item not for sale");
        paymentToken.transferFrom(msg.sender, owner(), price);
        emit ItemPurchased(msg.sender, itemId, price);
    }
}

