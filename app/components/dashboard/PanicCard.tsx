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
};

export function PanicCard({
  panicStatus,
  onConfirm,
  mode,
  disabled,
  txHash,
  explorerBaseUrl,
}: PanicCardProps) {
  const isRelay = mode === "relay";

  return (
    <Card className="border-red-600 bg-red-600 text-white">
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
        <div className="rounded-lg border border-neutral-800 bg-white p-2">
          <p className="font-medium text-black">Actions</p>
          <ul className="mt-2 list-disc pl-5 text-black/80">
            <li>Sweep ERC-20 tokens</li>
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
        <Button
          className="w-full bg-white text-black hover:bg-white/90"
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
