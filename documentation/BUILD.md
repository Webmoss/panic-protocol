# 🚧 Panic Protocol — Buidl Plan (HackMoney 2026)

This document is the build tracker and task source of truth for the MVP.

---

## MVP Plan

### Days 1–2 — Contracts + Testnet

- Finalize v1 scope (ERC-20 only, single relay, fixed pricing)
- Implement `PANICToken`, `PanicVault`, `PanicRelay`
- Unit tests for burn, approvals revoke, sweep, EIP-712
- Deploy + verify on Sepolia

### Days 3–4 — Frontend Core

- UI shell with shadcn components (Card, Button, Badge, Alert) [1]
- Wallet connect stub + network gating UI
- Safe address + approval flow UI (Input, Button, Card)
- Wallet status UI: balances + approvals (Card/Table)
- Status states: Protected vs At Risk (Badge/Alert)
- Approvals table empty state + totals aligned with rows
- Disable actions when on wrong network (Sepolia gating)

### Days 5–6 — Relay + Gasless

- Relay API for `panicRelay`
- EIP-712 signing + relay submit
- Tx status + explorer links

### Days 7–8 — Purchase + Polish

- Uniswap swap flow (or faucet stub)
- Errors/loading/success UI
- Setup gating in UI (hide PANIC until setup complete)
- End-to-end demo run

### Day 9 — Submission

- Demo video + README + links
- Final run-through

---

## Scope (v1)

- **Include**: ERC-20 revoke + sweep, EIP-712 gasless relay, single trusted relay, fixed pricing.
- **Mock**: Token list (2–3 test ERC-20s), pricing (no oracle), treasury accounting.
- **Exclude**: NFTs, ETH sweep, cross-chain, DAO/governance, custom token discovery.

## Build Checklist

- [ ] PANICToken deployed
- [ ] PanicVault deployed
- [ ] Relay funded with ETH
- [ ] Hard-coded test ERC-20 tokens
- [ ] One successful gasless rescue on testnet

If all five boxes are checked, **you ship**.

---

## MVP Acceptance Criteria (Judges)

- **Setup completed**: User sets a safe address and grants vault approval.
- **Direct rescue**: `panicDirect()` revokes approvals + sweeps ERC-20 with user-paid gas.
- **Gasless rescue**: `panicRelay()` succeeds with zero user ETH; PANIC burned; relay pays gas.
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
