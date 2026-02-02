import type { Address } from "viem";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ApprovalDashboard, type ApprovalHistoryItem, type ApprovalItem } from "~/components/dashboard/ApprovalDashboard";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";

type DashboardViewProps = {
  isConnected: boolean;
  isOnTargetNetwork: boolean;
  targetNetworkLabel: string;
  openChainModal?: () => void;
  canExecute: boolean;
  isSetupComplete: boolean;
  approvals: ApprovalItem[];
  onRevoke: (approval: { tokenAddress?: string; asset?: string }) => Promise<string | undefined>;
  onRefresh: () => void;
  history: ApprovalHistoryItem[];
  explorerBaseUrl: string;
  panicStatus: "idle" | "signing" | "executing" | "done" | "error";
  panicTxHash?: string;
  onPanic: () => Promise<void>;
  onPanicDirect: () => Promise<void>;
  hasEthBalance: boolean;
  networkLabel: string;
  address?: Address;
  ethBalance: string;
  usdcBalance: string;
  usdcLabel: string;
  panicBalance: string;
  approvalsCount: number;
  tokenBalances: { label: string; balance: string }[];
  showSetupCard: boolean;
  safeAddress: string;
  resolvedSafeAddress?: Address;
  safeAddressError?: string;
  isSavingSafeAddress: boolean;
  isApproving: boolean;
  step1Status: "ready" | "pending" | "done";
  step2Status: "ready" | "pending" | "done";
  step3Status: "ready" | "pending" | "done";
  approvalTokens: string[];
  onBuy: () => void;
  onSafeAddressChange: (value: string) => void;
  onSaveSafeAddress: () => void;
  onApprove: () => void;
};

export function DashboardView({
  isConnected,
  isOnTargetNetwork,
  targetNetworkLabel,
  openChainModal,
  canExecute,
  isSetupComplete,
  approvals,
  onRevoke,
  onRefresh,
  history,
  explorerBaseUrl,
  panicStatus,
  panicTxHash,
  onPanic,
  onPanicDirect,
  hasEthBalance,
  networkLabel,
  address,
  ethBalance,
  usdcBalance,
  usdcLabel,
  panicBalance,
  approvalsCount,
  tokenBalances,
  showSetupCard,
  safeAddress,
  resolvedSafeAddress,
  safeAddressError,
  isSavingSafeAddress,
  isApproving,
  step1Status,
  step2Status,
  step3Status,
  approvalTokens,
  onBuy,
  onSafeAddressChange,
  onSaveSafeAddress,
  onApprove,
}: DashboardViewProps) {
  return (
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
                  onClick={onPanicDirect}
                >
                  SWEEP
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="min-w-[160px]"
                  disabled={!isSetupComplete || !isOnTargetNetwork}
                  onClick={onPanic}
                >
                  PANIC
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isConnected && !isOnTargetNetwork && (
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
          onRevoke={onRevoke}
          onSwitchNetwork={() => openChainModal?.()}
          onRefresh={onRefresh}
          history={history}
          explorerBaseUrl={explorerBaseUrl}
        />
        <div className="flex flex-col gap-6">
          {isSetupComplete && (
            <PanicCard
              panicStatus={panicStatus}
              onConfirm={onPanic}
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
            tokenBalances={tokenBalances}
          />
          {showSetupCard && (
            <SetupCard
              isConnected={isConnected}
              isOnTargetNetwork={isOnTargetNetwork}
              safeAddress={safeAddress}
              resolvedSafeAddress={resolvedSafeAddress}
              safeAddressError={safeAddressError}
              isSavingSafeAddress={isSavingSafeAddress}
              isApproving={isApproving}
              step1Status={step1Status}
              step2Status={step2Status}
              step3Status={step3Status}
              approvalTokens={approvalTokens}
              onBuy={onBuy}
              onSafeAddressChange={onSafeAddressChange}
              onSaveSafeAddress={onSaveSafeAddress}
              onApprove={onApprove}
            />
          )}
        </div>
      </div>
    </main>
  );
}
