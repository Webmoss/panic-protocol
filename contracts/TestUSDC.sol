// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Test USDC token for Sepolia.
contract TestUSDC is ERC20 {
    constructor(address recipient) ERC20("Test USD Coin", "tUSDC") {
        _mint(recipient, 1_000_000 * 10 ** decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
