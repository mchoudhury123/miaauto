import type { Car, CarImage, Feature } from "@prisma/client";

export type { Car, CarImage, Feature, Enquiry } from "@prisma/client";

/** A car with its relations loaded — the shape used throughout the UI. */
export type CarWithRelations = Car & {
  images: CarImage[];
  features: Feature[];
};

/** Parsed, normalised inventory filters. */
export interface CarFilters {
  make?: string;
  model?: string;
  variant?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  colour?: string;
  doors?: number;
  seats?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  priceMin?: number;
  priceMax?: number;
  engineSize?: string;
  taxMax?: number; // max road tax £/yr
  insMax?: number; // max insurance group
  bootMin?: number; // min boot space (litres)
  status?: string; // available | reserved | sold | all
  sort?: string;
  q?: string; // free text search
}

/** Payload accepted by POST/PUT car endpoints. */
export interface CarInput {
  make: string;
  model: string;
  variant?: string | null;
  year: number;
  regYear?: string | null;
  mileage: number;
  price: number;
  doors?: number | null;
  seats?: number | null;
  previousOwners?: number | null;
  bootSpace?: number | null;
  taxPerYear?: number | null;
  insuranceGroup?: number | null;
  co2Emissions?: number | null;
  taxBand?: string | null;
  mpgUrban?: number | null;
  mpgExtraUrban?: number | null;
  mpgCombined?: number | null;
  powerBhp?: number | null;
  torqueNm?: number | null;
  topSpeedMph?: number | null;
  zeroToSixty?: number | null;
  gears?: number | null;
  driveType?: string | null;
  drivingAxle?: string | null;
  lengthMm?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  wheelbaseMm?: number | null;
  fuelTankCapacity?: number | null;
  fuelType: string;
  transmission: string;
  bodyType: string;
  colour: string;
  engineSize?: string | null;
  ulez: boolean;
  motMonths?: number | null;
  serviceHistory?: string | null;
  description?: string | null;
  conditionNotes?: string | null;
  status: string;
  featured: boolean;
  features: string[];
  images: { url: string; isMain: boolean; order: number; alt?: string | null }[];
}
