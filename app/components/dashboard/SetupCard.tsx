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
import { Separator } from "~/components/ui/separator";

type SetupStatus = "ready" | "pending" | "done" | "error";

type SetupCardProps = {
  isConnected: boolean;
  safeAddress: string;
  step1Status: SetupStatus;
  step2Status: SetupStatus;
  step3Status: SetupStatus;
  onBuy: () => void;
  onSafeAddressChange: (value: string) => void;
  onSaveSafeAddress: () => void;
  onApprove: () => void;
};

export function SetupCard({
  isConnected,
  safeAddress,
  step1Status,
  step2Status,
  step3Status,
  onBuy,
  onSafeAddressChange,
  onSaveSafeAddress,
  onApprove,
}: SetupCardProps) {

  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader className="pb-1">
        <CardTitle>One-Time Setup</CardTitle>
        <p className="text-sm text-white/70">
          Complete these steps to enable PANIC Mode.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge className="bg-white text-black">Status: setup required</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div>
            <p className="text-xs text-white/60">Step 1</p>
            <p className="font-medium">Buy PANIC Tokens</p>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>Status</span>
            <span className="uppercase">{step1Status}</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-white bg-white text-black hover:bg-white/90"
                disabled={!isConnected || step1Status === "done"}
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
          <p className="text-xs text-white/60">Step 2</p>
          <p className="font-medium">Set Safe Address</p>
          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>Status</span>
            <span className="uppercase">{step2Status}</span>
          </div>
          <div className="mt-3 space-y-2">
            <Input
              placeholder="0x... or ENS name"
              value={safeAddress}
              onChange={(event) => onSafeAddressChange(event.target.value)}
              className="border-neutral-700 bg-neutral-950/80 text-white placeholder:text-white/40"
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
              disabled={!isConnected || step2Status === "done" || !safeAddress}
              onClick={onSaveSafeAddress}
            >
              {step2Status === "done" ? "Saved" : "Save Safe Address"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div className="flex flex-col items-center justify-between">
            <div className="pb-1">
              <p className="text-xs text-white/60">Step 3</p>
              <p className="font-medium">Grant PanicVault Approval</p>
            </div>
            <div className="mb-2 flex w-full items-center justify-between text-xs text-white/60">
              <span>Status</span>
              <span className="uppercase">{step3Status}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
              disabled={!isConnected || step3Status === "done"}
              onClick={onApprove}
            >
              {step3Status === "done" ? "Approved" : "Approve"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
