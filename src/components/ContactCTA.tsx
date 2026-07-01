import Link from "next/link";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/constants";
import { telUrl, whatsappUrl } from "@/lib/utils";
import Reveal from "./Reveal";

export default function ContactCTA() {
  return (
    <section className="container-px py-16 lg:py-24">
      <Reveal className="grain relative overflow-hidden rounded-[28px] bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 px-6 py-16 text-center text-cream-50 sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <span className="eyebrow eyebrow-center flex justify-center text-gold-400">
            Ready when you are
          </span>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.03] tracking-tight text-balance">
            Found something you{" "}
            <span className="italic text-gold-gradient">love?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-cream-100/80">
            Get in touch and we&apos;ll answer any questions, arrange a viewing
            or hold the car for you. No pressure, no fuss — just a friendly
            conversation.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-primary w-full sm:w-auto">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={telUrl()}
              className="btn-outline w-full border-white/25 text-cream-50 hover:border-white hover:bg-cream-50 hover:text-ink-950 sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
            <a
              href={whatsappUrl(`Hi ${SITE.name}, I have a question about a car.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
