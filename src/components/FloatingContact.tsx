"use client";

import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { telUrl, whatsappUrl } from "@/lib/utils";

/** Persistent mobile-friendly call + WhatsApp shortcuts. */
export default function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={whatsappUrl(`Hi ${SITE.name}, I'd like to make an enquiry.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-[#25D366]/30 transition hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
      <a
        href={telUrl()}
        aria-label="Call us"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 p-3.5 text-gold-500 shadow-lg transition hover:scale-105 md:hidden"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
