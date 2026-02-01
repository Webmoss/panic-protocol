import { useChainModal } from "@rainbow-me/rainbowkit";
import {
  formatUnits,
  isAddress,
  maxUint256,
  zeroAddress,
  type Address,
} from "viem";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useEnsAddress,
  useReadContract,
  useReadContracts,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ApprovalDashboard } from "~/components/dashboard/ApprovalDashboard";
import { Header } from "~/components/layout/Header";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";

export function Welcome() {
  const isProduction = import.meta.env.PROD;
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
  const USDC_DECIMALS = 6;
  const ERC20_ABI = [
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
  const VAULT_ABI = [
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
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
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
  const usdcTokenAddress = isProduction
    ? USDC_MAINNET_ADDRESS
    : USDC_SEPOLIA_ADDRESS;
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
  const tokenList = useMemo(() => {
    if (isProduction) {
      return usdcTokenAddress
        ? [
            {
              symbol: "USDC",
              address: usdcTokenAddress,
              decimals: 6,
              isStable: true,
            },
          ]
        : [];
    }
    return [
      TEST_USDC_SEPOLIA_ADDRESS
        ? {
            symbol: "tUSDC",
            address: TEST_USDC_SEPOLIA_ADDRESS,
            decimals: 6,
            isStable: true,
          }
        : null,
      TEST_MOSS_SEPOLIA_ADDRESS
        ? {
            symbol: "tMOSS",
            address: TEST_MOSS_SEPOLIA_ADDRESS,
            decimals: 18,
            isStable: false,
          }
        : null,
      TEST_GUARD_SEPOLIA_ADDRESS
        ? {
            symbol: "tGUARD",
            address: TEST_GUARD_SEPOLIA_ADDRESS,
            decimals: 18,
            isStable: false,
          }
        : null,
    ].filter((token): token is NonNullable<typeof token> => token !== null);
  }, [
    isProduction,
    usdcTokenAddress,
    TEST_USDC_SEPOLIA_ADDRESS,
    TEST_MOSS_SEPOLIA_ADDRESS,
    TEST_GUARD_SEPOLIA_ADDRESS,
  ]);
  const tokenReadContracts = useMemo(() => {
    if (!address || !panicVaultAddress || tokenList.length === 0) {
      return [];
    }
    return tokenList.flatMap((token) => [
      {
        address: token.address,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address],
      },
      {
        address: token.address,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: [address, panicVaultAddress],
      },
    ]);
  }, [address, panicVaultAddress, tokenList, ERC20_ABI]);
  const { data: ethBalanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: usdcRawBalance } = useReadContract({
    address:
      usdcTokenAddress ?? "0x0000000000000000000000000000000000000000",
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!usdcTokenAddress && isOnTargetNetwork },
  });
  const { data: panicRawBalance } = useReadContract({
    address:
      panicTokenAddress ?? "0x0000000000000000000000000000000000000000",
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!panicTokenAddress && isOnTargetNetwork },
  });
  const {
    data: tokenReadResults,
    refetch: refetchTokenReads,
  } = useReadContracts({
    contracts: tokenReadContracts,
    allowFailure: true,
    query: {
      enabled:
        !!address && !!panicVaultAddress && tokenList.length > 0 && isOnTargetNetwork,
    },
  });
  const {
    data: safeAddressOnChain,
    refetch: refetchSafeAddress,
  } = useReadContract({
    address: panicVaultAddress ?? zeroAddress,
    abi: VAULT_ABI,
    functionName: "safeAddresses",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!panicVaultAddress && isOnTargetNetwork },
  });
  const ethBalance = ethBalanceData
    ? Number(formatUnits(ethBalanceData.value, ethBalanceData.decimals)).toFixed(4)
    : "0.00";
  const hasEthBalance = ethBalanceData?.value ? ethBalanceData.value > 0n : false;
  const usdcBalance =
    typeof usdcRawBalance === "bigint"
      ? Number(formatUnits(usdcRawBalance, USDC_DECIMALS)).toFixed(2)
      : "0.00";
  const panicBalance =
    typeof panicRawBalance === "bigint"
      ? Number(formatUnits(panicRawBalance, 18)).toFixed(2)
      : "—";
  const [safeAddress, setSafeAddress] = useState("");
  const [safeAddressError, setSafeAddressError] = useState<string | undefined>(
    undefined
  );
  const [hasPurchasedPanic, setHasPurchasedPanic] = useState(false);
  const [isSavingSafeAddress, setIsSavingSafeAddress] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [panicStatus, setPanicStatus] = useState<
    "idle" | "signing" | "executing" | "done" | "error"
  >("idle");
  const previousAddressRef = useRef<string | undefined>(undefined);
  const formatAddress = (value: string) =>
    `${value.slice(0, 6)}...${value.slice(-4)}`;
  const tokenStats = useMemo(
    () =>
      tokenList.map((token, index) => {
        const balanceResult = tokenReadResults?.[index * 2]?.result;
        const allowanceResult = tokenReadResults?.[index * 2 + 1]?.result;
        return {
          token,
          balance: typeof balanceResult === "bigint" ? balanceResult : 0n,
          allowance: typeof allowanceResult === "bigint" ? allowanceResult : 0n,
        };
      }),
    [tokenList, tokenReadResults]
  );
  const approvals = useMemo(() => {
    if (!isConnected || !isOnTargetNetwork) return [];
    return tokenStats
      .filter(({ allowance }) => allowance > 0n)
      .map(({ token, balance, allowance }) => {
        const formattedBalance = Number(
          formatUnits(balance, token.decimals)
        ).toFixed(2);
        const isUnlimited = allowance === maxUint256;
        const formattedAllowance = isUnlimited
          ? "Unlimited"
          : Number(formatUnits(allowance, token.decimals)).toFixed(2);
        const valueAtRisk = token.isStable ? `$${formattedBalance}` : "$0";
        return {
          asset: token.symbol,
          amount: `${formattedBalance} ${token.symbol}`,
          type: "Token",
          approvedAmount: isUnlimited
            ? "Unlimited"
            : `${formattedAllowance} ${token.symbol}`,
          valueAtRisk,
          spender: panicVaultAddress ? formatAddress(panicVaultAddress) : "—",
          updated: "—",
          tokenAddress: token.address,
        };
      });
  }, [isConnected, isOnTargetNetwork, panicVaultAddress, tokenStats]);
  const approvalsCount = approvals.length;
  const hasSavedSafeAddress =
    typeof safeAddressOnChain === "string" && safeAddressOnChain !== zeroAddress;
  const hasApprovedVault = tokenStats.some(({ allowance }) => allowance > 0n);
  const hasOnchainPanicBalance =
    typeof panicRawBalance === "bigint" && panicRawBalance > 0n;
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

  const extraTokenBalances = useMemo(
    () =>
      tokenStats
        .filter((tokenStat) => tokenStat.token.symbol !== usdcLabel)
        .map(({ token, balance }) => ({
          label: token.symbol,
          balance: Number(formatUnits(balance, token.decimals)).toFixed(2),
        })),
    [tokenStats, usdcLabel]
  );
  const approvalTokenLabels = useMemo(
    () => tokenList.map((token) => token.symbol),
    [tokenList]
  );

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
      setPanicStatus("idle");
    }
  }, [address]);

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

  const handleRevoke = async (approval: { tokenAddress?: string }) => {
    if (!panicVaultAddress || !approval.tokenAddress) return;
    try {
      const hash = await writeContractAsync({
        address: approval.tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [panicVaultAddress, 0n],
      });
      await publicClient?.waitForTransactionReceipt({ hash });
      await refetchTokenReads();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePanicDirect = async () => {
    if (!panicVaultAddress || tokenList.length === 0) return;
    try {
      setPanicStatus("signing");
      const tokens = tokenList.map((token) => token.address);
      const spenders = tokens.map(() => zeroAddress);
      const hash = await writeContractAsync({
        address: panicVaultAddress,
        abi: VAULT_ABI,
        functionName: "panicDirect",
        args: [tokens, spenders],
      });
      setPanicStatus("executing");
      await publicClient?.waitForTransactionReceipt({ hash });
      await refetchTokenReads();
      setPanicStatus("done");
    } catch (error) {
      console.error(error);
      setPanicStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
        <Card className="border-neutral-900 bg-black text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-x-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Dashboard
              </h1>
              <p className="text-sm text-white/90">
                Review and revoke risky approvals, execute PANIC Protocol to secure your wallet, if needed.
              </p>
            </div>
            <div className="flex w-full flex-wrap justify-end gap-2 md:w-auto">
              {canExecute && (
                <Button
                  variant="destructive"
                  size="lg"
                  className="min-w-[160px]"
                  disabled={!isSetupComplete || !isOnTargetNetwork}
                  onClick={handlePanicDirect}
                >
                  PANIC
                </Button>
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
            approvals={approvals}
            onRevoke={handleRevoke}
            onSwitchNetwork={() => openChainModal?.()}
          />
          <div className="flex flex-col gap-6">
          {isSetupComplete && (
              <PanicCard
                panicStatus={panicStatus}
                onConfirm={handlePanicDirect}
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
            {!isSetupComplete && (
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
