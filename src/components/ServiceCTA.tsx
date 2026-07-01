import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import { SITE } from "@/lib/constants";
import { telUrl, whatsappUrl, mailtoUrl } from "@/lib/utils";

export default function ServiceCTA({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
    SITE.address,
  )}`;
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-16 text-cream-50 lg:py-24">
      <div className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="container-px relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.08] tracking-tight text-balance">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">{text}</p>
        </Reveal>

        <div className="mx-auto mt-9 flex max-w-md flex-col gap-3">
          <a href={telUrl()} className="btn-primary w-full">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </a>
          <a
            href={whatsappUrl(
              "Hi MIA Automotive, I'd like a valuation / to enquire about your services.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
          <a
            href={mailtoUrl("Service enquiry — MIA Automotive")}
            className="btn-outline w-full border-white/25 text-cream-50 hover:border-white hover:bg-cream-50 hover:text-ink-950"
          >
            <Mail className="h-4 w-4" />
            {SITE.email}
          </a>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-center text-sm text-ink-400 transition hover:text-gold-400"
        >
          <MapPin className="h-4 w-4 shrink-0 text-gold-500" />
          {SITE.address}
        </a>
      </div>
    </section>
  );
}
