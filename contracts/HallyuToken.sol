// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "./interfaces/IHallyuToken.sol";

contract HallyuToken is ERC20Capped, ERC20Burnable, ERC20Votes, Ownable, IHallyuToken {
    uint256 public constant INITIAL_SUPPLY = 10_000_000_000 * 10 ** 18;
    uint256 public constant CAP = INITIAL_SUPPLY;

    address public dao;

    constructor(address daoAddress)
        ERC20("Hallyu Chain", "HALL")
        ERC20Capped(CAP)
        EIP712("Hallyu Chain", "1")
        Ownable(msg.sender)
    {
        dao = daoAddress;
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped, ERC20Votes)
    {
        if (from != address(0) && to != address(0)) {
            uint256 burnAmount = (value * 3) / 100;
            uint256 sendAmount = value - burnAmount;
            super._update(from, address(0), burnAmount);
            super._update(from, to, sendAmount);
        } else {
            super._update(from, to, value);
        }
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

