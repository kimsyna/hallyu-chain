// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HallyuDAO.sol";

contract HallyuDAO_Test is HallyuDAO {
    function propose(address target, bytes memory data, string memory description)
        external
        returns (uint256)
    {
        return _propose(target, data, description);
    }
}
