import type { Metadata } from "next";
import { Fraunces, Manrope, Montserrat } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

// Editorial high-contrast serif for display + refined grotesque for body.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
// Geometric sans for the brand wordmark (matches the logo lettering).
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-wordmark",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Premium Used Cars`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "A curated collection of premium used cars from MIA Automotive. Hand-selected, meticulously prepared and sold with confidence. Enquire today.",
  keywords: [
    "luxury used cars",
    "premium cars",
    "car dealership",
    "MIA Automotive",
    "buy a car",
  ],
  openGraph: {
    title: `${SITE.name} — Premium Used Cars`,
    description: SITE.tagline,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${fraunces.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
