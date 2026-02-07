import type { Address } from "viem";
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
  approvals: ApprovalItem[];
  onRevoke: (approval: { tokenAddress?: string; asset?: string }) => Promise<string | undefined>;
  onRefresh: () => void;
  history: ApprovalHistoryItem[];
  explorerBaseUrl: string;
  panicStatus: "idle" | "signing" | "executing" | "done" | "error";
  panicTxHash?: string;
  onPanic: () => Promise<void>;
  hasEthBalance: boolean;
  networkLabel: string;
  address?: Address;
  ethBalance: string;
  usdcBalance: string;
  usdcLabel: string;
  panicBalance: string;
  approvalsCount: number;
  tokenBalances: { label: string; balance: string }[];
  isSetupComplete: boolean;
  needsPanicVaultApproval: boolean;
  showSetupCard: boolean;
  safeAddress: string;
  resolvedSafeAddress?: Address;
  ensName?: string;
  ensRecords?: { key: string; label: string; value: string }[];
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
  approvals,
  onRevoke,
  onRefresh,
  history,
  explorerBaseUrl,
  panicStatus,
  panicTxHash,
  onPanic,
  hasEthBalance,
  networkLabel,
  address,
  ethBalance,
  usdcBalance,
  usdcLabel,
  panicBalance,
  approvalsCount,
  tokenBalances,
  isSetupComplete,
  needsPanicVaultApproval,
  showSetupCard,
  safeAddress,
  resolvedSafeAddress,
  ensName,
  ensRecords,
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
          {ensRecords && ensRecords.length > 0 && (
            <div className="rounded-xl border border-red-600/30 bg-black px-4 py-3 text-white">
              <div className="text-xs font-semibold uppercase tracking-wide text-red-200">
                ENS Emergency Records
              </div>
              <div className="mt-2 space-y-1 text-sm text-white/80">
                {ensRecords
                  .filter(
                    (record) =>
                      record.key === "com.panic.safe" ||
                      record.key === "com.panic.guardian"
                  )
                  .map((record) => (
                    <div key={record.key} className="flex items-center justify-between gap-3">
                      <span className="text-white/60">{record.label}</span>
                      <span className="truncate text-white">{record.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {isSetupComplete && (
            <PanicCard
              panicStatus={panicStatus}
              onConfirm={onPanic}
              mode={hasEthBalance ? "direct" : "relay"}
              txHash={panicTxHash}
              explorerBaseUrl={explorerBaseUrl}
              disabled={!isOnTargetNetwork || !isConnected}
              needsPanicVaultApproval={needsPanicVaultApproval}
              onApprovePanicVault={onApprove}
              isOnTargetNetwork={isOnTargetNetwork}
              isApproving={isApproving}
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
              ensName={ensName}
              ensRecords={ensRecords}
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
