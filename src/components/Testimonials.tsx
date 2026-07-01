import { Star, Quote } from "lucide-react";
import Reveal from "./Reveal";

const REVIEWS = [
  {
    name: "Daniel R.",
    car: "Audi A4 Avant",
    body: "Genuinely the easiest car purchase I've ever made. Exactly as described and the team couldn't have been more helpful.",
  },
  {
    name: "Priya S.",
    car: "BMW 3 Series",
    body: "No pressure, no nonsense. They answered every question over WhatsApp and the car was immaculate on collection.",
  },
  {
    name: "Mark T.",
    car: "Range Rover Evoque",
    body: "Brilliant from start to finish. Full history, honest about everything, and a fair price. Would buy again in a heartbeat.",
  },
];

export default function Testimonials() {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-16 text-cream-50 lg:py-28">
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1.5 text-gold-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <span className="eyebrow eyebrow-center mt-5 flex justify-center text-gold-400">
            Rated excellent
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
            Trusted by <span className="italic text-gold-400">happy drivers</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 0.1}
              className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur transition-colors duration-500 hover:bg-white/[0.07]"
            >
              <Quote className="absolute right-7 top-7 h-9 w-9 text-white/10" />
              <div className="flex gap-0.5 text-gold-500">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-lg italic leading-relaxed text-cream-100">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="font-semibold text-cream-50">{r.name}</p>
                <p className="text-xs uppercase tracking-wider text-gold-500">
                  Bought a {r.car}
                </p>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
