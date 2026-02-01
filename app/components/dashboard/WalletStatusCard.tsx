import { useEffect, useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type WalletStatusCardProps = {
  isConnected: boolean;
  networkLabel: string;
  address?: string;
  ethBalance: string;
  usdcBalance: string;
  usdcLabel?: string;
  panicBalance: string;
  approvalsCount: number;
  tokenBalances?: Array<{
    label: string;
    balance: string;
  }>;
};

const formatAddress = (value?: string) => {
  if (!value) return "";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export function WalletStatusCard({
  isConnected,
  networkLabel,
  address,
  ethBalance,
  usdcBalance,
  usdcLabel = "USDC",
  panicBalance,
  tokenBalances = [],
}: WalletStatusCardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const dedupedTokenBalances = useMemo(() => {
    const seen = new Set<string>();
    return tokenBalances.filter((token) => {
      const key = token.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [tokenBalances]);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 1500);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const handleCopy = async () => {
    if (!address) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(address);
      setCopyStatus("copied");
    } catch (error) {
      console.error(error);
      setCopyStatus("error");
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>Wallet Status</CardTitle>
        <div className="flex w-full flex-wrap items-center justify-between gap-2 text-sm">
          {isConnected ? (
            <Badge className="border-emerald-500 bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="px-3 py-1 text-sm">
              Not connected
            </Badge>
          )}
          <Badge className="bg-black px-2 py-1 text-sm text-white">
            {networkLabel}
          </Badge>
        </div>
        {isConnected && address && (
          <div className="flex items-center justify-between gap-2">
            <div
              className="text-sm font-medium text-muted-foreground"
              title={address}
            >
              {formatAddress(address)}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copy wallet address"
              title={
                copyStatus === "copied"
                  ? "Copied"
                  : copyStatus === "error"
                    ? "Copy failed"
                    : "Copy wallet address"
              }
              onClick={handleCopy}
            >
              <Copy />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-black">ETH</span>
          <span className="font-medium">{isConnected ? ethBalance : "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black">PANIC</span>
          <span className="font-medium">
            {isConnected ? panicBalance : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-black">{usdcLabel}</span>
          <span className="font-medium">{isConnected ? usdcBalance : "—"}</span>
        </div>
        {dedupedTokenBalances.map((token) => (
          <div key={token.label} className="flex items-center justify-between">
            <span className="text-black">{token.label}</span>
            <span className="font-medium">
              {isConnected ? token.balance : "—"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
