import type { Metadata } from "next";
import { Scale, Sparkles, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import PartExchangeForm from "@/components/PartExchangeForm";

export const metadata: Metadata = {
  title: "Part Exchange — Trade In Your Car",
  description:
    "Part-exchange your car with MIA Automotive. Fill in your vehicle details for a fair, hassle-free valuation and offset it against your next car.",
};

const HIGHLIGHTS = [
  {
    icon: Scale,
    title: "Fair valuations",
    body: "Priced against live retail data — no insulting lowball offers.",
  },
  {
    icon: Sparkles,
    title: "Hassle-free",
    body: "We handle the paperwork and can settle outstanding finance.",
  },
  {
    icon: ShieldCheck,
    title: "Offset or sell",
    body: "Put the value towards your next car, or simply sell it to us.",
  },
];

export default function PartExchangePage() {
  return (
    <>
      {/* HEADER */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-20 pt-28 text-cream-50 md:pb-24 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="container-px relative">
          <span className="eyebrow text-green-400">Part Exchange</span>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight">
            Trade in your car,{" "}
            <span className="italic text-green-gradient">the easy way</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            Tell us about your car below and we&apos;ll come back with a fair
            valuation — put it towards your next one, or just sell it to us.
          </p>
        </div>
      </section>

      {/* INTRO + FORM */}
      <section className="container-px py-16 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="lg:sticky lg:top-24">
            <span className="eyebrow text-green-600">Why part-exchange with us</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink-950">
              A fair price, zero hassle
            </h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              Part-exchanging is the simplest way to move into your next car. No
              private sale headaches, no time-wasters — just an honest valuation
              and a smooth handover.
            </p>
            <div className="mt-8 space-y-4">
              {HIGHLIGHTS.map((h) => (
                <div key={h.title} className="flex items-start gap-4">
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
            </div>
          </Reveal>

          <Reveal
            direction="left"
            className="rounded-3xl border border-ink-100 bg-white p-6 shadow-luxe-sm sm:p-8"
          >
            <span className="eyebrow text-green-600">Part-exchange valuation</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink-950">
              Tell us about your car
            </h2>
            <p className="mb-6 mt-2 text-sm text-ink-500">
              Fill in the details below and we&apos;ll get straight back to you.
            </p>
            <PartExchangeForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
