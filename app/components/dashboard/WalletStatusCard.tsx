import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type WalletStatusCardProps = {
  isConnected: boolean;
  networkLabel: string;
  address?: string;
  ethBalance: string;
  usdcBalance: string;
  panicBalance: string;
  approvalsCount: number;
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
  panicBalance,
  approvalsCount,
}: WalletStatusCardProps) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>Wallet Status</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-black text-white">{networkLabel}</Badge>
          {isConnected ? (
            <Badge className="border-emerald-500 bg-emerald-100 text-emerald-700">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline">Not connected</Badge>
          )}
        </div>
        {isConnected && address && (
          <div className="text-xs text-muted-foreground">
            {formatAddress(address)}
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">ETH Balance</span>
          <span className="font-medium">{isConnected ? ethBalance : "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">USDC Balance</span>
          <span className="font-medium">{isConnected ? usdcBalance : "—"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">PANIC Balance</span>
          <span className="font-medium">
            {isConnected ? panicBalance : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Active Approvals</span>
          <span className="font-medium">
            {isConnected ? approvalsCount : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
