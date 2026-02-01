// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { EIP712 } from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import { PANICToken } from "./PANICToken.sol";

/// @notice Core contract to revoke approvals and sweep tokens.
contract PanicVault is EIP712 {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    struct RelayPanic {
        address user;
        address[] tokens;
        address[] spenders;
        address safeAddress;
        uint256 deadline;
        uint256 nonce;
    }

    bytes32 private constant RELAY_TYPEHASH =
        keccak256(
            "RelayPanic(address user,address[] tokens,address[] spenders,address safeAddress,uint256 deadline,uint256 nonce)"
        );

    PANICToken public immutable panicToken;
    uint256 public relayCost;

    mapping(address => uint256) public nonces;
    mapping(address => address) public safeAddresses;

    error DeadlineExpired();
    error InvalidSignature();
    error InvalidInput();
    error SafeAddressRequired();
    error SafeAddressMismatch();

    event SafeAddressSet(address indexed user, address safeAddress);
    event PanicExecuted(address indexed user, address safeAddress, bool relayMode);

    constructor(address panicToken_, uint256 relayCost_) EIP712("PanicVault", "1") {
        panicToken = PANICToken(panicToken_);
        relayCost = relayCost_;
    }

    function setSafeAddress(address safeAddress) external {
        if (safeAddress == address(0)) revert SafeAddressRequired();
        safeAddresses[msg.sender] = safeAddress;
        emit SafeAddressSet(msg.sender, safeAddress);
    }

    function panicDirect(address[] calldata tokens, address[] calldata spenders) external {
        _executePanic(msg.sender, tokens, spenders, false);
    }

    function panicRelay(
        RelayPanic calldata request,
        bytes calldata signature
    ) external {
        if (block.timestamp > request.deadline) revert DeadlineExpired();
        if (request.user == address(0)) revert InvalidInput();
        if (request.nonce != nonces[request.user]) revert InvalidSignature();
        if (safeAddresses[request.user] != request.safeAddress)
            revert SafeAddressMismatch();

        bytes32 structHash = keccak256(
            abi.encode(
                RELAY_TYPEHASH,
                request.user,
                keccak256(abi.encodePacked(request.tokens)),
                keccak256(abi.encodePacked(request.spenders)),
                request.safeAddress,
                request.deadline,
                request.nonce
            )
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);
        if (signer != request.user) revert InvalidSignature();

        nonces[request.user] += 1;
        panicToken.burnFrom(request.user, relayCost);

        _executePanic(request.user, request.tokens, request.spenders, true);
    }

    function _executePanic(
        address user,
        address[] calldata tokens,
        address[] calldata spenders,
        bool relayMode
    ) internal {
        address safeAddress = safeAddresses[user];
        if (safeAddress == address(0)) revert SafeAddressRequired();
        if (tokens.length != spenders.length) revert InvalidInput();

        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20 token = IERC20(tokens[i]);
            uint256 balance = token.balanceOf(user);
            if (balance > 0) {
                token.safeTransferFrom(user, safeAddress, balance);
            }
        }

        emit PanicExecuted(user, safeAddress, relayMode);
    }
}
