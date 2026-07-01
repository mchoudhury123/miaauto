import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  Instagram,
} from "lucide-react";
import { SITE, OPENING_HOURS } from "@/lib/constants";
import { mailtoUrl, telUrl, whatsappUrl } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-ink-300">
      {/* Big wordmark flourish */}
      <div className="container-px border-b border-white/10 py-14">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png?v=2"
                alt={`${SITE.name} logo`}
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <span className="font-wordmark text-xl font-medium uppercase tracking-[0.2em] text-cream-50">
                {SITE.name}
              </span>
            </div>
            <p className="mt-5 leading-relaxed text-ink-400">
              {SITE.tagline} Hand-picked stock, honest descriptions and a
              no-pressure buying experience. Based in South Shields, North East
              UK.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream-200 transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-400"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={whatsappUrl(`Hi ${SITE.name}, I have an enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message us on WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream-200 transition hover:-translate-y-0.5 hover:border-green-500 hover:text-green-400"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
          <a href={telUrl()} className="btn-primary shrink-0">
            <Phone className="h-4 w-4" />
            {SITE.phone}
          </a>
        </div>
      </div>

      <div className="container-px grid gap-10 py-14 md:grid-cols-4">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-luxe text-green-500">
            Explore
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              ["Home", "/"],
              ["Showroom", "/inventory"],
              ["About Us", "/about"],
              ["Sale or Return", "/sale-or-return"],
              ["Vehicle Sourcing", "/sourcing"],
              ["Contact Us", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-ink-300 transition hover:text-green-400"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-luxe text-green-500">
            Get in touch
          </h4>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li>
              <a href={telUrl()} className="flex items-center gap-3 transition hover:text-green-400">
                <Phone className="h-4 w-4 text-green-500" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={mailtoUrl()} className="flex items-center gap-3 transition hover:text-green-400">
                <Mail className="h-4 w-4 text-green-500" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(`Hi ${SITE.name}, I have an enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-green-400"
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                WhatsApp us
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </li>
            <li>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition hover:text-green-400"
              >
                <Instagram className="h-4 w-4 text-green-500" />
                @mia.automotive.ltd
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
              <span>{SITE.address}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-luxe text-green-500">
            Opening hours
          </h4>
          <ul className="mt-5 space-y-2 text-sm text-ink-400">
            {OPENING_HOURS.map((o) => (
              <li key={o.day} className="flex justify-between gap-4">
                <span>{o.day}</span>
                <span className="text-ink-200">{o.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-px flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-5">
            <Link href="/admin" className="transition hover:text-green-400">
              Admin
            </Link>
            <span>Cars sold subject to availability.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
