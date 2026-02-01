import { useMemo } from "react";
import { formatUnits, maxUint256, zeroAddress, type Address } from "viem";
import { useBalance, useReadContract, useReadContracts } from "wagmi";
import type { ApprovalItem } from "~/components/dashboard/ApprovalDashboard";
import { ERC20_ABI, USDC_DECIMALS, VAULT_ABI } from "~/lib/contracts";
import { formatAddress } from "~/lib/format";
import type { TokenConfig } from "~/lib/tokens";

type UseWalletDataParams = {
  address?: Address;
  isConnected: boolean;
  isOnTargetNetwork: boolean;
  usdcTokenAddress?: Address;
  panicTokenAddress?: Address;
  panicVaultAddress?: Address;
  tokenList: TokenConfig[];
  usdcLabel: string;
};

export const useWalletData = ({
  address,
  isConnected,
  isOnTargetNetwork,
  usdcTokenAddress,
  panicTokenAddress,
  panicVaultAddress,
  tokenList,
  usdcLabel,
}: UseWalletDataParams) => {
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
  }, [address, panicVaultAddress, tokenList]);

  const { data: ethBalanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: usdcRawBalance } = useReadContract({
    address: usdcTokenAddress ?? zeroAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!usdcTokenAddress && isOnTargetNetwork },
  });
  const { data: panicRawBalance } = useReadContract({
    address: panicTokenAddress ?? zeroAddress,
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
  const { data: nonceData } = useReadContract({
    address: panicVaultAddress ?? zeroAddress,
    abi: VAULT_ABI,
    functionName: "nonces",
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

  const approvals: ApprovalItem[] = useMemo(() => {
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
  const hasApprovedVault = tokenStats.some(({ allowance }) => allowance > 0n);

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

  return {
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
  };
};
