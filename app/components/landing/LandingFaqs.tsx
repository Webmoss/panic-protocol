const faqs = [
  {
    title: "How does the relay work?",
    body: "You sign a gasless message, the relay submits the transaction, and PANIC tokens are burned to cover the gas.",
  },
  {
    title: "What if I still have ETH?",
    body: "You can execute directly and keep your PANIC balance intact.",
  },
  {
    title: "Can it stop transactions in the mempool?",
    body: "No. Panic Protocol secures remaining assets after compromise, but cannot stop pending transactions.",
  },
  {
    title: "What tokens are supported?",
    body: "v1 sweeps ERC-20 tokens. NFT and ETH support are planned.",
  },
];

export function LandingFaqs() {
  return (
    <section className="rounded-3xl border border-red-800/40 bg-black p-6 text-white md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full border border-red-700/50 bg-red-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
            FAQs
          </span>
          <h2 className="mt-3 text-2xl font-black uppercase tracking-tight">
            Answers for your emergency plan
          </h2>
        </div>
        <div className="rounded-xl border border-red-700/40 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-200">
          Emergency-ready in minutes
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <div
            key={faq.title}
            className="space-y-2 rounded-2xl border border-red-800/40 bg-white/5 p-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-red-300">
              {faq.title}
            </h3>
            <p className="text-sm text-white/80">{faq.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
