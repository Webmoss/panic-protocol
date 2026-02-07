import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "~/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-red-800/40 bg-black px-6 py-10 text-white shadow-[0_0_0_1px_rgba(185,28,28,0.25)] md:px-10">
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-red-900/40 blur-3xl" />
      <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-stretch">
        <div className="flex h-full flex-col justify-between gap-6">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full border border-red-700/50 bg-red-900/30 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide text-red-100">
              Emergency Gas for Compromised Wallets
            </span>
            <h1 className="pb-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
              <span className="text-red-600">Panic Protocol</span> is an
              emergency stop button for and compromised wallets
            </h1>
            <p className="text-3xl font-semibold italic leading-tight">
              Built for <span className="text-red-500">hacked</span>{" "}
              wallets.
            </p>
            <p className="text-base leading-relaxed text-white/90 md:text-lg">
              Panic Protocol gives you a one-click rescue path when your wallet is compromised.
              You pre-load PANIC as emergency gas credits, then our relay executes the sweep even if
              your ETH balance is drained.
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              When you press PANIC, we move your approved ERC-20 balances to your safe address and show a
              verifiable transaction record. It works with direct execution if you still have ETH,
              or with our gasless relay mode if you don’t.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-10">
            <span className="text-sm text-white/80">
              No ETH, no problem... Our PanicVault relay covers the gas.
            </span>
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => (
                <Button
                  size="lg"
                  className="min-w-[180px] bg-red-700 text-white hover:bg-red-600"
                  onClick={openConnectModal}
                  disabled={!mounted}
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectButton.Custom>            
          </div>
        </div>
        <div className="flex h-full flex-col rounded-2xl border border-red-700/30 bg-white/5 p-6">
          <div className="mb-5 overflow-hidden rounded-xl border border-red-700/40 bg-black">
            <img
              src="/hero-emergency.svg"
              alt="Emergency relay overview"
              className="h-auto w-full"
            />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            The Problem: Gone in 60 seconds
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>Your wallet is compromised, the ETH is drained first.</li>
            <li>Your token approvals stay active after compromise.</li>
            <li>You have no ETH or gas to rescue your assets.</li>
            <li>Hackers drain your assets while you’re locked out.</li>
          </ul>
          <div className="mt-6 rounded-xl border border-red-700/40 bg-black px-4 py-3 text-md font-semibold text-red-100">
            You need an emergency Stop button
          </div>
        </div>
      </div>
    </section>
  );
}
