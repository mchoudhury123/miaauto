import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateReviewInput } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT /api/reviews/:id — full update (admin only). Replaces images.
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const existing = await prisma.review.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const { valid, errors, data } = validateReviewInput(await req.json());
    if (!valid || !data) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const { images, ...fields } = data;
    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        ...fields,
        // Replace the image set wholesale for a predictable update.
        images: { deleteMany: {}, create: images },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json({ review });
  } catch (err) {
    console.error("PUT /api/reviews/:id failed", err);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// PATCH /api/reviews/:id — show/hide the review or its source (admin only).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const data: Record<string, boolean> = {};
    if (typeof body.published === "boolean") data.published = body.published;
    if (typeof body.showSource === "boolean") data.showSource = body.showSource;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    const review = await prisma.review.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ review });
  } catch (err) {
    console.error("PATCH /api/reviews/:id failed", err);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/:id (admin only).
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    // Remove images explicitly so the delete never trips a foreign-key
    // constraint, matching how cars are deleted.
    await prisma.$transaction([
      prisma.reviewImage.deleteMany({ where: { reviewId: params.id } }),
      prisma.review.delete({ where: { id: params.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/reviews/:id failed", err);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 },
    );
  }
}
