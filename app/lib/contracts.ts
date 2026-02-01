export const USDC_DECIMALS = 6;

export const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "remaining", type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "success", type: "bool" }],
  },
] as const;

export const VAULT_ABI = [
  {
    name: "setSafeAddress",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "safeAddress", type: "address" }],
    outputs: [],
  },
  {
    name: "safeAddresses",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "nonces",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "panicDirect",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokens", type: "address[]" },
      { name: "spenders", type: "address[]" },
    ],
    outputs: [],
  },
] as const;

export const RELAY_ABI = [
  {
    name: "executeRelay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "request",
        type: "tuple",
        components: [
          { name: "user", type: "address" },
          { name: "tokens", type: "address[]" },
          { name: "spenders", type: "address[]" },
          { name: "safeAddress", type: "address" },
          { name: "deadline", type: "uint256" },
          { name: "nonce", type: "uint256" },
        ],
      },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
  },
] as const;
