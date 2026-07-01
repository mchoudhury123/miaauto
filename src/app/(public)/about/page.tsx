import Link from "next/link";
import type { Metadata } from "next";
import { Wrench, Gem, Gauge } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us — The MIA Story",
  description:
    "MIA Automotive was started by three friends over track days, late-night garage projects and a shared obsession with cars. Meet the team behind the dealership.",
};

const STORY: string[] = [
  `Some car dealerships are started by spreadsheets and boardrooms. MIA Automotive was started over track days, late-night garage projects, and a shared obsession with anything on four wheels.`,
  `We are Mahi, Ibtahaz (Ibby), and Olli — three close friends who spent years talking about building the ultimate car dealership. Eventually, we stopped talking, started doing it part-time, and watched it explode. The success was instant because we weren't just selling cars; we were treating people exactly how we wanted to be treated when we bought our own vehicles.`,
  `Today, our goal is simple but massive: to scale MIA Automotive into the UK's number one independent car dealer. We know that to get customers for life, you have to deliver a first-class experience from the second you pick up the phone to the moment the keys hand over. We get it, because we live it.`,
];

const DIRECTORS = [
  {
    name: "Olli",
    initial: "O",
    role: "Management & Technical Directing",
    icon: Wrench,
    bio: `Olli is our resident, pure petrolhead. If it has an engine, he's probably taken it apart and put it back together. Bringing years of formal management experience alongside hands-on mechanical expertise from his own intensive build projects, Olli runs a tight ship. Over the years, he has built an elite network of trade links across the UK — meaning if our clients need custom wraps, PPF protection, or full engine rebuilds, Olli knows the exact master-craftsmen to call.`,
  },
  {
    name: "Ibby",
    initial: "I",
    role: "Sales & Aesthetics",
    icon: Gem,
    bio: `Ibby is the sensible anchor of the trio. While he shares the absolute passion for cars, you won't catch him sliding sideways on a track. Ibby is all about the details, clean aesthetics, and the "show car" lifestyle. With a professional background in high-level sales, he ensures that our customer service is completely flawless. He treats every client with the level of care and transparency that turns a one-time buyer into a friend for life.`,
  },
  {
    name: "Mahi",
    initial: "M",
    role: "Operations & Performance",
    icon: Gauge,
    bio: `Mahi is our unapologetic boy racer. If there's a track day, a karting event, or a winding B-road, Mahi is there. His life revolves around the pure adrenaline of driving, giving him a deep, instinctual understanding of performance dynamics. Backing up his speed on the asphalt is a sharp background in accounts and finance. Mahi keeps our operations razor-sharp, making sure our pricing is fair, our books are perfect, and the business is primed for rapid growth.`,
  },
];

const PROMISE: string[] = [
  `When you deal with MIA Automotive, you aren't dealing with pushy salesmen in cheap suits. You are dealing with three friends who know cars inside and out, backed by professional trade networks and an obsession with quality.`,
  `Whether you are buying, sourcing, or trusting us to sell your pride and joy through our Sale or Return service, you get the first-class treatment. Every single time.`,
];

export default function AboutPage() {
  return (
    <>
      {/* ───────── HEADER ───────── */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-24 pt-28 text-cream-50 md:pb-28 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/70 to-ink-950" />
        <div className="container-px relative">
          <span className="eyebrow text-gold-400">About Us</span>
          <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.0] tracking-tight">
            The MIA <span className="italic text-gold-gradient">Story</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-cream-100/80">
            Three friends, one obsession — building the UK&apos;s number one
            independent car dealer.
          </p>
        </div>
      </section>

      {/* ───────── STORY ───────── */}
      <section className="container-px py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="space-y-5">
            {STORY.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "font-display text-2xl font-medium leading-snug text-ink-950"
                    : "text-lg leading-relaxed text-ink-600"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal direction="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-luxe">
              <div
                className="absolute inset-0 animate-kenburns bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink-950/10" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── DIRECTORS ───────── */}
      <section className="bg-cream-100 py-16 lg:py-24">
        <div className="container-px">
          <SectionHeading
            align="center"
            eyebrow="Meet the Directors"
            title={
              <>
                The people behind{" "}
                <span className="italic text-gold-600">MIA</span>
              </>
            }
            description="Every great car needs the right balance to perform. Our team brings the perfect mix of business grit, mechanical expertise, and retail experience to the table."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {DIRECTORS.map((d, i) => (
              <Reveal
                key={d.name}
                delay={i * 0.1}
                className="flex flex-col rounded-3xl border border-ink-100 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-luxe"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink-950 font-display text-2xl font-semibold text-gold-500">
                    {d.initial}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-950">
                      {d.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gold-600">
                      <d.icon className="h-3.5 w-3.5" />
                      {d.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-ink-500">
                  {d.bio}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── THE MIA PROMISE ───────── */}
      <section className="grain relative overflow-hidden bg-ink-950 py-16 text-cream-50 lg:py-24">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-px relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="eyebrow eyebrow-center flex justify-center text-gold-400">
              The MIA Promise
            </span>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,4.2vw,3.1rem)] font-semibold leading-[1.08] tracking-tight text-balance">
              We didn&apos;t build this business to just move metal. We built it
              to{" "}
              <span className="italic text-gold-gradient">
                change how people buy premium cars.
              </span>
            </h2>
          </Reveal>
          <div className="mx-auto mt-8 max-w-2xl space-y-5 text-center text-ink-300">
            {PROMISE.map((p, i) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/inventory" className="btn-primary">
              Browse the collection
            </Link>
            <Link
              href="/contact"
              className="btn-outline border-white/25 text-cream-50 hover:border-white hover:bg-cream-50 hover:text-ink-950"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
