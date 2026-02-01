# 🚧 Panic Protocol — Buidl Plan (HackMoney 2026)

This document is the build tracker and task source of truth for the MVP.

---

## MVP Plan

### Days 1–2 — Contracts + Testnet

- [x] Finalize v1 scope (ERC-20 only, single relay, fixed pricing)
- [x] Implement `PANICToken`, `PanicVault`, `PanicRelay`
- [x] Unit tests for burn, approvals revoke, sweep, EIP-712
- [x] Deploy on Sepolia
- [x] Deploy test tokens (tUSDC, tMOSS, tGUARD)

### Days 3–4 — Frontend Core

- [x] UI shell with shadcn components (Card, Button, Badge, Alert) [1]
- [x] Wallet connect stub + network gating UI
- [x] Safe address + approval flow UI (Input, Button, Card)
- [x] Wallet status UI: balances + approvals (Card/Table)
- [x] Status states: Protected vs At Risk (Badge/Alert)
- [x] Approvals table empty state + totals aligned with rows
- [x] Disable actions when on wrong network (Sepolia gating)

### Days 5–6 — Relay + Gasless

- Relay API for `panicRelay`
- EIP-712 signing + relay submit
- Tx status + explorer links
- History tab pulls recent txs from Etherscan

### Days 7–8 — Purchase + Polish

- [x] Uniswap swap flow (or faucet stub)
- [x] Errors/loading/success UI
- [x] Setup gating in UI (hide PANIC until setup complete)
- [x] End-to-end demo run

### Day 9 — Submission

- Demo video + README + links
- Final run-through

---

## Scope (v1)

- **Include**: ERC-20 sweep, EIP-712 gasless relay, single trusted relay, fixed pricing.
- **Mock**: Token list (2–3 test ERC-20s), pricing (no oracle), treasury accounting.
- **Exclude**: NFTs, ETH sweep, cross-chain, DAO/governance, custom token discovery.

## Build Checklist

- [x] PANICToken deployed
- [x] PanicVault deployed
- [x] PanicRelay deployed
- [x] Relay funded with ETH
- [x] Hard-coded test ERC-20 tokens
- [x] One successful gasless rescue on testnet

If all five boxes are checked, **you ship**.

Latest Sepolia demo:
- Gasless relay tx: 0x1b5648b3c3b68ed8bb7afa3e34ba04e0387a7094c888e6f9399da0618123bd57
- Safe address: 0x58071A24e6115e599622b16Ad1A29657D2430ebA

---

## MVP Acceptance Criteria (Judges)

- **Setup completed**: User sets a safe address and grants vault approval.
- **Direct rescue**: `panicDirect()` sweeps ERC-20 with user-paid gas.
- **Gasless rescue**: `panicRelay()` sweeps ERC-20 with zero user ETH; PANIC burned; relay pays gas.
- **UI confirmation**: Before/after approvals + balances are shown clearly.
- **Proof**: Transaction hash and explorer links are visible for both flows.

---

## Demo Environment Checklist

- **Network**: Sepolia (or current ETHGlobal-recommended testnet)
- **Relay wallet**: Funded with ETH and whitelisted in `PanicRelay`
- **Test tokens**: 2–3 ERC-20s deployed; user holds balances
- **Approvals**: User pre-approved PanicVault for each test token
- **Drain simulation**: User ETH is reduced to ~0 before gasless demo

---

## Frontend QA Checklist

- [x] Wallet connect state (connected / not connected) displays correctly
- [x] Wrong network banner shows and disables actions
- [x] Setup gating hides PANIC until setup complete
- [x] Approvals table empty state renders
- [x] Totals match displayed approvals
- [x] PANIC button disabled when setup incomplete

---

## Next 7 Days Plan

### Days 1–2 — Reliability + Validation

- Enforce actual PANIC balance before setup step 1 completes
- Validate all required contract addresses at runtime
- Add user-facing errors for approval + panic failures

### Days 3–4 — Network Gating + UX

- Hide approvals data when on wrong network (show lock state)
- Add basic loading states for balance + approvals reads
- Reset local safe address on network change

### Day 5 — History (Etherscan-backed)

- Pull recent txs from Etherscan for approvals + PANIC
- Sync status updates in the History tab

### Day 6 — Edge Cases + QA

- Handle empty token list with clear messaging
- Confirm ENS resolution behavior by chain
- Queue batch revokes to avoid race conditions

### Day 7 — Demo Polish

- Add “why disabled?” helper text for gated actions
- Tighten setup + panic copy
- Full end-to-end demo run

---

## Work Completed (Additions)

- [x] Wagmi + RainbowKit integration (providers + styles)
- [x] Live ETH balance via Wagmi `useBalance`
- [x] Live USDC balance via `useReadContract`
- [x] Chain-aware network labels (Wagmi `useChains`)
- [x] Switch Network banner wired to RainbowKit modal
- [x] Connect Wallet button wired to RainbowKit
- [x] Setup flow interactive stubs (buy/save/approve)
- [x] Hardhat deploy scripts for PANIC contracts (token/vault/relay)
- [x] Live approvals + revoke actions wired to vault allowances
- [x] Setup flow validation (ENS + address) and network gating
- [x] Demo tokens distributed to test wallets

---

## Next Tasks (Priority)

- [x] Update PANICToken vault address to new PanicVault (call `setVault`)
- [x] Whitelist relayer
- [x] Fund relay wallet with ETH
- [x] Add deploy script output + addresses to docs
- [x] Replace mock approvals with on-chain approvals (token list + spender list)
- [x] Add safe address persistence (local storage or contract config)
- [x] Add approval + sweep actions (transaction wiring)
- [x] Wire gasless relay in UI (panicRelay flow)
