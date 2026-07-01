import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SITE } from "./constants";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** £24,995 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

/** 24,995 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-GB").format(n);
}

/** 24,995 miles */
export function formatMileage(miles: number): string {
  return `${formatNumber(miles)} miles`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** "2021 BMW 3 Series M Sport" */
export function carTitle(car: {
  year: number;
  make: string;
  model: string;
  variant?: string | null;
}): string {
  return [car.year, car.make, car.model, car.variant]
    .filter(Boolean)
    .join(" ");
}

/** Build a WhatsApp click-to-chat URL with a prefilled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telUrl(): string {
  return `tel:${SITE.phone.replace(/\s+/g, "")}`;
}

export function mailtoUrl(subject?: string): string {
  const base = `mailto:${SITE.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Simple email shape check for client + server validation. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Placeholder when a car has no uploaded images yet. */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#171b21"/><text x="50%" y="50%" fill="#4b5260" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">No image available</text></svg>`,
  );
