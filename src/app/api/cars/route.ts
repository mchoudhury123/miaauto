import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCars, parseFilters } from "@/lib/cars";
import { validateCarInput } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/cars?make=BMW&priceMax=20000&sort=price-asc...
export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const filters = parseFilters(params);
    const cars = await getCars(filters);
    return NextResponse.json({ cars, count: cars.length });
  } catch (err) {
    console.error("GET /api/cars failed", err);
    return NextResponse.json(
      { error: "Failed to load cars" },
      { status: 500 },
    );
  }
}

// POST /api/cars — create a car (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { valid, errors, data } = validateCarInput(body);
    if (!valid || !data) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const car = await prisma.car.create({
      data: {
        make: data.make,
        model: data.model,
        variant: data.variant,
        year: data.year,
        regYear: data.regYear,
        mileage: data.mileage,
        price: data.price,
        doors: data.doors,
        seats: data.seats,
        previousOwners: data.previousOwners,
        bootSpace: data.bootSpace,
        taxPerYear: data.taxPerYear,
        insuranceGroup: data.insuranceGroup,
        fuelType: data.fuelType,
        transmission: data.transmission,
        bodyType: data.bodyType,
        colour: data.colour,
        engineSize: data.engineSize,
        ulez: data.ulez,
        motMonths: data.motMonths,
        serviceHistory: data.serviceHistory,
        description: data.description,
        conditionNotes: data.conditionNotes,
        status: data.status,
        featured: data.featured,
        features: { create: data.features.map((name) => ({ name })) },
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            isMain: img.isMain,
            order: img.order ?? i,
          })),
        },
      },
      include: { images: true, features: true },
    });

    return NextResponse.json({ car }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cars failed", err);
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 },
    );
  }
}
