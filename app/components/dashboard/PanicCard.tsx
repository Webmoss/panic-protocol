import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type PanicStatus = "idle" | "signing" | "executing" | "done" | "error";

type PanicCardProps = {
  panicStatus: PanicStatus;
  onConfirm: () => void;
  mode: "direct" | "relay";
  disabled?: boolean;
  txHash?: string;
  explorerBaseUrl: string;
  /** When true, show Approve PanicVault above Confirm so tokens can be included in sweep */
  needsPanicVaultApproval?: boolean;
  onApprovePanicVault?: () => void;
  isOnTargetNetwork?: boolean;
  isApproving?: boolean;
};

export function PanicCard({
  panicStatus,
  onConfirm,
  mode,
  disabled,
  txHash,
  explorerBaseUrl,
  needsPanicVaultApproval = false,
  onApprovePanicVault,
  isOnTargetNetwork = true,
  isApproving = false,
}: PanicCardProps) {
  const isRelay = mode === "relay";
  const showApprovalBlock = needsPanicVaultApproval && onApprovePanicVault;

  return (
    <Card className="border-neutral-900 bg-black text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">PANIC Mode</CardTitle>
        <Badge className="bg-white text-black">
          {isRelay ? "Relay Execution" : "Direct Execution"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-sm">
        {panicStatus !== "idle" && (
          <Alert className="border-white/40 bg-white/90 text-black">
            <AlertTitle>
              {panicStatus === "signing" && "Awaiting signature"}
              {panicStatus === "executing" && "Executing rescue"}
              {panicStatus === "done" && "Rescue complete"}
              {panicStatus === "error" && "Rescue failed"}
            </AlertTitle>
            <AlertDescription>
              {panicStatus === "signing" &&
                (isRelay
                  ? "This signature is gasless."
                  : "Confirm the transaction in your wallet.")}
              {panicStatus === "executing" &&
                (isRelay
                  ? "Relay is paying gas on your behalf."
                  : "You are paying gas for this transaction.")}
              {panicStatus === "done" && "Assets have been swept to your safe address."}
              {panicStatus === "error" && "Please retry or check relay status."}
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-lg border border-neutral-300 bg-white p-2 text-black">
          <p className="font-medium">
            {showApprovalBlock ? "Next steps" : "Actions"}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-black/80">
            {showApprovalBlock ? (
              <>
                <li>Approve PanicVault for any tokens you want included in the sweep (use the button below).</li>
                <li>Confirm PANIC to sweep approved tokens to your safe address.</li>
              </>
            ) : (
              <>
                <li>Confirm PANIC to sweep your approved ERC-20 tokens to your safe address.</li>
                <li>Only tokens with balance and PanicVault approval will be moved.</li>
              </>
            )}
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Cost</span>
          <span className="font-medium">
            {isRelay ? "300 PANIC" : "Gas"}
          </span>
        </div>
        {txHash && (
          <div className="rounded-lg border border-white/30 bg-white/10 p-2 text-xs">
            <span className="text-white/80">Tx hash:</span>{" "}
            <a
              className="break-all text-white underline underline-offset-2"
              href={`${explorerBaseUrl}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {txHash}
            </a>
          </div>
        )}
        {showApprovalBlock && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
            <p className="text-xs font-medium text-amber-100">
              Some tokens are not yet approved for PanicVault. Approve them to include them in the rescue sweep.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full border-amber-400/60 bg-amber-500/20 text-white hover:bg-amber-500/30"
              disabled={!isOnTargetNetwork || isApproving}
              onClick={onApprovePanicVault}
            >
              {isApproving ? "Approving…" : "Approve PanicVault"}
            </Button>
          </div>
        )}
        <Button
          className="w-full bg-red-600 text-white hover:bg-red-500"
          disabled={disabled || panicStatus !== "idle"}
          onClick={onConfirm}
        >
          Confirm PANIC
        </Button>
        <p className="text-xs text-white">
          {isRelay
            ? "Gasless signature. Relay pays gas on your behalf."
            : "Direct execution. You pay gas from this wallet."}
        </p>
      </CardContent>
    </Card>
  );
}
