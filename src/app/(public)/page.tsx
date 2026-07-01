import Link from "next/link";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import HeroSearch from "@/components/HeroSearch";
import CarCard from "@/components/CarCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import ContactCTA from "@/components/ContactCTA";
import BrandMarquee from "@/components/BrandMarquee";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import { getFeaturedCars, getFilterFacets } from "@/lib/cars";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, facets, available, sold] = await Promise.all([
    getFeaturedCars(6),
    getFilterFacets(),
    prisma.car.count({ where: { status: "available" } }),
    prisma.car.count({ where: { status: "sold" } }),
  ]);

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-cream-50">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/85 via-ink-950/55 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-transparent to-transparent" />

        <div className="container-px relative flex flex-1 flex-col justify-center pt-32 pb-12 sm:pt-40">
          <div className="max-w-3xl">
            <span className="eyebrow animate-fade-in text-green-400">
              {SITE.name} · Est. excellence
            </span>
            <h1 className="mt-6 animate-fade-in font-display text-[clamp(2.25rem,7vw,5.25rem)] font-semibold leading-[1.0] tracking-tight text-balance [animation-delay:80ms]">
              Drive away in
              <br />
              something{" "}
              <span className="text-green-gradient animate-green-sweep italic">
                extraordinary
              </span>
            </h1>
            <p className="mt-7 max-w-xl animate-fade-in text-lg leading-relaxed text-cream-100/85 [animation-delay:160ms]">
              A curated collection of premium used cars — hand-selected,
              meticulously prepared and sold with complete transparency. No
              pressure, no gimmicks — just exceptional cars.
            </p>
            <div className="mt-9 flex animate-fade-in flex-col gap-3 sm:flex-row [animation-delay:240ms]">
              <Link href="/inventory" className="btn-primary w-full sm:w-auto">
                View current stock
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="btn-outline w-full border-white/25 text-cream-50 hover:border-white hover:bg-cream-50 hover:text-ink-950 sm:w-auto"
              >
                Speak to us
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="mt-12 animate-fade-in [animation-delay:320ms]">
            <HeroSearch makes={facets.makes} />
          </div>

          {/* Floating stat ribbon */}
          <div className="mt-10 grid grid-cols-3 gap-4 divide-x divide-white/10 border-t border-white/10 pt-7 text-cream-100/90">
            <Stat value={<Counter to={available} suffix="+" />} label="Cars in stock" />
            <Stat
              className="pl-4"
              value={
                <span className="flex items-center gap-1">
                  4.9 <Star className="h-5 w-5 fill-green-500 text-green-500" />
                </span>
              }
              label="Customer rating"
            />
            <Stat
              className="pl-4"
              value={<Counter to={sold + 120} suffix="+" />}
              label="Cars sold"
            />
          </div>
        </div>

      </section>

      <BrandMarquee />

      {/* ───────── FEATURED STOCK ───────── */}
      <section id="featured" className="container-px scroll-mt-24 py-16 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The collection"
            title={
              <>
                Featured <span className="italic text-green-600">stock</span>
              </>
            }
            description="A glimpse of what's on the forecourt right now — each one hand-picked and ready to drive."
          />
          <Reveal direction="left">
            <Link
              href="/inventory"
              className="group hidden items-center gap-2 text-sm font-semibold text-ink-700 hover:text-green-700 sm:flex"
            >
              View full showroom
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {featured.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-ink-200 py-20 text-center">
            <p className="text-ink-500">
              No cars in stock just yet — check back soon or{" "}
              <Link href="/contact" className="font-semibold text-green-700">
                get in touch
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/inventory" className="btn-dark">
            View full showroom
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ───────── EXPERIENCE SPLIT ───────── */}
      <section className="bg-cream-100">
        <div className="container-px grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-28">
          <Reveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-luxe">
              <div
                className="absolute inset-0 animate-kenburns bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80')",
                }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-ink-950/10" />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="The MIA difference"
              title={
                <>
                  Buying a car,
                  <br />
                  <span className="italic text-green-600">elevated</span>
                </>
              }
              description="We treat every car — and every customer — the way we'd want to be treated ourselves. That means honest descriptions, no pressure, and a level of presentation you won't find on the average forecourt."
            />
            <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2">
              {[
                ["Hand-selected", "Only the cars we'd buy ourselves make the cut."],
                ["Fully prepared", "Detailed, inspected and ready before listing."],
                ["Total transparency", "Full history and honest condition notes."],
                ["Dealer services", "Part exchange, finance support and warranty packages available."],
              ].map(([t, d]) => (
                <div key={t} className="bg-white p-6">
                  <h3 className="font-display text-lg font-semibold text-green-700">
                    {t}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── STATS BAND ───────── */}
      <section className="container-px py-16 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            { v: <Counter to={sold + 120} suffix="+" />, l: "Happy customers" },
            { v: <Counter to={available} suffix="" />, l: "Cars in stock now" },
            { v: "4.9★", l: "Average review score" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.1} className="text-center">
              <p className="font-display text-5xl font-semibold text-ink-950 sm:text-6xl">
                {s.v}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-ink-400">
                {s.l}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyChooseUs />
      <Testimonials />
      <ContactCTA />
    </>
  );
}

function Stat({
  value,
  label,
  className,
}: {
  value: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-display text-xl font-semibold text-cream-50 sm:text-3xl">
        {value}
      </div>
      <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-cream-200/60 sm:text-xs sm:tracking-[0.14em]">
        {label}
      </div>
    </div>
  );
}
