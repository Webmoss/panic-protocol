import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "~/components/ui/button";

export function Header() {
  return (
    <header className="px-0 pt-0">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-b-xl bg-black px-6 py-5 text-white">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black uppercase tracking-tight">
            🚨 Panic Protocol
          </span>
        </div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            mounted,
            openAccountModal,
            openChainModal,
            openConnectModal,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;
            const label = !connected
              ? "Connect Wallet"
              : chain?.unsupported
                ? "Wrong network"
                : account.displayName;
            const handleClick = !connected
              ? openConnectModal
              : chain?.unsupported
                ? openChainModal
                : openAccountModal;

            return (
              <Button
                size="lg"
                className="min-w-[180px] bg-red-700 text-white hover:bg-red-600"
                onClick={handleClick}
              >
                {label}
              </Button>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
