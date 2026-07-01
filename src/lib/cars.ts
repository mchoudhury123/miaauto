import { prisma } from "./prisma";
import type { CarFilters, CarWithRelations } from "./types";
import type { Prisma } from "@prisma/client";

/** Parse raw query params (string map) into typed, validated filters. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): CarFilters {
  const get = (k: string): string | undefined => {
    const v = params[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const num = (k: string): number | undefined => {
    const v = get(k);
    if (v === undefined || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    make: get("make") || undefined,
    model: get("model") || undefined,
    variant: get("variant") || undefined,
    fuelType: get("fuelType") || undefined,
    transmission: get("transmission") || undefined,
    bodyType: get("bodyType") || undefined,
    colour: get("colour") || undefined,
    doors: num("doors"),
    seats: num("seats"),
    yearMin: num("yearMin"),
    yearMax: num("yearMax"),
    mileageMax: num("mileageMax"),
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    engineSize: get("engineSize") || undefined,
    taxMax: num("taxMax"),
    insMax: num("insMax"),
    bootMin: num("bootMin"),
    status: get("status") || undefined,
    sort: get("sort") || undefined,
    q: get("q") || undefined,
  };
}

function buildWhere(filters: CarFilters): Prisma.CarWhereInput {
  const where: Prisma.CarWhereInput = {};

  // Status: default to "available" for public browsing; "all" shows everything.
  if (filters.status && filters.status !== "all") {
    where.status = filters.status;
  }

  if (filters.make) where.make = filters.make;
  if (filters.model) where.model = { contains: filters.model, mode: "insensitive" };
  if (filters.variant)
    where.variant = { contains: filters.variant, mode: "insensitive" };
  if (filters.fuelType) where.fuelType = filters.fuelType;
  if (filters.transmission) where.transmission = filters.transmission;
  if (filters.bodyType) where.bodyType = filters.bodyType;
  if (filters.colour) where.colour = filters.colour;
  if (filters.doors) where.doors = filters.doors;
  if (filters.seats) where.seats = filters.seats;
  if (filters.engineSize)
    where.engineSize = { contains: filters.engineSize, mode: "insensitive" };
  if (filters.taxMax) where.taxPerYear = { lte: filters.taxMax };
  if (filters.insMax) where.insuranceGroup = { lte: filters.insMax };
  if (filters.bootMin) where.bootSpace = { gte: filters.bootMin };

  if (filters.yearMin || filters.yearMax) {
    where.year = {};
    if (filters.yearMin) where.year.gte = filters.yearMin;
    if (filters.yearMax) where.year.lte = filters.yearMax;
  }
  if (filters.mileageMax) where.mileage = { lte: filters.mileageMax };
  if (filters.priceMin || filters.priceMax) {
    where.price = {};
    if (filters.priceMin) where.price.gte = filters.priceMin;
    if (filters.priceMax) where.price.lte = filters.priceMax;
  }

  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { make: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { variant: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildOrderBy(sort?: string): Prisma.CarOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "mileage-asc":
      return [{ mileage: "asc" }];
    case "year-desc":
      return [{ year: "desc" }];
    case "newest":
    default:
      // Featured first, then most recently added.
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export async function getCars(
  filters: CarFilters,
): Promise<CarWithRelations[]> {
  return prisma.car.findMany({
    where: buildWhere(filters),
    orderBy: buildOrderBy(filters.sort),
    include: {
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
      features: true,
    },
  });
}

export async function getCarById(
  id: string,
): Promise<CarWithRelations | null> {
  return prisma.car.findUnique({
    where: { id },
    include: {
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
      features: true,
    },
  });
}

export async function getFeaturedCars(
  limit = 6,
): Promise<CarWithRelations[]> {
  const featured = await prisma.car.findMany({
    where: { status: "available", featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
      features: true,
    },
  });
  if (featured.length >= limit) return featured;

  // Top up with latest available stock so the section is never sparse.
  const extra = await prisma.car.findMany({
    where: { status: "available", id: { notIn: featured.map((c) => c.id) } },
    orderBy: { createdAt: "desc" },
    take: limit - featured.length,
    include: {
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
      features: true,
    },
  });
  return [...featured, ...extra];
}

/** Similar = same make (or body type), available, excluding the current car. */
export async function getSimilarCars(
  car: CarWithRelations,
  limit = 3,
): Promise<CarWithRelations[]> {
  return prisma.car.findMany({
    where: {
      id: { not: car.id },
      status: "available",
      OR: [{ make: car.make }, { bodyType: car.bodyType }],
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
      features: true,
    },
  });
}

/** Distinct makes/models present in stock — powers filter dropdowns. */
export async function getFilterFacets() {
  const cars = await prisma.car.findMany({
    select: { make: true, model: true },
  });
  const makes = Array.from(new Set(cars.map((c) => c.make))).sort();
  const modelsByMake: Record<string, string[]> = {};
  for (const c of cars) {
    (modelsByMake[c.make] ??= []).push(c.model);
  }
  for (const make of Object.keys(modelsByMake)) {
    modelsByMake[make] = Array.from(new Set(modelsByMake[make])).sort();
  }
  return { makes, modelsByMake };
}
