import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import Reveal from "./Reveal";

// Contact details supplied specifically for the SOR / Sourcing services.
const SVC = {
  phoneDisplay: "07507 536422",
  tel: "07507536422",
  whatsapp: "447507536422",
  email: "miaautomotive1@gmail.com",
  address: "19 Flagg Court, South Shields, Tyne and Wear, NE33 2LS",
};

export default function ServiceCTA({
  heading,
  text,
}: {
  heading: string;
  text: string;
}) {
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(SVC.address)}`;
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
          <a href={`tel:${SVC.tel}`} className="btn-primary w-full">
            <Phone className="h-4 w-4" />
            Call {SVC.phoneDisplay}
          </a>
          <a
            href={`https://wa.me/${SVC.whatsapp}?text=${encodeURIComponent(
              "Hi MIA Automotive, I'd like a valuation / to enquire about your services.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp us
          </a>
          <a
            href={`mailto:${SVC.email}?subject=${encodeURIComponent(
              "Service enquiry — MIA Automotive",
            )}`}
            className="btn-outline w-full border-white/25 text-cream-50 hover:border-white hover:bg-cream-50 hover:text-ink-950"
          >
            <Mail className="h-4 w-4" />
            {SVC.email}
          </a>
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 text-sm text-ink-400 transition hover:text-gold-400"
        >
          <MapPin className="h-4 w-4 text-gold-500" />
          {SVC.address}
        </a>
      </div>
    </section>
  );
}
