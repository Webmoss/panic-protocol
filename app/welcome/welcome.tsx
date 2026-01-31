import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { ApprovalDashboard } from "~/components/dashboard/ApprovalDashboard";
import { PanicCard } from "~/components/dashboard/PanicCard";
import { SetupCard } from "~/components/dashboard/SetupCard";
import { WalletStatusCard } from "~/components/dashboard/WalletStatusCard";

export function Welcome() {
  const isSetupComplete = true;
  const isOnSepolia = true;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between border-b px-4 py-4">
        <div className="flex flex-col">
          <span className="text-lg font-semibold">🚨 Panic Protocol</span>
        </div>
        <Button variant="default">Connect Wallet</Button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="pl-4">
            <h1 className="text-2xl font-semibold">Approval Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Review approvals, revoke risk, and execute PANIC Protocol if needed.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" size="lg" disabled={!isSetupComplete}>
              PANIC
            </Button>
          </div>
        </div>

        {!isOnSepolia && (
          <Alert variant="destructive">
            <AlertTitle>Wrong network</AlertTitle>
            <AlertDescription>
              Switch to Sepolia to view approvals and execute PANIC actions.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <ApprovalDashboard />
          <div className="flex flex-col gap-6">
            <WalletStatusCard />
            {!isSetupComplete && <SetupCard />}
            {isSetupComplete && <PanicCard />}
          </div>
        </div>
      </main>
    </div>
  );
}
