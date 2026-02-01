// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test MOSS token for Sepolia.
contract TestMOSS is ERC20 {
    constructor(address recipient) ERC20("Test Moss", "tMOSS") {
        _mint(recipient, 1_000_000 * 10 ** decimals());
    }
}
