// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Prepaid emergency gas credit token.
contract PANICToken is ERC20, Ownable {
    address public vault;

    error NotVault();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address vault_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        vault = vault_;
    }

    function setVault(address vault_) external onlyOwner {
        vault = vault_;
    }

    /// @notice Burn tokens from a user account. Only vault can call.
    function burnFrom(address account, uint256 amount) external {
        if (msg.sender != vault) revert NotVault();
        _burn(account, amount);
    }
}
