import { useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";

export type ApprovalItem = {
  asset: string;
  amount: string;
  type: string;
  approvedAmount: string;
  valueAtRisk: string;
  spender: string;
  updated: string;
  tokenAddress?: string;
};

type ApprovalDashboardProps = {
  isOnTargetNetwork: boolean;
  approvals: ApprovalItem[];
  onRevoke?: (approval: ApprovalItem) => void;
  onSwitchNetwork?: () => void;
};

const sumValueAtRisk = (items: ApprovalItem[]) => {
  const total = items.reduce((acc, item) => {
    const numeric = Number(item.valueAtRisk.replace(/[$,]/g, ""));
    return acc + (Number.isFinite(numeric) ? numeric : 0);
  }, 0);
  return `$${total.toFixed(0)}`;
};

export function ApprovalDashboard({
  isOnTargetNetwork,
  approvals,
  onRevoke,
  onSwitchNetwork,
}: ApprovalDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const approvalsCount = approvals.length;
  const filteredApprovals = useMemo(() => {
    if (!searchQuery.trim()) return approvals;
    const query = searchQuery.trim().toLowerCase();
    return approvals.filter((approval) => {
      return (
        approval.asset.toLowerCase().includes(query) ||
        approval.spender.toLowerCase().includes(query)
      );
    });
  }, [approvals, searchQuery]);
  const totalValueAtRisk = sumValueAtRisk(filteredApprovals);
  const selectedCount = selectedKeys.size;
  const allSelected =
    filteredApprovals.length > 0 &&
    filteredApprovals.every((approval) =>
      selectedKeys.has(getApprovalKey(approval))
    );

  const handleToggleAll = (checked: boolean) => {
    if (!checked) {
      setSelectedKeys(new Set());
      return;
    }
    const next = new Set<string>();
    filteredApprovals.forEach((approval) => {
      next.add(getApprovalKey(approval));
    });
    setSelectedKeys(next);
  };

  const handleToggleOne = (key: string, checked: boolean) => {
    const next = new Set(selectedKeys);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    setSelectedKeys(next);
  };

  const handleRevokeSelected = () => {
    if (!onRevoke) return;
    filteredApprovals.forEach((approval) => {
      if (selectedKeys.has(getApprovalKey(approval))) {
        onRevoke(approval);
      }
    });
    setSelectedKeys(new Set());
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-xl">Approvals</CardTitle>
            <p className="text-sm text-muted-foreground">
              Inspect and revoke risky approvals to secure your wallet from risk.
            </p>
          </div>
          <Button
            variant="outline"
            disabled={!onSwitchNetwork}
            onClick={onSwitchNetwork}
          >
            Switch Network
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Search accounts by address or ENS"
            disabled={!isOnTargetNetwork}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={
                !isOnTargetNetwork || selectedCount === 0 || !onRevoke
              }
              onClick={handleRevokeSelected}
            >
              Revoke Selected{selectedCount > 0 ? ` (${selectedCount})` : ""}
            </Button>
            <div className="flex gap-2">
              <Badge className="bg-red-600 text-white">
                Total Approvals: {filteredApprovals.length}
              </Badge>
              <Badge className="bg-black text-white">
                Total at Risk: {totalValueAtRisk}
              </Badge>
            </div>
          </div>

          <div className="w-full rounded-xl border bg-muted/40">
            {!isOnTargetNetwork ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Wrong network selected
                </span>
                <span>Switch to the target network to view your wallets approvals.</span>
              </div>
            ) : filteredApprovals.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  No approvals found
                </span>
                <span>
                  Connect a wallet or switch networks to view approvals.
                </span>
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        disabled={!isOnTargetNetwork}
                        checked={allSelected}
                        onCheckedChange={(checked) =>
                          handleToggleAll(checked === true)
                        }
                      />
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
                  {filteredApprovals.map((approval) => {
                    const key = getApprovalKey(approval);
                    return (
                      <TableRow key={key}>
                        <TableCell>
                          <Checkbox
                            disabled={!isOnTargetNetwork}
                            checked={selectedKeys.has(key)}
                            onCheckedChange={(checked) =>
                              handleToggleOne(key, checked === true)
                            }
                          />
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
                            disabled={!isOnTargetNetwork || !onRevoke}
                            onClick={() => onRevoke?.(approval)}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const getApprovalKey = (approval: ApprovalItem) =>
  `${approval.asset}-${approval.spender}-${approval.approvedAmount}`;
