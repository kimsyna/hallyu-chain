// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev ERC20 token whose transferFrom always fails by returning false.
contract NonStandardToken is ERC20 {
    constructor() ERC20("NonStandardToken", "NST") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // Intentionally non-standard: does not revert but returns false instead of transferring
    function transferFrom(address, address, uint256) public override returns (bool) {
        return false;
    }
}
