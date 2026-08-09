import { REVIEW_SOURCES } from "./constants";
import type { CarInput } from "./types";

export interface ReviewInput {
  author: string;
  source: string;
  rating: number;
  body: string;
  carBought: string | null;
  reviewedAt: Date | null;
  published: boolean;
}

/** Server-side validation + coercion for hand-entered review payloads. */
export function validateReviewInput(body: unknown): {
  valid: boolean;
  errors: Record<string, string>;
  data?: ReviewInput;
} {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const author = str(b.author);
  if (!author) errors.author = "Reviewer name is required";
  else if (author.length > 80) errors.author = "Name is too long";

  const text = str(b.body);
  if (!text) errors.body = "Review text is required";
  else if (text.length > 2000) errors.body = "Review is too long (max 2000)";

  const source = str(b.source) || "Other";
  if (!(REVIEW_SOURCES as readonly string[]).includes(source)) {
    errors.source = "Unknown source";
  }

  const rating = Math.round(Number(b.rating));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be 1–5";
  }

  const rawDate = str(b.reviewedAt);
  let reviewedAt: Date | null = null;
  if (rawDate) {
    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) errors.reviewedAt = "Enter a valid date";
    else reviewedAt = d;
  }

  const carBought = str(b.carBought);
  if (carBought.length > 80) errors.carBought = "Too long";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    errors: {},
    data: {
      author,
      source,
      rating,
      body: text,
      carBought: carBought || null,
      reviewedAt,
      published: b.published === undefined ? true : Boolean(b.published),
    },
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
  data?: CarInput;
}

const REQUIRED_STRINGS: (keyof CarInput)[] = [
  "make",
  "model",
  "fuelType",
  "transmission",
  "bodyType",
  "colour",
  "status",
];

/** Server-side validation + coercion for car create/update payloads. */
export function validateCarInput(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const optStr = (v: unknown) => {
    const s = str(v);
    return s === "" ? null : s;
  };
  const int = (v: unknown): number | null => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? n : null;
  };
  const num = (v: unknown): number | null => {
    if (v === "" || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  for (const key of REQUIRED_STRINGS) {
    if (!str(b[key])) errors[key] = "This field is required";
  }

  const year = int(b.year);
  if (year === null) errors.year = "Year is required";
  else if (year < 1950 || year > 2100) errors.year = "Enter a valid year";

  const mileage = int(b.mileage);
  if (mileage === null) errors.mileage = "Mileage is required";
  else if (mileage < 0) errors.mileage = "Mileage cannot be negative";

  const price = int(b.price);
  if (price === null) errors.price = "Price is required";
  else if (price < 0) errors.price = "Price cannot be negative";

  const status = str(b.status);
  if (status && !["available", "reserved", "sold"].includes(status)) {
    errors.status = "Invalid status";
  }

  // Images / features arrays
  const rawImages = Array.isArray(b.images) ? b.images : [];
  const images = rawImages
    .map((img, i) => {
      const o = (img ?? {}) as Record<string, unknown>;
      return {
        url: str(o.url),
        isMain: Boolean(o.isMain),
        order: int(o.order) ?? i,
        alt: optStr(o.alt),
      };
    })
    .filter((img) => img.url !== "");

  // Ensure exactly one main image when images exist.
  if (images.length > 0 && !images.some((i) => i.isMain)) {
    images[0].isMain = true;
  }

  const rawFeatures = Array.isArray(b.features) ? b.features : [];
  const features = rawFeatures
    .map((f) => str(f))
    .filter((f) => f !== "");

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  const data: CarInput = {
    make: str(b.make),
    model: str(b.model),
    variant: optStr(b.variant),
    year: year!,
    regYear: optStr(b.regYear),
    mileage: mileage!,
    price: price!,
    doors: int(b.doors),
    seats: int(b.seats),
    previousOwners: int(b.previousOwners),
    bootSpace: int(b.bootSpace),
    taxPerYear: int(b.taxPerYear),
    insuranceGroup: int(b.insuranceGroup),
    co2Emissions: int(b.co2Emissions),
    taxBand: optStr(b.taxBand),
    mpgUrban: num(b.mpgUrban),
    mpgExtraUrban: num(b.mpgExtraUrban),
    mpgCombined: num(b.mpgCombined),
    powerBhp: int(b.powerBhp),
    torqueNm: int(b.torqueNm),
    topSpeedMph: int(b.topSpeedMph),
    zeroToSixty: num(b.zeroToSixty),
    gears: int(b.gears),
    driveType: optStr(b.driveType),
    drivingAxle: optStr(b.drivingAxle),
    lengthMm: int(b.lengthMm),
    widthMm: int(b.widthMm),
    heightMm: int(b.heightMm),
    wheelbaseMm: int(b.wheelbaseMm),
    fuelTankCapacity: int(b.fuelTankCapacity),
    fuelType: str(b.fuelType),
    transmission: str(b.transmission),
    bodyType: str(b.bodyType),
    colour: str(b.colour),
    engineSize: optStr(b.engineSize),
    ulez: b.ulez === undefined ? true : Boolean(b.ulez),
    motMonths: int(b.motMonths),
    serviceHistory: optStr(b.serviceHistory),
    description: optStr(b.description),
    conditionNotes: optStr(b.conditionNotes),
    status: status || "available",
    featured: Boolean(b.featured),
    features,
    images,
  };

  return { valid: true, errors: {}, data };
}
