# Contracts

This folder contains the v1 smart contracts for Panic Protocol.

- `PANICToken.sol`: ERC-20 used as prepaid emergency gas credits.
- `PanicVault.sol`: Core ERC-20 sweep logic, supports gasless relay via EIP-712.
- `PanicRelay.sol`: Relayer allowlist and forwarding to `PanicVault`.

## Build & Test (Hardhat)

```bash
npm run hardhat:compile
npm run hardhat:test
```

## Deploy Scripts

Deploy scripts live in `deploy/`.

## Sepolia Addresses (Latest)

- `PANICToken`: `0x5C871afBE008452E12a4751e1af9fc768e482c74`
- `PanicVault`: `0x84244292a8403EFE55B8822d429217fb39C2E57e`
- `PanicRelay`: `0x8B5bdEeeB4527459131112d2F032b95b36d07c39`
- Test tokens: `tUSDC` `0x0d0FC24e51266bF030D93DFD491550A4914A3188`, `tMOSS` `0x1a21a8Ee6cFd1404e70d36b28E34eC6a5aB2621F`, `tGUARD` `0x544ae89AfcD897E77Bb73b81ED66eaeE0a4a3196`
- Latest gasless demo tx: `0x1b5648b3c3b68ed8bb7afa3e34ba04e0387a7094c888e6f9399da0618123bd57`
- Deployer/relayer: `0xDa2DBa231CB11cf85E1d9e23359989105da0b2f7`
- `setVault` tx: `0xb82d4dc7e9487c3a39e9fbf0d3b37514f972234d509825e148a8ed6e3e7867e5`
- `setRelayer` tx: `0xa6614c8faa748b287f7e4bd0839b36b97581fb4cf166fad7d1c92877a0f69b1f`

### Deploy PANICToken

Set:

```text
PANIC_NAME=panic
PANIC_SYMBOL=PANIC
PANIC_SUPPLY=100000000
PANIC_VAULT_ADDRESS=<optional>
```

Run:

```bash
npm run hardhat:deploy:panic-token
```

### Deploy PanicVault

Set:

```text
PANIC_TOKEN_ADDRESS=<token_address>
RELAY_COST=300
```

Run:

```bash
npm run hardhat:deploy:panic-vault
```

### Deploy PanicRelay

Set:

```text
PANIC_VAULT_ADDRESS=<vault_address>
```

Run:

```bash
npm run hardhat:deploy:panic-relay
```

### Set PANICToken Vault

Set:

```text
PANIC_TOKEN_ADDRESS=<token_address>
PANIC_VAULT_ADDRESS=<vault_address>
```

Run:

```bash
npm run hardhat:set:panic-vault
```

### Whitelist Relayer

Set:

```text
PANIC_RELAY_ADDRESS=<relay_address>
RELAYER_ADDRESS=<relayer_address>
```

Run:

```bash
npm run hardhat:set:relayer
```

## Deploy Test Tokens (Sepolia)

Set the following env vars (in `.env` or your shell):

```text
SEPOLIA_RPC_URL=<your_rpc_url>
SEPOLIA_PRIVATE_KEY=<deployer_private_key>
```

Then run:

```bash
npm run hardhat:deploy:test-tokens
```

This deploys three ERC-20 test tokens and mints 1,000,000 to the deployer:

- Test USDC (`tUSDC`)
- Test MOSS (`tMOSS`)
- Test GUARD (`tGUARD`)

## Send Test Tokens (Sepolia)

Set:

```text
RECIPIENT=<recipient_address>
```

Run:

```bash
npm run hardhat:send:test-tokens
```

This sends a small amount of each test token to the recipient.

## Gasless Demo (Sepolia)

```bash
npm run hardhat:demo:gasless
```

This performs a full `panicRelay()` flow end-to-end (approvals + safe address + sweep).

## Notes

- v1 scope is ERC-20 sweep only. NFT support and ETH sweep are deferred.
- Replace placeholder addresses in the frontend `.env` once deployed.
