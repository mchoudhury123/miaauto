import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCarById } from "@/lib/cars";
import { validateCarInput } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/cars/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const car = await getCarById(params.id);
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
  return NextResponse.json({ car });
}

// PUT /api/cars/:id — full update (admin only). Replaces images + features.
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const existing = await prisma.car.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    const body = await req.json();
    const { valid, errors, data } = validateCarInput(body);
    if (!valid || !data) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const car = await prisma.car.update({
      where: { id: params.id },
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
        co2Emissions: data.co2Emissions,
        taxBand: data.taxBand,
        mpgUrban: data.mpgUrban,
        mpgExtraUrban: data.mpgExtraUrban,
        mpgCombined: data.mpgCombined,
        powerBhp: data.powerBhp,
        torqueNm: data.torqueNm,
        topSpeedMph: data.topSpeedMph,
        zeroToSixty: data.zeroToSixty,
        gears: data.gears,
        driveType: data.driveType,
        drivingAxle: data.drivingAxle,
        lengthMm: data.lengthMm,
        widthMm: data.widthMm,
        heightMm: data.heightMm,
        wheelbaseMm: data.wheelbaseMm,
        fuelTankCapacity: data.fuelTankCapacity,
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
        // Replace child collections wholesale for a clean, predictable update.
        features: {
          deleteMany: {},
          create: data.features.map((name) => ({ name })),
        },
        images: {
          deleteMany: {},
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

    return NextResponse.json({ car });
  } catch (err) {
    console.error("PUT /api/cars/:id failed", err);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 },
    );
  }
}

// PATCH /api/cars/:id — lightweight updates (e.g. mark sold/featured).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, unknown> = {};
    if (typeof body.status === "string") {
      if (!["available", "reserved", "sold"].includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 422 });
      }
      data.status = body.status;
    }
    if (typeof body.featured === "boolean") data.featured = body.featured;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const car = await prisma.car.update({ where: { id: params.id }, data });
    return NextResponse.json({ car });
  } catch (err) {
    console.error("PATCH /api/cars/:id failed", err);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 },
    );
  }
}

// DELETE /api/cars/:id (admin only).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    // Explicitly detach/remove related rows in one transaction so the delete
    // never fails on a foreign-key constraint (doesn't rely on DB cascade).
    await prisma.$transaction([
      prisma.enquiry.updateMany({
        where: { carId: params.id },
        data: { carId: null },
      }),
      prisma.carImage.deleteMany({ where: { carId: params.id } }),
      prisma.feature.deleteMany({ where: { carId: params.id } }),
      prisma.car.delete({ where: { id: params.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/cars/:id failed", err);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 },
    );
  }
}
