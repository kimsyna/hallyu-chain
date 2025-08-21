// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HallyuToken is ERC20Capped, ERC20Burnable, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10_000_000_000 * 10 ** 18;
    uint256 public constant CAP = INITIAL_SUPPLY;

    address public dao;
    uint256 public lastMintYear;
    uint256 public mintedThisYear;
    uint256 public yearlyMintLimit;

    constructor(address daoAddress)
        ERC20("Hallyu Chain", "HALL")
        ERC20Capped(CAP)
        Ownable(msg.sender)
    {
        dao = daoAddress;
        _mint(msg.sender, INITIAL_SUPPLY);
        lastMintYear = block.timestamp / 365 days;
        yearlyMintLimit = totalSupply() * 2 / 100;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Not DAO");
        _;
    }

    function mint(address to, uint256 amount) public onlyDAO {
        uint256 currentYear = block.timestamp / 365 days;
        if (currentYear > lastMintYear) {
            mintedThisYear = 0;
            lastMintYear = currentYear;
            yearlyMintLimit = totalSupply() * 2 / 100; // 2%
        }
        require(mintedThisYear + amount <= yearlyMintLimit, "Mint exceeds annual limit");
        mintedThisYear += amount;
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped)
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
}

