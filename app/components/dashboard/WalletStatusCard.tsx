import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type WalletStatusCardProps = {
  isConnected: boolean;
  networkLabel: string;
  address?: string;
  ethBalance: string;
  panicBalance: string;
  approvalsCount: number;
};

export function WalletStatusCard({
  isConnected,
  networkLabel,
  address,
  ethBalance,
  panicBalance,
  approvalsCount,
}: WalletStatusCardProps) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>Wallet Status</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{networkLabel}</Badge>
          {isConnected ? (
            <Badge variant="outline">Connected</Badge>
          ) : (
            <Badge variant="outline">Not connected</Badge>
          )}
        </div>
        {isConnected && address && (
          <div className="text-xs text-muted-foreground">{address}</div>
        )}
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">ETH Balance</span>
          <span className="font-medium">{ethBalance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">PANIC Balance</span>
          <span className="font-medium">{panicBalance}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Active Approvals</span>
          <span className="font-medium">{approvalsCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
