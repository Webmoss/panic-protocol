import { useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ShieldCheck } from "lucide-react";
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
  spenderAddress?: string;
  isPanicVaultApproval?: boolean;
  updated: string;
  tokenAddress?: string;
};

export type ApprovalHistoryItem = {
  id: string;
  label: string;
  hash: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: number;
};

type ApprovalDashboardProps = {
  isOnTargetNetwork: boolean;
  isConnected: boolean;
  approvals: ApprovalItem[];
  onRevoke?: (approval: ApprovalItem) => Promise<string | undefined>;
  onApproveAll?: () => void;
  onSwitchNetwork?: () => void;
  onRefresh?: () => void;
  history?: ApprovalHistoryItem[];
  explorerBaseUrl?: string;
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
  isConnected,
  approvals,
  onRevoke,
  onApproveAll,
  onSwitchNetwork,
  onRefresh,
  history = [],
  explorerBaseUrl = "https://sepolia.etherscan.io",
}: ApprovalDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [rowStatus, setRowStatus] = useState<
    Record<string, "idle" | "pending" | "done" | "error">
  >({});
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

  const handleRevokeRow = async (approval: ApprovalItem) => {
    if (!onRevoke) return;
    const key = getApprovalKey(approval);
    setRowStatus((prev) => ({ ...prev, [key]: "pending" }));
    try {
      const hash = await onRevoke(approval);
      if (hash) {
        setRowStatus((prev) => ({ ...prev, [key]: "done" }));
        window.setTimeout(() => {
          setRowStatus((prev) => ({ ...prev, [key]: "idle" }));
        }, 1500);
      } else {
        setRowStatus((prev) => ({ ...prev, [key]: "idle" }));
      }
    } catch (error) {
      console.error(error);
      setRowStatus((prev) => ({ ...prev, [key]: "error" }));
    }
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Approvals</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isConnected && (
              <Button
                variant="outline"
                disabled={!isOnTargetNetwork || !onApproveAll}
                onClick={onApproveAll}
              >
                Approve Panic Vault
              </Button>
            )}
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh}>
                Refresh
              </Button>
            )}
            {isConnected && (
              <Button
                variant="outline"
                disabled={!onSwitchNetwork}
                onClick={onSwitchNetwork}
              >
                Switch Network
              </Button>
            )}
          </div>
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
        <Tabs defaultValue="approvals" className="space-y-3">
          <TabsList>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="approvals" className="space-y-3">
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
            {!isConnected ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Wallet not connected
                </span>
                <span>Connect your wallet to view approvals.</span>
              </div>
            ) : !isOnTargetNetwork ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Wrong network selected
                </span>
                <span>Switch to the target network to view your approvals.</span>
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
                    <TableHead>Approval Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map((approval) => {
                    const key = getApprovalKey(approval);
                    const status = rowStatus[key] ?? "idle";
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
                        <TableCell>
                          {approval.isPanicVaultApproval ? (
                            <Badge className="bg-red-600 text-white">
                              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                              PanicVault
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Other</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="min-w-[86px]"
                            disabled={
                              !isOnTargetNetwork || !onRevoke || status === "pending"
                            }
                            onClick={() => handleRevokeRow(approval)}
                          >
                            {status === "done"
                              ? "Revoked"
                              : status === "error"
                                ? "Retry"
                                : "Revoke"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="rounded-xl border bg-muted/40">
            {history.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  No recent activity
                </span>
                <span>Revoke or panic actions will appear here.</span>
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell className="capitalize">
                        {item.status}
                      </TableCell>
                      <TableCell>
                        <a
                          className="text-sm text-foreground underline underline-offset-4"
                          href={`${explorerBaseUrl}/tx/${item.hash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.hash.slice(0, 6)}...{item.hash.slice(-4)}
                        </a>
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

const getApprovalKey = (approval: ApprovalItem) =>
  `${approval.asset}-${approval.spender}-${approval.approvedAmount}`;
