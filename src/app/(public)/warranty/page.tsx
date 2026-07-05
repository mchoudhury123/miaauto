import type { Metadata } from "next";
import {
  ShieldCheck,
  Wrench,
  BadgeCheck,
  SlidersHorizontal,
  Award,
  TrendingUp,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ServiceCTA from "@/components/ServiceCTA";
import WarrantywiseLogo from "@/components/WarrantywiseLogo";

export const metadata: Metadata = {
  title: "Warranty — Cover by Warrantywise",
  description:
    "MIA Automotive partners with Warrantywise so every car can be protected against unexpected mechanical and electrical faults. Ask us about the right cover for your car.",
};

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Comprehensive protection",
    body: "Cover against unexpected mechanical and electrical failures, so a surprise fault doesn't become a surprise bill.",
  },
  {
    icon: Wrench,
    title: "Repairs sorted",
    body: "Work is carried out by trusted, approved repairers — with parts and labour covered under your plan.",
  },
  {
    icon: BadgeCheck,
    title: "Claims made simple",
    body: "A straightforward claims process that's handled for you, so you're back on the road with minimal fuss.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible plans",
    body: "Different levels of cover and durations to suit the car, the mileage and your budget.",
  },
  {
    icon: Award,
    title: "A name you can trust",
    body: "Backed by Warrantywise — one of the UK's most recognised and respected used-car warranty providers.",
  },
  {
    icon: TrendingUp,
    title: "Added peace of mind",
    body: "Drive away knowing you're protected long after you've collected the keys.",
  },
];

const STEPS = [
  {
    title: "Choose your car",
    body: "Every car in our showroom can be protected with a Warrantywise plan.",
  },
  {
    title: "Pick your cover",
    body: "We'll help you choose the right level and length of cover for your vehicle and budget.",
  },
  {
    title: "Drive protected",
    body: "Relax knowing you're covered — and if anything goes wrong, the claim is handled for you.",
  },
];

export default function WarrantyPage() {
  return (
    <>
      {/* HEADER */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-20 pt-28 text-cream-50 md:pb-24 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="container-px relative">
          <span className="eyebrow text-green-400">
            In partnership with Warrantywise
          </span>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight">
            Drive with total{" "}
            <span className="italic text-green-gradient">peace of mind</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            We&apos;ve partnered with Warrantywise so every car we sell can be
            protected against unexpected mechanical and electrical faults.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-luxe-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              Official partner
            </span>
            <WarrantywiseLogo className="h-8" />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-px py-16 lg:py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-medium leading-snug text-ink-950">
            A quality used car deserves quality protection.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            Every one of our cars is hand-selected and prepared to a high
            standard — but great peace of mind goes further. Through our
            partnership with Warrantywise, you can add a warranty that covers
            the unexpected, giving you the confidence to simply enjoy the drive.
          </p>
        </Reveal>
      </section>

      {/* BENEFITS */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-px">
          <SectionHeading
            align="center"
            eyebrow="What you get"
            title={
              <>
                Cover that has you{" "}
                <span className="italic text-green-600">covered</span>
              </>
            }
            description="A Warrantywise plan protects the parts that matter, with repairs and claims taken care of for you."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <Reveal
                key={b.title}
                delay={(i % 3) * 0.08}
                className="rounded-3xl border border-ink-100 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-green-500">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {b.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-px py-16 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Protected in{" "}
              <span className="italic text-green-600">three steps</span>
            </>
          }
          description="Adding cover to your car couldn't be simpler — just ask us."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="h-full rounded-2xl border border-ink-100 bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-950 font-display text-lg font-semibold text-green-500">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink-950">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">{s.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-ink-400">
          Warrantywise is a registered trademark of Warrantywise Limited. Cover
          levels, eligibility and terms &amp; conditions apply and vary by plan
          and vehicle — ask our team for full details.
        </p>
      </section>

      <ServiceCTA
        heading="Ask us about warranty cover"
        text="Get in touch and we'll talk you through the right level of Warrantywise protection for the car you're interested in."
      />
    </>
  );
}
