import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

type SetupStatus = "ready" | "pending" | "done" | "error";

type SetupCardProps = {
  isConnected: boolean;
  isOnTargetNetwork: boolean;
  safeAddress: string;
  resolvedSafeAddress?: string;
  safeAddressError?: string;
  isSavingSafeAddress?: boolean;
  isApproving?: boolean;
  step1Status: SetupStatus;
  step2Status: SetupStatus;
  step3Status: SetupStatus;
  approvalTokens?: string[];
  onBuy: () => void;
  onSafeAddressChange: (value: string) => void;
  onSaveSafeAddress: () => void;
  onApprove: () => void;
};

export function SetupCard({
  isConnected,
  isOnTargetNetwork,
  safeAddress,
  resolvedSafeAddress,
  safeAddressError,
  isSavingSafeAddress = false,
  isApproving = false,
  step1Status,
  step2Status,
  step3Status,
  approvalTokens = [],
  onBuy,
  onSafeAddressChange,
  onSaveSafeAddress,
  onApprove,
}: SetupCardProps) {

  const statusClasses: Record<SetupStatus, string> = {
    ready: "bg-white/10 text-white",
    pending: "bg-amber-500/20 text-amber-200",
    done: "bg-emerald-500/20 text-emerald-200",
    error: "bg-red-500/20 text-red-200",
  };

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader className="pb-0">
        <CardTitle>One-Time Setup</CardTitle>
        <p className="text-sm text-white/80">
          Complete these steps to enable PANIC Protocol
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/60">Step 1</p>
              <p className="font-medium">Buy PANIC Tokens</p>
            </div>
            <Badge className={statusClasses[step1Status]}>
              {step1Status.toUpperCase()}
            </Badge>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-white bg-white text-black hover:bg-white/90"
                disabled={
                  !isConnected ||
                  !isOnTargetNetwork ||
                  step1Status === "done"
                }
              >
                {step1Status === "done" ? "Purchased" : "Buy Now"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Buy PANIC (Stub)</DialogTitle>
                <DialogDescription>
                  This is a placeholder for the Uniswap swap flow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    From
                  </label>
                  <Input placeholder="ETH amount" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    To (estimated)
                  </label>
                  <Input placeholder="PANIC amount" />
                </div>
                <Button variant="default" onClick={onBuy}>
                  Mark as Purchased
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Swap execution will be wired once the Uniswap integration is
                ready.
              </p>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/60">Step 2</p>
              <p className="font-medium">Set Safe Address</p>
            </div>
            <Badge className={statusClasses[step2Status]}>
              {step2Status.toUpperCase()}
            </Badge>
          </div>
          <div className="mt-3 space-y-2">
            <Input
              placeholder="0x... or ENS name"
              value={safeAddress}
              onChange={(event) => onSafeAddressChange(event.target.value)}
              className="border-neutral-700 bg-neutral-950/80 text-white placeholder:text-white/40"
            />
            {(safeAddressError || resolvedSafeAddress) && (
              <div className="text-xs text-white/60">
                {safeAddressError ? (
                  <span className="text-red-200">{safeAddressError}</span>
                ) : (
                  <span>Resolved: {resolvedSafeAddress}</span>
                )}
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
              disabled={
                !isConnected ||
                !isOnTargetNetwork ||
                step1Status !== "done" ||
                step2Status === "done" ||
                !safeAddress ||
                isSavingSafeAddress
              }
              onClick={onSaveSafeAddress}
            >
              {step2Status === "done"
                ? "Saved"
                : isSavingSafeAddress
                  ? "Saving..."
                  : "Save Safe Address"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between gap-3 pb-1">
              <div>
                <p className="text-xs text-white/60">Step 3</p>
                <p className="font-medium">Grant PanicVault Approval</p>
              </div>
              <Badge className={statusClasses[step3Status]}>
                {step3Status.toUpperCase()}
              </Badge>
            </div>
            <div className="mb-2 text-xs text-white/60">
              Approves unlimited spending for your tokens
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
              disabled={
                !isConnected ||
                !isOnTargetNetwork ||
                step2Status !== "done" ||
                step3Status === "done" ||
                isApproving
              }
              onClick={onApprove}
            >
              {step3Status === "done"
                ? "Approved"
                : isApproving
                  ? "Approving..."
                  : "Approve"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
