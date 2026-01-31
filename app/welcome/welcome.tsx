import { ConnectButton, useChainModal } from "@rainbow-me/rainbowkit";
import { formatUnits, type Address } from "viem";
import { useMemo, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useReadContract,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ApprovalDashboard } from "~/components/dashboard/ApprovalDashboard";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";

export function Welcome() {
  const USDC_SEPOLIA_ADDRESS = import.meta.env
    .VITE_USDC_SEPOLIA_ADDRESS as Address | undefined;
  const USDC_MAINNET_ADDRESS = import.meta.env
    .VITE_USDC_MAINNET_ADDRESS as Address | undefined;
  const PANIC_SEPOLIA_ADDRESS = import.meta.env
    .VITE_PANIC_SEPOLIA_ADDRESS as Address | undefined;
  const PANIC_MAINNET_ADDRESS = import.meta.env
    .VITE_PANIC_MAINNET_ADDRESS as Address | undefined;
  const USDC_DECIMALS = 6;
  const ERC20_BALANCE_ABI = [
    {
      name: "balanceOf",
      type: "function",
      stateMutability: "view",
      inputs: [{ name: "owner", type: "address" }],
      outputs: [{ name: "balance", type: "uint256" }],
    },
  ] as const;
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const chains = useChains();
  const { openChainModal } = useChainModal();
  const isOnSepolia = isConnected && chainId === sepolia.id;
  const isOnMainnet = isConnected && chainId === mainnet.id;
  const activeChain = chains.find((chain) => chain.id === chainId);
  const networkLabel = isConnected
    ? activeChain?.name ?? "Unknown network"
    : "No network";
  const usdcTokenAddress = isOnSepolia
    ? USDC_SEPOLIA_ADDRESS
    : isOnMainnet
      ? USDC_MAINNET_ADDRESS
      : undefined;
  const panicTokenAddress = isOnSepolia
    ? PANIC_SEPOLIA_ADDRESS
    : isOnMainnet
      ? PANIC_MAINNET_ADDRESS
      : undefined;
  const { data: ethBalanceData } = useBalance({
    address,
    query: { enabled: !!address },
  });
  const { data: usdcRawBalance } = useReadContract({
    address:
      usdcTokenAddress ?? "0x0000000000000000000000000000000000000000",
    abi: ERC20_BALANCE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!usdcTokenAddress },
  });
  const { data: panicRawBalance } = useReadContract({
    address:
      panicTokenAddress ?? "0x0000000000000000000000000000000000000000",
    abi: ERC20_BALANCE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!panicTokenAddress },
  });
  const ethBalance = ethBalanceData
    ? Number(formatUnits(ethBalanceData.value, ethBalanceData.decimals)).toFixed(4)
    : "0.00";
  const usdcBalance =
    typeof usdcRawBalance === "bigint"
      ? Number(formatUnits(usdcRawBalance, USDC_DECIMALS)).toFixed(2)
      : "0.00";
  const panicBalance =
    typeof panicRawBalance === "bigint"
      ? Number(formatUnits(panicRawBalance, 18)).toFixed(2)
      : "—";
  const [safeAddress, setSafeAddress] = useState("");
  const [hasPurchasedPanic, setHasPurchasedPanic] = useState(false);
  const [hasApprovedVault, setHasApprovedVault] = useState(false);
  const approvals = useMemo(
    () =>
      isConnected && isOnSepolia
        ? [
            {
              asset: "USDC",
              amount: "250.00 USDC",
              type: "Token",
              approvedAmount: "0",
              valueAtRisk: "$0",
              spender: "—",
              updated: "—",
            },
          ]
        : [],
    [isConnected, isOnSepolia]
  );
  const approvalsCount = approvals.length;
  const isSetupComplete = hasPurchasedPanic && hasApprovedVault && !!safeAddress;
  const showWrongNetwork = isConnected && !isOnSepolia;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-center px-4 py-4">
        <div className="flex flex-col">
          <span className="pt-4 text-2xl font-black uppercase tracking-tight">
            🚨 Panic Protocol
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
        <Card className="border-neutral-900 bg-black text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Approval Dashboard
              </h1>
              <p className="text-sm text-white/70">
                Review approvals, revoke risk, and execute PANIC Protocol if needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  mounted,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;
                  const label = !connected
                    ? "Connect Wallet"
                    : chain?.unsupported
                      ? "Wrong network"
                      : account.displayName;
                  const handleClick = !connected
                    ? openConnectModal
                    : chain?.unsupported
                      ? openChainModal
                      : openAccountModal;

                  return (
                    <Button
                      variant="outline"
                      size="lg"
                      className="min-w-[160px] border-white bg-white text-black hover:bg-white/90"
                      onClick={handleClick}
                    >
                      {label}
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
              <Button
                variant="destructive"
                size="lg"
                className="min-w-[160px]"
                disabled={!isSetupComplete || !isOnSepolia || !isConnected}
              >
                PANIC
              </Button>
            </div>
          </CardContent>
        </Card>

        {showWrongNetwork && (
          <Alert variant="destructive">
            <AlertTitle>Wrong network</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              <span>
                Switch to Sepolia to view approvals and execute PANIC actions.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openChainModal?.()}
              >
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ApprovalDashboard isOnSepolia={isOnSepolia} approvals={approvals} />
          <div className="flex flex-col gap-6">
            <WalletStatusCard
              isConnected={isConnected}
              networkLabel={networkLabel}
              address={address}
              ethBalance={ethBalance}
              usdcBalance={usdcBalance}
              panicBalance={panicBalance}
              approvalsCount={approvalsCount}
            />
            {!isSetupComplete && (
              <SetupCard
                isConnected={isConnected}
                safeAddress={safeAddress}
                step1Status={hasPurchasedPanic ? "done" : "ready"}
                step2Status={safeAddress ? "done" : "ready"}
                step3Status={hasApprovedVault ? "done" : "ready"}
                onBuy={() => setHasPurchasedPanic(true)}
                onSafeAddressChange={setSafeAddress}
                onSaveSafeAddress={() => setSafeAddress((value) => value)}
                onApprove={() => setHasApprovedVault(true)}
              />
            )}
            {isSetupComplete && <PanicCard />}
          </div>
        </div>
      </main>
    </div>
  );
}
