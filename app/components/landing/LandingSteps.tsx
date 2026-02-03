import { CreditCard, Shield, Zap } from "lucide-react";

const steps = [
  {
    title: "Step 1",
    subtitle: "Prepare",
    text: "Buy PANIC tokens to use as your emergency gas credits.",
    icon: CreditCard,
  },
  {
    title: "Step 2",
    subtitle: "Protect",
    text: "Set a safe address and approve the PanicVault once.",
    icon: Shield,
  },
  {
    title: "Step 3",
    subtitle: "Execute",
    text: "Click PANIC to sweep funds with your tokens, even with zero ETH.",
    icon: Zap,
  },
];

export function LandingSteps() {
  return (
    <section className="grid gap-5 rounded-2xl border border-red-300 bg-red-100 p-5 md:grid-cols-3">
      {steps.map((step) => (
        <div
          key={step.title}
          className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-red-300 bg-red-100 text-red-700">
              <step.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-red-700">
                {step.title}
              </h3>
              <p className="mt-0 text-lg font-black uppercase text-neutral-900">
                {step.subtitle}
              </p>
            </div>
          </div>
          <p className="mt-3 text-base font-medium leading-relaxed text-neutral-900">
            {step.text}
          </p>
        </div>
      ))}
    </section>
  );
}
