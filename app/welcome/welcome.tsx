import { useChainModal } from "@rainbow-me/rainbowkit";
import { isAddress, maxUint256, zeroAddress, type Address } from "viem";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAccount,
  useChainId,
  useChains,
  useEnsAddress,
  usePublicClient,
  useSignTypedData,
  useWriteContract,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ApprovalDashboard,
  type ApprovalHistoryItem,
} from "~/components/dashboard/ApprovalDashboard";
import { Header } from "~/components/layout/Header";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";
import { usePanicFlow } from "~/hooks/usePanicFlow";
import { useWalletData } from "~/hooks/useWalletData";
import { ERC20_ABI, RELAY_ABI, VAULT_ABI } from "~/lib/contracts";
import { buildTokenList, getUsdcAddress } from "~/lib/tokens";

export function Welcome() {
  const isProduction = import.meta.env.PROD;
  const explorerBaseUrl = isProduction
    ? "https://etherscan.io"
    : "https://sepolia.etherscan.io";
  const USDC_SEPOLIA_ADDRESS = import.meta.env
    .VITE_USDC_SEPOLIA_ADDRESS as Address | undefined;
  const USDC_MAINNET_ADDRESS = import.meta.env
    .VITE_USDC_MAINNET_ADDRESS as Address | undefined;
  const TEST_USDC_SEPOLIA_ADDRESS = import.meta.env
    .VITE_TEST_USDC_SEPOLIA_ADDRESS as Address | undefined;
  const TEST_MOSS_SEPOLIA_ADDRESS = import.meta.env
    .VITE_TEST_MOSS_SEPOLIA_ADDRESS as Address | undefined;
  const TEST_GUARD_SEPOLIA_ADDRESS = import.meta.env
    .VITE_TEST_GUARD_SEPOLIA_ADDRESS as Address | undefined;
  const PANIC_SEPOLIA_ADDRESS = import.meta.env
    .VITE_PANIC_SEPOLIA_ADDRESS as Address | undefined;
  const PANIC_MAINNET_ADDRESS = import.meta.env
    .VITE_PANIC_MAINNET_ADDRESS as Address | undefined;
  const PANIC_VAULT_SEPOLIA_ADDRESS = import.meta.env
    .VITE_PANIC_VAULT_SEPOLIA_ADDRESS as Address | undefined;
  const PANIC_VAULT_MAINNET_ADDRESS = import.meta.env
    .VITE_PANIC_VAULT_MAINNET_ADDRESS as Address | undefined;
  const PANIC_RELAY_SEPOLIA_ADDRESS = import.meta.env
    .VITE_PANIC_RELAY_SEPOLIA_ADDRESS as Address | undefined;
  const PANIC_RELAY_MAINNET_ADDRESS = import.meta.env
    .VITE_PANIC_RELAY_MAINNET_ADDRESS as Address | undefined;

  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData();
  const chainId = useChainId();
  const chains = useChains();
  const { openChainModal } = useChainModal();
  const targetChain = isProduction ? mainnet : sepolia;
  const isOnTargetNetwork = isConnected && chainId === targetChain.id;
  const targetNetworkLabel = targetChain.name;
  const activeChain = chains.find((chain) => chain.id === chainId);
  const networkLabel = isConnected
    ? activeChain?.name ?? "Unknown network"
    : "No network";
  
  const usdcTokenAddress = getUsdcAddress({
    isProduction,
    usdcMainnetAddress: USDC_MAINNET_ADDRESS,
    usdcSepoliaAddress: USDC_SEPOLIA_ADDRESS,
  });
  const usdcLabel = "USDC";
  const panicTokenAddress = isProduction
    ? PANIC_MAINNET_ADDRESS
    : PANIC_SEPOLIA_ADDRESS;
  const panicVaultAddress = isProduction
    ? PANIC_VAULT_MAINNET_ADDRESS
    : PANIC_VAULT_SEPOLIA_ADDRESS;
  const panicRelayAddress = isProduction
    ? PANIC_RELAY_MAINNET_ADDRESS
    : PANIC_RELAY_SEPOLIA_ADDRESS;

  const tokenList = useMemo(
    () =>
      buildTokenList({
        isProduction,
        usdcMainnetAddress: USDC_MAINNET_ADDRESS,
        usdcSepoliaAddress: USDC_SEPOLIA_ADDRESS,
        testUsdcAddress: TEST_USDC_SEPOLIA_ADDRESS,
        testMossAddress: TEST_MOSS_SEPOLIA_ADDRESS,
        testGuardAddress: TEST_GUARD_SEPOLIA_ADDRESS,
      }),
    [
      isProduction,
      USDC_MAINNET_ADDRESS,
      USDC_SEPOLIA_ADDRESS,
      TEST_USDC_SEPOLIA_ADDRESS,
      TEST_MOSS_SEPOLIA_ADDRESS,
      TEST_GUARD_SEPOLIA_ADDRESS,
    ]
  );
  const {
    ethBalance,
    hasEthBalance,
    usdcBalance,
    panicBalance,
    approvals,
    approvalsCount,
    tokenStats,
    hasApprovedVault,
    extraTokenBalances,
    approvalTokenLabels,
    safeAddressOnChain,
    nonceData,
    refetchTokenReads,
    refetchSafeAddress,
  } = useWalletData({
    address,
    isConnected,
    isOnTargetNetwork,
    usdcTokenAddress,
    panicTokenAddress,
    panicVaultAddress,
    tokenList,
    usdcLabel,
  });
  const [safeAddress, setSafeAddress] = useState("");
  const [safeAddressError, setSafeAddressError] = useState<string | undefined>(
    undefined
  );
  const [hasPurchasedPanic, setHasPurchasedPanic] = useState(false);
  const [isSavingSafeAddress, setIsSavingSafeAddress] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const previousAddressRef = useRef<string | undefined>(undefined);
  const [txHistory, setTxHistory] = useState<ApprovalHistoryItem[]>([]);
  const lastPanicModeRef = useRef<"direct" | "relay">("direct");
  const hasSavedSafeAddress =
    typeof safeAddressOnChain === "string" && safeAddressOnChain !== zeroAddress;
  const hasOnchainPanicBalance =
    typeof panicBalance === "string" && panicBalance !== "—"
      ? Number(panicBalance) > 0
      : false;
  const canExecute = isConnected && (hasEthBalance || hasOnchainPanicBalance);
  const isSetupComplete =
    hasPurchasedPanic && hasApprovedVault && hasSavedSafeAddress;
  const showWrongNetwork = isConnected && !isOnTargetNetwork;
  
  /* ENS Resolving */
  const isEnsName = safeAddress.trim().toLowerCase().endsWith(".eth");
  const { data: ensResolvedAddress } = useEnsAddress({
    name: isEnsName ? safeAddress.trim() : undefined,
    chainId: mainnet.id,
    query: { enabled: isEnsName && !!safeAddress.trim() },
  });
  const resolvedSafeAddress = isEnsName
    ? (ensResolvedAddress as Address | undefined)
    : isAddress(safeAddress)
      ? (safeAddress as Address)
      : undefined;


  /* Effects */
  useEffect(() => {
    if (hasOnchainPanicBalance) {
      setHasPurchasedPanic(true);
    }
  }, [hasOnchainPanicBalance]);

  useEffect(() => {
    if (previousAddressRef.current !== address) {
      previousAddressRef.current = address;
      setSafeAddress("");
      setSafeAddressError(undefined);
      setHasPurchasedPanic(false);
      setIsSavingSafeAddress(false);
      setIsApproving(false);
      setTxHistory([]);
    }
  }, [address]);
  const addHistory = (entry: ApprovalHistoryItem) => {
    setTxHistory((prev) => [entry, ...prev].slice(0, 20));
  };

  const updateHistoryStatus = (id: string, status: ApprovalHistoryItem["status"]) => {
    setTxHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  useEffect(() => {
    if (safeAddressError) {
      setSafeAddressError(undefined);
    }
  }, [safeAddress]);

  useEffect(() => {
    if (
      typeof safeAddressOnChain === "string" &&
      safeAddressOnChain !== zeroAddress &&
      !safeAddress
    ) {
      setSafeAddress(safeAddressOnChain);
    }
  }, [safeAddressOnChain, safeAddress]);

  useEffect(() => {
    if (!address || hasSavedSafeAddress || safeAddress) return;
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(`panic.safeAddress.${address}`);
    if (stored) {
      setSafeAddress(stored);
    }
  }, [address, hasSavedSafeAddress, safeAddress]);


  /* Handlers */
  const handleSaveSafeAddress = async () => {
    if (!panicVaultAddress || !safeAddress) return;
    if (!resolvedSafeAddress) {
      setSafeAddressError(
        isEnsName ? "ENS name could not be resolved." : "Invalid address."
      );
      return;
    }
    try {
      setIsSavingSafeAddress(true);
      const hash = await writeContractAsync({
        address: panicVaultAddress,
        abi: VAULT_ABI,
        functionName: "setSafeAddress",
        args: [resolvedSafeAddress],
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      if (typeof window !== "undefined" && address) {
        window.localStorage.setItem(
          `panic.safeAddress.${address}`,
          resolvedSafeAddress
        );
      }
      await refetchSafeAddress();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingSafeAddress(false);
    }
  };

  const handleApproveAll = async () => {
    if (!panicVaultAddress || tokenList.length === 0) return;
    try {
      setIsApproving(true);
      for (const token of tokenList) {
        const hash = await writeContractAsync({
          address: token.address,
          abi: ERC20_ABI,
          functionName: "approve",
          args: [panicVaultAddress, maxUint256],
        });
        await publicClient?.waitForTransactionReceipt({ hash });
      }
      await refetchTokenReads();
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRevoke = async (approval: { tokenAddress?: string; asset?: string }) => {
    if (!panicVaultAddress || !approval.tokenAddress) return;
    let historyId: string | undefined;
    try {
      const hash = await writeContractAsync({
        address: approval.tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [panicVaultAddress, 0n],
      });
      historyId = `revoke-${hash}`;
      addHistory({
        id: historyId,
        label: `Revoke ${approval.asset ?? "token"}`,
        hash,
        status: "pending" as const,
        createdAt: Date.now(),
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      updateHistoryStatus(historyId, "confirmed");
      await refetchTokenReads();
      return hash;
    } catch (error) {
      console.error(error);
      if (historyId) {
        updateHistoryStatus(historyId, "failed");
      }
      return undefined;
    }
  };

  const { panicStatus, panicTxHash, handlePanic, handlePanicDirect } =
    usePanicFlow({
      address,
      chainId,
      panicVaultAddress,
      panicRelayAddress,
      tokenList,
      safeAddressOnChain:
        typeof safeAddressOnChain === "string" ? safeAddressOnChain : undefined,
      nonceData: typeof nonceData === "bigint" ? nonceData : undefined,
      hasEthBalance,
      writeContractAsync,
      signTypedDataAsync,
      publicClient,
      vaultAbi: VAULT_ABI,
      relayAbi: RELAY_ABI,
      refetchTokenReads,
    });

  const handlePanicWithHistory = async () => {
    lastPanicModeRef.current = hasEthBalance ? "direct" : "relay";
    await handlePanic();
  };

  useEffect(() => {
    if (!panicTxHash || panicStatus !== "done") return;
    const id = `panic-${panicTxHash}`;
    setTxHistory((prev) => {
      if (prev.some((item) => item.id === id)) return prev;
      return [
        {
          id,
          label:
            lastPanicModeRef.current === "relay"
              ? "PANIC (Relay)"
              : "PANIC (Direct)",
          hash: panicTxHash,
          status: "confirmed" as const,
          createdAt: Date.now(),
        },
        ...prev,
      ].slice(0, 20);
    });
  }, [panicTxHash, panicStatus]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
        <Card className="border-neutral-900 bg-black text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-x-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                Dashboard
              </h1>
              <p className="text-sm text-white/90">
                Inspect and revoke risky approvals to secure your wallet from risk. Hit PANIC to secure your assets.
              </p>
            </div>
            <div className="flex w-full flex-wrap justify-end gap-2 md:w-auto">
              {canExecute && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    className="min-w-[160px] border-white text-black hover:bg-white/80"
                    disabled={!isSetupComplete || !isOnTargetNetwork}
                    onClick={handlePanicDirect}
                  >
                    SWEEP
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="min-w-[160px]"
                    disabled={!isSetupComplete || !isOnTargetNetwork}
                    onClick={handlePanicWithHistory}
                  >
                    PANIC
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {showWrongNetwork && (
          <Alert variant="destructive" className="w-full">
            <AlertDescription className="flex w-full flex-wrap items-center justify-between gap-3 text-base font-semibold">
              <span>
                Switch to {targetNetworkLabel} to test execute PANIC actions on Testnet only!
              </span>
              <Button
                variant="destructive"
                size="lg"
                className="border-red-600 bg-red-600 text-white hover:bg-red-500"
                onClick={() => openChainModal?.()}
              >
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,840px)_1fr]">
          <ApprovalDashboard
            isOnTargetNetwork={isOnTargetNetwork}
            isConnected={isConnected}
            approvals={approvals}
            onRevoke={handleRevoke}
            onSwitchNetwork={() => openChainModal?.()}
            onRefresh={refetchTokenReads}
            history={txHistory}
            explorerBaseUrl={explorerBaseUrl}
          />
          <div className="flex flex-col gap-6">
            {isSetupComplete && (
              <PanicCard
                panicStatus={panicStatus}
                onConfirm={handlePanicWithHistory}
                mode={hasEthBalance ? "direct" : "relay"}
                txHash={panicTxHash}
                explorerBaseUrl={explorerBaseUrl}
                disabled={!isOnTargetNetwork || !isConnected}
              />
            )}
            <WalletStatusCard
              isConnected={isConnected}
              networkLabel={networkLabel}
              address={address}
              ethBalance={ethBalance}
              usdcBalance={usdcBalance}
              usdcLabel={usdcLabel}
              panicBalance={panicBalance}
              approvalsCount={approvalsCount}
              tokenBalances={extraTokenBalances}
            />
            {isConnected && !isSetupComplete && (
              <SetupCard
                isConnected={isConnected}
                isOnTargetNetwork={isOnTargetNetwork}
                safeAddress={safeAddress}
                resolvedSafeAddress={resolvedSafeAddress}
                safeAddressError={safeAddressError}
                isSavingSafeAddress={isSavingSafeAddress}
                isApproving={isApproving}
                step1Status={hasPurchasedPanic ? "done" : "ready"}
                step2Status={
                  isSavingSafeAddress
                    ? "pending"
                    : hasSavedSafeAddress
                      ? "done"
                      : "ready"
                }
                step3Status={
                  isApproving
                    ? "pending"
                    : hasApprovedVault
                      ? "done"
                      : "ready"
                }
                approvalTokens={approvalTokenLabels}
                onBuy={() => setHasPurchasedPanic(true)}
                onSafeAddressChange={setSafeAddress}
                onSaveSafeAddress={handleSaveSafeAddress}
                onApprove={handleApproveAll}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
