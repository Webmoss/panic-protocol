import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function SetupCard() {
  return (
    <Card className="border-neutral-800 bg-neutral-950 text-white">
      <CardHeader className="pb-1">
        <CardTitle>One-Time Setup</CardTitle>
        <p className="text-sm text-white/70">
          Complete these steps to enable PANIC Mode.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div>
            <p className="text-xs text-white/60">Step 1</p>
            <p className="font-medium">Buy PANIC Tokens</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full border-white bg-white text-black hover:bg-white/90"
          >
            Buy Now
          </Button>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <p className="text-xs text-white/60">Step 2</p>
          <p className="font-medium">Set Safe Address</p>
          <div className="mt-3 space-y-2">
            <Input
              placeholder="0x... or ENS name"
              className="border-neutral-700 bg-neutral-950/80 text-white placeholder:text-white/40"
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
            >
              Save Safe Address
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-1.5">
          <div className="flex flex-col items-center justify-between">
            <div className="pb-1">
              <p className="text-xs text-white/60">Step 3</p>
              <p className="font-medium">Grant PanicVault Approval</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full border-white bg-white text-black hover:bg-white/90"
            >
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
