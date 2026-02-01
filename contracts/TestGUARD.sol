// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test token to simulate additional assets.
contract TestGUARD is ERC20 {
    constructor(address recipient) ERC20("Test Guardian", "tGUARD") {
        _mint(recipient, 1_000_000 * 10 ** decimals());
    }
}
