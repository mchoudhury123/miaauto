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
    <section className="bg-white py-16 lg:py-28">
      <div className="container-px">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1.5 text-green-600">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
          </div>
          <span className="eyebrow eyebrow-center mt-5 flex justify-center text-green-600">
            Rated excellent
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-tight text-ink-950">
            Trusted by <span className="italic text-green-600">happy drivers</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 0.1}
              className="relative rounded-3xl border border-ink-100 bg-cream-100 p-8 transition duration-500 hover:-translate-y-1 hover:shadow-luxe"
            >
              <Quote className="absolute right-7 top-7 h-9 w-9 text-ink-200" />
              <div className="flex gap-0.5 text-green-600">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-lg italic leading-relaxed text-ink-700">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-6 border-t border-ink-100 pt-5">
                <p className="font-semibold text-ink-950">{r.name}</p>
                <p className="text-xs uppercase tracking-wider text-green-700">
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
