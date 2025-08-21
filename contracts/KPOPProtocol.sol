// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KPOPProtocol is ERC20, ERC20Burnable, Ownable {
    uint256 public immutable maxSupply;

    constructor(uint256 initialSupply, uint256 _maxSupply)
        ERC20("KPOP Protocol", "KPP")
        Ownable(msg.sender)
    {
        require(_maxSupply > 0, "max supply is zero");
        require(initialSupply <= _maxSupply, "initial exceeds max supply");
        maxSupply = _maxSupply;
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= maxSupply, "cap exceeded");
        _mint(to, amount);
    }
}

