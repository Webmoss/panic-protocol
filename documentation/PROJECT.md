# 🚨 Panic Protocol — EthGlobal HackMoney 2026

**Emergency Gas for Compromised Wallets**

> *An emergency stop button for hacked wallets — even after all ETH is drained.*

---

## Overview

**The Problem**: When your wallet is compromised and drained of ETH, you cannot pay gas to execute emergency transactions — you're locked out of your own rescue mechanism.

**The Solution**: Panic Protocol combines an emergency stop button with a self-funding mechanism. Users purchase PANIC tokens upfront as "emergency gas credits" that can be redeemed through a gasless relay when they have no ETH.

**Key Innovation**: Even with ZERO ETH, you can still sweep ERC-20 funds to a safe backup wallet by burning PANIC tokens through a gasless relay system.

---

## HackMoney 2026 Context

- **Event dates**: January 30 – February 11, 2026 (async).
- **Submission deadline**: Project submissions due Feb 8 (confirm exact time in your dashboard/timezone).
- **Prize partners**: ENS, Uniswap Foundation, Sui, Arc, Yellow, LI.FI.

---

## 💡 The Insight

**Gas is the real single point of failure in wallet security.**

Existing security tooling assumes users can always pay gas. In real attacks, that assumption breaks.

**Panic Protocol treats gas itself as a security primitive.**

---

## The Problem

When your wallet is compromised, you notice **after** the first unauthorized transaction.

### The Death Spiral

1. Your wallet is compromised
2. Attacker drains your ETH first (most common attack pattern)
3. You still have valuable ERC-20 tokens and NFTs
4. Token approvals are still active
5. **You have no ETH to pay gas for ANY transaction**
6. You watch helplessly as tokens are drained one by one

**You need an emergency stop button that works with zero ETH.**

### Current "Solutions" Are Inadequate

- **Revoke.cash**: Requires ETH for each revocation transaction
- **New wallet**: Attacker can drain faster than you can transfer
- **Contact exchange**: Too slow, tokens gone in minutes
- **Gas stations**: Complex, not designed for emergencies

**You need**: Emergency gas that works when you have nothing left.

---

## The Solution: Dual-Path Emergency System

### Path 1: Direct Execution (You Have ETH)

```text
Click PANIC → Sign transaction → Pay gas directly → Wallet secured
```

- **Time**: 15 seconds
- **Cost**: Regular gas fees (~$5–30)
- **PANIC tokens**: Not consumed

### Path 2: Relay Execution (You Have NO ETH)

```text
Click PANIC → Sign gasless message → Relay executes → Burns PANIC tokens → Wallet secured
```

- **Time**: 30 seconds
- **Cost**: 300 PANIC tokens (~$30)
- **User ETH**: Zero required

Execution mode is selected by the user (direct or relay) based on their ETH balance.

---

## How It Works

### Setup Phase (One Time)

1. **Connect Wallet**: MetaMask / WalletConnect
2. **Purchase PANIC Tokens**:
   - Recommended: 1,000 tokens (~0.1 ETH / $200)
   - Covers 3–5 emergency operations
   - Stored in your wallet
3. **Set Safe Address**: Hardware wallet or cold storage address
4. **Grant emergency transfer approval** to PanicVault (one-time allowance for sweep)
5. **Done**: You're protected

### Emergency Phase (When Compromised)

**System auto-detects your situation**:

- **If you have ETH**: Shows "Direct Execution" mode — one transaction, you pay gas; PANIC tokens remain.
- **If you have NO ETH**: Shows "Relay Execution" mode — gasless signature only; burns PANIC tokens; relay submits transaction for you.

### What Happens When You Click PANIC

1. **Sweep Remaining Assets** — Transfers ERC-20 balances to safe address (v1: ERC-20 only; NFT and ETH sweep in later phase).
2. **Confirmation** — Transaction hash, block explorer link, summary of what was saved.

> Panic Protocol **cannot stop transactions already in the mempool**.

---

## Architecture Overview

```text
User Wallet
   │
   │ (EIP-712 signature if no ETH)
   ▼
Relay API
   │
   │ submits transaction
   ▼
PanicVault
   │
   ├─ burns PANIC (relay mode)
   └─ sweeps tokens to safe address
```

---

## Technical Architecture

### Smart Contracts (3 Contracts)

#### 1. PANICToken.sol (ERC-20)

- Total supply: 100M PANIC
- Purchase with ETH at fixed price (e.g. 0.0001 ETH per token)
- Only PanicVault can burn user tokens (for relay execution)
- Treasury receives purchase payment

#### 2. PanicVault.sol (Main Logic)

- **Direct panic**: User calls `panicDirect(tokens, spenders)` and pays gas.
- **Relay panic**: Relay calls `panicRelay(...)` with user’s EIP-712 signature; contract verifies signature, burns PANIC from user, executes sweep logic.
- EIP-712 domain and typehash for structured signing
- Nonce + deadline to prevent replay
- Minimum PANIC for relay (e.g. 300 tokens)

**v1 scope**:

- ERC-20 tokens only
- No ETH sweep (ERC-20 sweep only)
- Requires emergency transfer approval granted during setup

**v2 scope**:

- ERC-721 / ERC-1155 support
- ETH sweep (after token sweeps)

#### 3. PanicRelay.sol (Relay Coordinator)

- Only authorized relay addresses can call `executeRelay(...)`
- Forwards to `PanicVault.panicRelay(...)`
- Owner can add/remove relay addresses

*(Full Solidity snippets are in the repo or can be added under `contracts/` when implemented.)*

---

## Build & Execution

Build steps, checklists, and demo prep live in `documentation/BUILD.md`.

---

## Token Economics

### PANIC Token Distribution (100M total)

| Allocation       | Amount | Purpose                    | Vesting        |
|------------------|--------|----------------------------|----------------|
| User Purchases   | 40M    | Available for purchase     | Immediate      |
| Relay Operators  | 20M    | Incentivize relay operation| 2 years linear |
| Protocol Treasury| 20M    | Gas reimbursements & reserves | As needed   |
| Team             | 10M    | Core team                  | 1yr cliff, 3yr vest |
| Liquidity        | 10M    | Initial DEX liquidity      | Locked 6 months |

### Pricing Model

- **Base price**: 1 PANIC = 0.0001 ETH (~$0.20 at $2000 ETH)
- **Relay cost**: e.g. 300 PANIC minimum per relay execution
- **Deflationary**: Tokens burned on relay use; no minting after initial supply

### Purchase Tiers

- **Starter**: 500 PANIC (~0.05 ETH / $100) — 1–2 operations
- **Standard**: 1,000 PANIC (~0.1 ETH / $200) — 3–5 operations (recommended)
- **Premium**: 2,500 PANIC (~0.25 ETH / $500) — 8–10 operations

PANIC functions as **emergency insurance**, not a speculative utility token.

---

## Relay Infrastructure

### Flow

```text
User (No ETH) → Signs EIP-712 message → Relay API
       → Validates signature → Submits tx
       → Contract verifies, burns PANIC, executes panic
       → Treasury reimburses relay (+ markup)
```

### Relay Responsibilities

1. Receive gasless signatures from users
2. Validate signature, PANIC balance, nonce, deadline
3. Submit transaction to chain
4. Pay gas upfront; get reimbursed from treasury + markup (e.g. 20%)

### Hackathon vs Phase 2

- **Hackathon**: Single relay operated by team; simple API; manual funding
- **Phase 2**: Decentralized relay network; staking; reputation; failover

---

## Frontend Stack (This Repo)

- **Framework**: React 19, React Router v7, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Radix UI, Lucide icons, class-variance-authority, clsx, tailwind-merge, tw-animate
- **Rendering**: SSR by default; can be deployed as static/SPA
- **Web3**: Wagmi + Viem + RainbowKit
- **UX**: Approvals + history tab (Etherscan-backed)

## Sponsor Protocols We Can Utilize

Based on the official HackMoney 2026 partners list, these are the protocols we can realistically integrate and the prizes we will target.

### Planned Integrations (v1)

- **ENS**: Allow users to set or display their safe address as an ENS name; resolve ENS to address in the setup flow.
- **Uniswap Foundation**: Use Uniswap pools for PANIC purchase and liquidity; power the "Buy PANIC" UI with a Uniswap swap flow.
- **LI.FI**: Optional bridge/onramp to acquire PANIC or ETH from other chains for setup (not used during emergency flow).

### ENS Prize Targets

**Integrate ENS — $3,500 (pool prize)**  
Requirement: include ENS-specific code (not just RainbowKit) using live lookups (no hard-coded values). Demo must be functional with video or live link; code open source.

**Most Creative ENS for DeFi — $1,500**  
Requirement: ENS must clearly improve the product (not an afterthought), use real ENS data, and be demoed live or via video with open-source code.

## User Flows (Summary)

### First-Time Setup

Connect wallet → Purchase PANIC tokens (recommended 1,000) → Set safe address → Status: Protected.

### Emergency — You Have ETH

Click PANIC → Direct execution → Review sweep → Sign tx, pay gas → Done; PANIC balance unchanged.

### Emergency — You Have NO ETH

Click PANIC → Relay mode → Review sweep, cost in PANIC → Sign EIP-712 message (no gas) → Relay executes, PANIC burned → Done.

---

## Demo Script (4 min)

1. **Problem**: Show wallet with approvals; simulate ETH drained → “locked out.”
2. **Traditional solutions fail**: Revoke.cash needs gas; new wallet/contact exchange too slow.
3. **Setup**: Buy PANIC, set safe address; “protected.”
4. **Hack again**: Same drain; click PANIC → relay mode → sign message → relay executes → tokens swept.
5. **Reveal**: Before/after table; “Cost: 300 PANIC. Saved: $5,000 in tokens.”

---

## Technical Challenges & Solutions

| Challenge              | Approach |
|------------------------|----------|
| Gas estimation         | `eth_estimateGas` + buffer; show direct vs relay cost |
| Failed token transfers | try/catch per token; continue others; report results |
| Relay downtime         | Status indicator; fallback to “need ETH” messaging |
| Signature replay       | Nonce + deadline; used nonces stored on-chain |
| Race with attacker     | Relay processes quickly; set expectations (first line of defense) |

---

## Security Considerations

- **Contracts**: Internal review; tooling (e.g. Slither); testnet period; no private key storage
- **Limitations**: Cannot stop txs already in mempool; cannot help if seed phrase is compromised; requires user action; v1 depends on relay availability
- **Frontend**: Validate inputs; HTTPS; secure RPC; no keys in frontend
- **Relay**: Rate limiting; verify before execute; minimal hot wallet; kill switch for abuse

---

## Post-Hackathon Roadmap

- **Phase 2**: Decentralized relays; staking; reputation; failover
- **Phase 3**: NFT support; monitoring/alerts; extension; mobile
- **Phase 4**: Multi-chain; cross-chain sweeping
- **Phase 5**: Wallet integrations (e.g. Snaps); insurance/DeFi partnerships; DAO governance

---

## Why This Wins HackMoney

### Innovation

- Solves the "no gas" failure mode directly
- Introduces prepaid emergency execution as a security primitive
- Clean abstraction over relayers

### Technical Execution

- Minimal, auditable contracts
- Clear trust boundaries
- Fully demoable end-to-end

### User Experience

- Designed for panic scenarios
- Automatic mode selection (direct vs relay)
- Honest disclosure of limitations

---

## Explicit Limitations

- **Cannot stop transactions already in the mempool**
- **Cannot protect wallets with exposed private keys**
- **Relay availability dependency in v1**

These limitations are disclosed intentionally.

---

## Positioning

**Panic Protocol is not prevention.**

**It is the emergency brake.**

**And today, that brake does not exist.**

---

*Panic Protocol — EthGlobal HackMoney 2026. Emergency stop for compromised wallets.*
