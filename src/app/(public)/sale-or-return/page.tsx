import type { Metadata } from "next";
import { Percent, ShieldCheck, HandCoins } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceCTA from "@/components/ServiceCTA";

export const metadata: Metadata = {
  title: "Sale or Return (SOR) — Sell Your Car for More",
  description:
    "MIA Automotive's Sale or Return service sells your premium vehicle on your behalf for a significantly higher return, handling 100% of the work. No sale, no fee.",
};

const HIGHLIGHTS = [
  {
    icon: Percent,
    title: "Up to 15% commission",
    body: "A clear, transparent structure based on vehicle value — nothing hidden.",
  },
  {
    icon: ShieldCheck,
    title: "Zero setup fees",
    body: "No upfront costs. We invest in selling your car properly.",
  },
  {
    icon: HandCoins,
    title: "No sale, no fee",
    body: "If it doesn't sell, you don't pay us a penny. Simple as that.",
  },
];

const STEPS = [
  {
    title: "Valuation & Agreement",
    body: "We look at live retail data to agree on a realistic, premium target price for your vehicle. We commit to a clear, completely transparent commission structure — taking up to 15% of the final sale price depending on the vehicle value, with zero hidden setup fees.",
  },
  {
    title: "Showroom-Ready Preparation",
    body: "Your car undergoes a comprehensive multi-point health check and a professional cosmetic detail before being captured in high-definition media.",
  },
  {
    title: "Premium Marketing",
    body: "We launch your vehicle across major premium retail networks, presenting it flawlessly to active buyers nationwide.",
  },
  {
    title: "Dealer Perks for the Buyer",
    body: "We handle all inquiries and host viewings. Crucially, we can offer buyers professional financing, part-exchange, and comprehensive warranties — things a private seller cannot provide, helping your car sell much faster.",
  },
  {
    title: "Handover & Instant Payment",
    body: "Once cleared funds are secured from the buyer, we deduct our agreed percentage and transfer the remaining balance straight to your account. If it doesn't sell, you don't pay us a penny.",
  },
];

export default function SaleOrReturnPage() {
  return (
    <>
      {/* HEADER */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-20 pt-28 text-cream-50 md:pb-24 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="container-px relative">
          <span className="eyebrow text-green-400">Sale or Return</span>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight">
            Maximise your car&apos;s value,{" "}
            <span className="italic text-green-gradient">hassle-free</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            We sell your vehicle on your behalf — securing you a significantly
            higher return while handling 100% of the work.
          </p>
        </div>
      </section>

      {/* INTRO + HIGHLIGHTS */}
      <section className="container-px py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-5">
            <p className="font-display text-2xl font-medium leading-snug text-ink-950">
              Selling a premium vehicle privately can be a minefield of lowball
              offers, time-wasters, and security risks.
            </p>
            <p className="text-lg leading-relaxed text-ink-600">
              On the other hand, accepting a standard dealership trade-in or
              instant web buying service often means leaving thousands of pounds
              on the table.
            </p>
            <p className="text-lg leading-relaxed text-ink-600">
              Our Sale or Return (SOR) service offers the ultimate alternative:
              we sell your vehicle on your behalf, securing you a significantly
              higher financial return while handling 100% of the work.
            </p>
          </Reveal>

          <Reveal direction="left" className="flex flex-col justify-center gap-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-green-500">
                  <h.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink-950">
                    {h.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {h.body}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-px">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Five steps to a{" "}
                <span className="italic text-green-600">smarter sale</span>
              </>
            }
            description="You stay in control and informed at every stage — we do the heavy lifting."
          />
          <ol className="mt-12 space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={Math.min(i * 0.06, 0.3)}>
                <li className="flex gap-5 rounded-2xl border border-ink-100 bg-white p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950 font-display text-lg font-semibold text-green-500">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-950">
                      {s.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-600">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <ServiceCTA
        heading="Ready to sell smarter?"
        text="Let us unlock the true retail value of your vehicle. Contact our team today for a complimentary valuation."
      />
    </>
  );
}
