import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle, Clock, Instagram } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { SITE, OPENING_HOURS } from "@/lib/constants";
import { mailtoUrl, telUrl, whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.name}. Call, WhatsApp, email or send us a message and we'll respond quickly.`,
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-16 pt-28 text-cream-50 md:pb-20 md:pt-44">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-ink-950/60" />
        <div className="container-px relative">
          <span className="eyebrow text-gold-400">Get in touch</span>
          <h1 className="mt-5 font-display text-[clamp(2.1rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-tight">
            Let&apos;s talk{" "}
            <span className="italic text-gold-400">cars</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-cream-100/80">
            Questions about a car, want to arrange a viewing, or after something
            specific? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="container-px grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Details */}
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              icon={<Phone className="h-5 w-5" />}
              title="Call us"
              value={SITE.phone}
              href={telUrl()}
            />
            <ContactCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="WhatsApp"
              value="Message us"
              href={whatsappUrl(`Hi ${SITE.name}, I have an enquiry.`)}
              external
            />
            <ContactCard
              icon={<Mail className="h-5 w-5" />}
              title="Email"
              value={SITE.email}
              href={mailtoUrl(`Enquiry — ${SITE.name}`)}
            />
            <ContactCard
              icon={<Instagram className="h-5 w-5" />}
              title="Instagram"
              value="@mia.automotive.ltd"
              href={SITE.instagram}
              external
            />
            <ContactCard
              icon={<MapPin className="h-5 w-5" />}
              title="Find us"
              value={SITE.address}
            />
          </div>

          {/* Opening hours */}
          <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink-950">
              <Clock className="h-5 w-5 text-gold-600" />
              Opening hours
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {OPENING_HOURS.map((o) => (
                <li
                  key={o.day}
                  className="flex justify-between border-b border-ink-100 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-ink-500">{o.day}</span>
                  <span className="font-semibold text-ink-900">{o.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="mt-6 aspect-[16/9] overflow-hidden rounded-3xl border border-ink-100">
            <iframe
              title={`${SITE.name} location — South Shields`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                SITE.address,
              )}&z=15&output=embed`}
              className="h-full w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-luxe-sm sm:p-8">
          <span className="eyebrow text-gold-600">Enquiry</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-ink-950">
            Send us a message
          </h2>
          <p className="mb-6 mt-2 text-sm text-ink-500">
            Fill in the form below and we&apos;ll get back to you as soon as we
            can.
          </p>
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-950 text-gold-500 ring-1 ring-gold-500/30 transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-ink-950">
        {icon}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
        {title}
      </p>
      <p className="mt-1 font-semibold text-ink-950">{value}</p>
    </>
  );
  const cls =
    "group block rounded-2xl border border-ink-100 bg-white p-5 transition duration-500 hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-luxe-sm";
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
