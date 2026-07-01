import type { Metadata } from "next";
import { ClipboardList, Search, BadgeCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceCTA from "@/components/ServiceCTA";

export const metadata: Metadata = {
  title: "Bespoke Vehicle Sourcing — Your Perfect Car, Found",
  description:
    "Give MIA Automotive your wishlist and our experts hunt down the exact car via trade networks, private clubs and fleet auctions — inspected, verified and delivered with warranty.",
};

const HIGHLIGHTS = [
  {
    icon: ClipboardList,
    title: "You set the wishlist",
    body: "Exact budget, make, model and non-negotiable specs — we match it.",
  },
  {
    icon: Search,
    title: "Off-market access",
    body: "Trade networks, private clubs and fleet auctions, before cars go public.",
  },
  {
    icon: BadgeCheck,
    title: "Inspected & warrantied",
    body: "HPI and history checked, technician-evaluated, delivered with warranty.",
  },
];

const STEPS = [
  {
    title: "The Wishlist",
    body: "You tell us your exact budget, desired make, model, and non-negotiable specifications (colour, panoramic roof, tech packs, etc.).",
  },
  {
    title: "The Hunt & Transparency",
    body: "We comb our trade networks to find the finest matching examples. We are entirely open about our pricing: our expert sourcing service fee is up to 15% of the final purchase price, which is heavily offset by the dealer-level discounts we negotiate on your behalf.",
  },
  {
    title: "Inspection & Verification",
    body: "Before any funds change hands, one of our experienced vehicle technicians conducts a meticulous mechanical and cosmetic evaluation, alongside strict HPI background and service history audits.",
  },
  {
    title: "Handover & Warranty",
    body: "Once the vehicle passes our strict retail standards, it receives a fresh detail and is delivered straight to your door, complete with a comprehensive warranty for absolute peace of mind.",
  },
];

export default function SourcingPage() {
  return (
    <>
      {/* HEADER */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-20 pt-28 text-cream-50 md:pb-24 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="container-px relative">
          <span className="eyebrow text-green-400">Bespoke Vehicle Sourcing</span>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight">
            Your perfect car,{" "}
            <span className="italic text-green-gradient">sourced by experts</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            Give us your ultimate wishlist and our team finds it — using trade
            networks, private clubs and exclusive auctions.
          </p>
        </div>
      </section>

      {/* INTRO + HIGHLIGHTS */}
      <section className="container-px py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="space-y-5">
            <p className="font-display text-2xl font-medium leading-snug text-ink-950">
              Finding a car with the exact specification, colour combination and
              service history you want takes hours of endless scrolling and
              cross-country travel.
            </p>
            <p className="text-lg leading-relaxed text-ink-600">
              With the MIA Automotive Sourcing Service, you don&apos;t
              compromise. You simply give us your ultimate wishlist, and our
              expert team handles the hunt — utilising trade networks, private
              car clubs, and exclusive fleet auctions to find vehicles before
              they ever hit the public market.
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
                From wishlist to{" "}
                <span className="italic text-green-600">your driveway</span>
              </>
            }
            description="Tell us exactly what you're after — we handle the search, the checks and the delivery."
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
        heading="Let us find your next vehicle"
        text="Stop settling for what is available on local forecourts. Tell us exactly what you are looking for, and let us do the rest."
      />
    </>
  );
}
