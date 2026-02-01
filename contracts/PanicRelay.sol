// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { PanicVault } from "./PanicVault.sol";

/// @notice Relay coordinator for gasless panic.
contract PanicRelay is Ownable {
    PanicVault public immutable vault;
    mapping(address => bool) public isRelayer;

    error NotRelayer();

    event RelayerUpdated(address relayer, bool allowed);

    constructor(address vault_) Ownable(msg.sender) {
        vault = PanicVault(vault_);
    }

    function setRelayer(address relayer, bool allowed) external onlyOwner {
        isRelayer[relayer] = allowed;
        emit RelayerUpdated(relayer, allowed);
    }

    function executeRelay(
        PanicVault.RelayPanic calldata request,
        bytes calldata signature
    ) external {
        if (!isRelayer[msg.sender]) revert NotRelayer();
        vault.panicRelay(request, signature);
    }
}
