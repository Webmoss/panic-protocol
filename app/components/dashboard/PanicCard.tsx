import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function PanicCard() {
  const panicStatus: "idle" | "signing" | "executing" | "done" | "error" = "idle";

  return (
    <Card className="border-red-600 bg-red-600 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">PANIC Mode</CardTitle>
        <Badge className="bg-white text-black">Relay Execution</Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-sm">
        {panicStatus !== "idle" && (
          <Alert className="border-white/40 bg-white/90 text-black">
            <AlertTitle>
              {panicStatus === "signing" && "Awaiting signature"}
              {panicStatus === "executing" && "Executing rescue"}
              {panicStatus === "done" && "Rescue complete"}
              {panicStatus === "error" && "Rescue failed"}
            </AlertTitle>
            <AlertDescription>
              {panicStatus === "signing" && "This signature is gasless."}
              {panicStatus === "executing" && "Relay is paying gas on your behalf."}
              {panicStatus === "done" && "Approvals revoked and assets swept."}
              {panicStatus === "error" && "Please retry or check relay status."}
            </AlertDescription>
          </Alert>
        )}
        <div className="rounded-lg border border-neutral-800 bg-white p-2">
          <p className="font-medium text-black">Actions</p>
          <ul className="mt-2 list-disc pl-5 text-black/80">
            <li>Revoke token approvals</li>
            <li>Sweep ERC-20 tokens</li>
          </ul>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white">Cost</span>
          <span className="font-medium">300 PANIC</span>
        </div>
        <Button
          className="w-full bg-white text-black hover:bg-white/90"
          disabled={panicStatus !== "idle"}
        >
          Confirm PANIC
        </Button>
        <p className="text-xs text-white">
          Gasless signature. Relay pays gas on your behalf.
        </p>
      </CardContent>
    </Card>
  );
}
