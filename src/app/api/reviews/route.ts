import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateReviewInput } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/reviews — published reviews (public). Admin sees all with ?all=1.
export async function GET(req: NextRequest) {
  const wantAll = req.nextUrl.searchParams.get("all") === "1";
  const admin = wantAll && (await isAuthenticated());
  const reviews = await prisma.review.findMany({
    where: admin ? {} : { published: true },
    orderBy: [{ reviewedAt: "desc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json({ reviews });
}

// POST /api/reviews — add a review transcribed from AutoTrader/Instagram/etc.
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const { valid, errors, data } = validateReviewInput(await req.json());
    if (!valid || !data) {
      return NextResponse.json({ errors }, { status: 422 });
    }
    const { images, ...fields } = data;
    const review = await prisma.review.create({
      data: { ...fields, images: { create: images } },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews failed", err);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 },
    );
  }
}
