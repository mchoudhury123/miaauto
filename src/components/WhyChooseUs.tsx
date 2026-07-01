import {
  ShieldCheck,
  Sparkles,
  Handshake,
  BadgeCheck,
  Clock,
  Car,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Hand-selected stock",
    body: "Every car is carefully chosen and inspected before it earns a place on our forecourt.",
  },
  {
    icon: ShieldCheck,
    title: "Total transparency",
    body: "Full history, honest descriptions and clear condition notes on every listing.",
  },
  {
    icon: Handshake,
    title: "No-pressure buying",
    body: "We sell directly — no pushy tactics, no finance gimmicks, just straight answers.",
  },
  {
    icon: Sparkles,
    title: "Presented beautifully",
    body: "Each vehicle is professionally detailed and prepared before collection.",
  },
  {
    icon: Clock,
    title: "Quick to respond",
    body: "Call, WhatsApp or message and we'll get straight back to you.",
  },
  {
    icon: Car,
    title: "Drive with confidence",
    body: "MOT, service history and ULEZ status made crystal clear on every car.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-cream-100 py-16 lg:py-28">
      <div className="container-px">
        <SectionHeading
          align="center"
          eyebrow="Why MIA Automotive"
          title={
            <>
              A better way to buy
              <br className="hidden sm:block" /> your{" "}
              <span className="italic text-gold-600">next car</span>
            </>
          }
          description="We've built our reputation on quality cars, honest advice and looking after every customer like family."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              key={title}
              delay={(i % 3) * 0.08}
              className="group bg-cream-50 p-8 transition-colors duration-500 hover:bg-white"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-gold-500 transition-all duration-500 group-hover:bg-gold-500 group-hover:text-ink-950">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink-950">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
