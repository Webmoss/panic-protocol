import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ApprovalDashboard } from "~/components/dashboard/ApprovalDashboard";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";

export function Welcome() {
  const isSetupComplete = true;
  const isOnSepolia = true;
  const isWalletConnected = false;
  const walletAddress = "0x9569...ED85";
  const ethBalance = "0.00";
  const panicBalance = "1,000";
  const approvalsCount = 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-center px-4 py-4">
        <div className="flex flex-col">
          <span className="pt-4 text-2xl font-black uppercase tracking-tight">
            🚨 Panic Protocol
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
        <Card className="border-neutral-900 bg-black text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Approval Dashboard
              </h1>
              <p className="text-sm text-white/70">
                Review approvals, revoke risk, and execute PANIC Protocol if needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[160px] border-white bg-white text-black hover:bg-white/90"
              >
                Connect Wallet
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="min-w-[160px]"
                disabled={!isSetupComplete || !isOnSepolia}
              >
                PANIC
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isOnSepolia && (
          <Alert variant="destructive">
            <AlertTitle>Wrong network</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center gap-3">
              <span>
                Switch to Sepolia to view approvals and execute PANIC actions.
              </span>
              <Button variant="outline" size="sm">
                Switch Network
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ApprovalDashboard isOnSepolia={isOnSepolia} />
          <div className="flex flex-col gap-6">
            <WalletStatusCard
              isConnected={isWalletConnected}
              networkLabel={isOnSepolia ? "Sepolia" : "Ethereum"}
              address={walletAddress}
              ethBalance={ethBalance}
              panicBalance={panicBalance}
              approvalsCount={approvalsCount}
            />
            {!isSetupComplete && <SetupCard />}
            {isSetupComplete && <PanicCard />}
          </div>
        </div>
      </main>
    </div>
  );
}
