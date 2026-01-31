import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function WalletStatusCard() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle>Wallet Status</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Sepolia</Badge>
          <Badge variant="outline">Not connected</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 pt-0 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">ETH Balance</span>
          <span className="font-medium">0.00</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">PANIC Balance</span>
          <span className="font-medium">1,000</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Active Approvals</span>
          <span className="font-medium">8</span>
        </div>
      </CardContent>
    </Card>
  );
}
