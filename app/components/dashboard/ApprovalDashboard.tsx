import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Checkbox } from "~/components/ui/checkbox";

const approvals = [
  {
    asset: "ETHG",
    amount: "2,000,000 ETHG",
    type: "Token",
    approvedAmount: "No approvals",
    valueAtRisk: "$0",
    spender: "—",
    updated: "—",
  },
  {
    asset: "SUPERDOG",
    amount: "5 SUPERDOG",
    type: "Token",
    approvedAmount: "No approvals",
    valueAtRisk: "$0",
    spender: "—",
    updated: "—",
  },
  {
    asset: "UniLife",
    amount: "5 UniLife",
    type: "Token",
    approvedAmount: "No approvals",
    valueAtRisk: "$0",
    spender: "—",
    updated: "—",
  },
  {
    asset: "VIBESTR",
    amount: "11,351.727 VIBESTR",
    type: "Token",
    approvedAmount: "No approvals",
    valueAtRisk: "$0",
    spender: "—",
    updated: "—",
  },
];

const approvalsCount = approvals.length;
const totalValueAtRisk = "$0";

type ApprovalDashboardProps = {
  isOnSepolia: boolean;
};

export function ApprovalDashboard({ isOnSepolia }: ApprovalDashboardProps) {
  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Approvals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Inspect and revoke risky approvals to secure your wallet from risk.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!isOnSepolia}>
                Switch Network
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ethereum (Mainnet)</DropdownMenuItem>
              <DropdownMenuItem>Sepolia (Testnet)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Search accounts by address or ENS"
            disabled={!isOnSepolia}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">EOA</Badge>
            <Badge variant="outline">Connected</Badge>
            <span>0.002 ETH ($5.42)</span>
            <span>0x9569...ED85</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <Tabs defaultValue="approvals">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Badge variant="outline">Total Approvals: {approvalsCount}</Badge>
              <Badge variant="outline">
                Total Value at Risk: {totalValueAtRisk}
              </Badge>
            </div>
          </div>

          <TabsContent value="approvals" className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-[180px_1fr_220px]">
              <Select defaultValue="newest">
                <SelectTrigger disabled={!isOnSepolia}>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest to Oldest</SelectItem>
                  <SelectItem value="oldest">Oldest to Newest</SelectItem>
                  <SelectItem value="risk">Highest Risk</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search by approved spender address"
                disabled={!isOnSepolia}
              />
              <Select defaultValue="all">
                <SelectTrigger disabled={!isOnSepolia}>
                  <SelectValue placeholder="Filters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Showing everything</SelectItem>
                  <SelectItem value="tokens">Tokens only</SelectItem>
                  <SelectItem value="high-risk">High risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="outline" size="sm" disabled={!isOnSepolia}>
                Revoke Selected
              </Button>
              <span className="text-xs text-muted-foreground">
                Last updated: newest to oldest
              </span>
            </div>

            <div className="rounded-xl border bg-muted/40">
              {!isOnSepolia ? (
                <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Wrong network selected
                  </span>
                  <span>Switch to Sepolia to view approvals.</span>
                </div>
              ) : approvals.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    No approvals found
                  </span>
                  <span>
                    Connect a wallet or switch networks to view approvals.
                  </span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox disabled={!isOnSepolia} />
                      </TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Approved Amount</TableHead>
                      <TableHead>Value at Risk</TableHead>
                      <TableHead>Approved Spender</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvals.map((approval) => (
                      <TableRow key={approval.asset}>
                        <TableCell>
                        <Checkbox disabled={!isOnSepolia} />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{approval.asset}</div>
                          <div className="text-xs text-muted-foreground">
                            {approval.amount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{approval.type}</Badge>
                        </TableCell>
                        <TableCell>{approval.approvedAmount}</TableCell>
                        <TableCell>{approval.valueAtRisk}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {approval.spender}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {approval.updated}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isOnSepolia}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
