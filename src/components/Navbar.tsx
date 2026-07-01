"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle, Instagram, ChevronDown } from "lucide-react";
import { cn, telUrl, whatsappUrl } from "@/lib/utils";
import { SITE } from "@/lib/constants";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavItem = NavLink | NavGroup;

const LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Showroom" },
  { href: "/about", label: "About" },
  {
    label: "Services",
    children: [
      { href: "/sale-or-return", label: "Sale or Return" },
      { href: "/sourcing", label: "Vehicle Sourcing" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Announcement strip */}
      <div className="hidden border-b border-white/10 bg-ink-950 text-[11px] tracking-[0.18em] text-cream-200/80 md:block">
        <div className="container-px flex h-9 items-center justify-between font-medium uppercase">
          <span>South Shields · Hand-selected stock, sold with confidence</span>
          <div className="flex items-center gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-green-400"
              aria-label="Instagram"
            >
              <Instagram className="h-3.5 w-3.5" />
              Instagram
            </a>
            <a
              href={whatsappUrl(`Hi ${SITE.name}, I have an enquiry.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-green-400"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      {/* Main bar — consistent, pinned, never changes on scroll */}
      <div className="border-b border-white/10 bg-ink-950/85 backdrop-blur-xl">
        <nav className="container-px flex h-16 items-center justify-between md:h-[72px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png?v=2"
              alt={`${SITE.name} logo`}
              width={72}
              height={72}
              priority
              className="h-14 w-14 object-contain md:h-[64px] md:w-[64px]"
            />
            <span className="flex flex-col leading-none">
              <span className="font-wordmark text-lg font-medium uppercase tracking-[0.2em] text-cream-50">
                {SITE.name}
              </span>
              <span className="mt-1 font-wordmark text-[9px] font-medium uppercase tracking-[0.3em] text-green-500">
                Premium Cars
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              if ("children" in l) {
                const active = l.children.some((c) =>
                  pathname.startsWith(c.href),
                );
                return (
                  <div key={l.label} className="group relative">
                    <button
                      className={cn(
                        "relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-green-400"
                          : "text-cream-100 hover:text-green-400",
                      )}
                    >
                      {l.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                      {active && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-px bg-green-500" />
                      )}
                    </button>
                    <div className="invisible absolute left-0 top-full pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
                      <div className="w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 p-1.5 shadow-xl backdrop-blur-xl">
                        {l.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={cn(
                              "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                              pathname.startsWith(c.href)
                                ? "bg-white/10 text-green-400"
                                : "text-cream-100 hover:bg-white/10 hover:text-green-400",
                            )}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-green-400"
                      : "text-cream-100 hover:text-green-400",
                  )}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-px bg-green-500" />
                  )}
                </Link>
              );
            })}
            <a href={telUrl()} className="btn-primary ml-3">
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-cream-50 transition hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden bg-ink-950 transition-all duration-300 md:hidden",
          open ? "max-h-[85vh] border-b border-white/10" : "max-h-0",
        )}
      >
        <div className="container-px flex flex-col gap-1 py-4">
          {LINKS.map((l) =>
            "children" in l ? (
              <div key={l.label} className="mt-1">
                <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {l.label}
                </p>
                {l.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-cream-100 hover:bg-white/10"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-3 text-base font-medium text-cream-100 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ),
          )}
          <a href={telUrl()} className="btn-primary mt-2">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
