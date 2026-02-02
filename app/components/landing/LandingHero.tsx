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
              emergency stop button.
            </h1>
            <p className="text-3xl font-semibold italic leading-tight">
              Built for <span className="text-red-500">hacked and compromised</span>{" "}
              wallets.
            </p>
            <p className="text-base leading-relaxed text-white/90 md:text-lg">
              It still works after all gas or ETH is drained, using prepaid
              emergency gas credits and a gasless relay.
            </p>
            <p className="text-sm leading-relaxed text-white/80">
              Even with ZERO ETH, you can still sweep your remaining assets to
              safety by burning PANIC tokens through a gasless relay system.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 pb-10">
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
            <span className="text-xs text-white/60">
              No ETH? Relay mode covers gas.
            </span>
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
            The Problem (30 seconds)
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>Token approvals stay active after compromise.</li>
            <li>Attackers drain assets while you’re locked out.</li>
            <li>You have no ETH or gas to respond.</li>
          </ul>
          <div className="mt-6 rounded-xl border border-red-700/40 bg-black px-4 py-3 text-sm font-semibold text-red-100">
            You need an emergency stop button.
          </div>
        </div>
      </div>
    </section>
  );
}
