import { useEffect, useRef, useState } from "react";
import { zeroAddress, type Address } from "viem";
import type { TokenConfig } from "~/lib/tokens";

type PanicStatus = "idle" | "signing" | "executing" | "done" | "error";

type UsePanicFlowParams = {
  address?: Address;
  chainId?: number;
  panicVaultAddress?: Address;
  panicRelayAddress?: Address;
  tokenList: TokenConfig[];
  safeAddressOnChain?: Address | null;
  nonceData?: bigint;
  hasEthBalance: boolean;
  writeContractAsync: (config: {
    address: Address;
    abi: readonly unknown[];
    functionName: string;
    args?: readonly unknown[];
  }) => Promise<`0x${string}`>;
  signTypedDataAsync: (config: {
    domain: {
      name: string;
      version: string;
      chainId?: number;
      verifyingContract: Address;
    };
    types: Record<string, { name: string; type: string }[]>;
    primaryType: string;
    message: Record<string, unknown>;
  }) => Promise<`0x${string}`>;
  publicClient?: {
    waitForTransactionReceipt: (config: { hash: `0x${string}` }) => Promise<unknown>;
  } | null;
  vaultAbi: readonly unknown[];
  relayAbi: readonly unknown[];
  refetchTokenReads: () => Promise<unknown>;
};

export const usePanicFlow = ({
  address,
  chainId,
  panicVaultAddress,
  panicRelayAddress,
  tokenList,
  safeAddressOnChain,
  nonceData,
  hasEthBalance,
  writeContractAsync,
  signTypedDataAsync,
  publicClient,
  vaultAbi,
  relayAbi,
  refetchTokenReads,
}: UsePanicFlowParams) => {
  const [panicStatus, setPanicStatus] = useState<PanicStatus>("idle");
  const [panicTxHash, setPanicTxHash] = useState<string | undefined>(undefined);
  const previousAddressRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousAddressRef.current !== address) {
      previousAddressRef.current = address;
      setPanicStatus("idle");
      setPanicTxHash(undefined);
    }
  }, [address]);

  const handlePanicDirect = async () => {
    if (!panicVaultAddress || tokenList.length === 0) return;
    try {
      setPanicStatus("signing");
      const tokens = tokenList.map((token) => token.address);
      const spenders = tokens.map(() => zeroAddress);
      const hash = await writeContractAsync({
        address: panicVaultAddress,
        abi: vaultAbi,
        functionName: "panicDirect",
        args: [tokens, spenders],
      });
      setPanicStatus("executing");
      await publicClient?.waitForTransactionReceipt({ hash });
      setPanicTxHash(hash);
      await refetchTokenReads();
      setPanicStatus("done");
    } catch (error) {
      console.error(error);
      setPanicStatus("error");
    }
  };

  const handlePanicRelay = async () => {
    if (!panicRelayAddress || !panicVaultAddress || tokenList.length === 0) return;
    if (!address) return;
    if (!safeAddressOnChain || safeAddressOnChain === zeroAddress) {
      setPanicStatus("error");
      return;
    }
    if (typeof nonceData !== "bigint") return;

    try {
      setPanicStatus("signing");
      const tokens = tokenList.map((token) => token.address);
      const spenders = tokens.map(() => zeroAddress);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);
      const request = {
        user: address,
        tokens,
        spenders,
        safeAddress: safeAddressOnChain,
        deadline,
        nonce: nonceData,
      };
      const signature = await signTypedDataAsync({
        domain: {
          name: "PanicVault",
          version: "1",
          chainId,
          verifyingContract: panicVaultAddress,
        },
        types: {
          RelayPanic: [
            { name: "user", type: "address" },
            { name: "tokens", type: "address[]" },
            { name: "spenders", type: "address[]" },
            { name: "safeAddress", type: "address" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
          ],
        },
        primaryType: "RelayPanic",
        message: request,
      });
      setPanicStatus("executing");
      const hash = await writeContractAsync({
        address: panicRelayAddress,
        abi: relayAbi,
        functionName: "executeRelay",
        args: [request, signature],
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      setPanicTxHash(hash);
      await refetchTokenReads();
      setPanicStatus("done");
    } catch (error) {
      console.error(error);
      setPanicStatus("error");
    }
  };

  const handlePanic = async () => {
    if (hasEthBalance) {
      await handlePanicDirect();
    } else {
      await handlePanicRelay();
    }
  };

  return {
    panicStatus,
    panicTxHash,
    handlePanic,
    handlePanicDirect,
    handlePanicRelay,
  };
};
