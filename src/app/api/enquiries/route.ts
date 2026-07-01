import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { isValidEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

// POST /api/enquiries — public enquiry submission.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const carId = typeof body.carId === "string" ? body.carId : null;

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Please enter your name";
    if (!email) errors.email = "Please enter your email";
    else if (!isValidEmail(email)) errors.email = "Please enter a valid email";
    if (!phone) errors.phone = "Please enter your phone number";
    else if (phone.replace(/\D/g, "").length < 7)
      errors.phone = "Please enter a valid phone number";
    if (!message) errors.message = "Please enter a message";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    // Only attach a valid, existing car.
    let validCarId: string | null = null;
    if (carId) {
      const car = await prisma.car.findUnique({ where: { id: carId } });
      validCarId = car ? car.id : null;
    }

    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone: phone || null, message, carId: validCarId },
    });

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (err) {
    console.error("POST /api/enquiries failed", err);
    return NextResponse.json(
      { error: "Failed to send enquiry" },
      { status: 500 },
    );
  }
}

// GET /api/enquiries — admin list.
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { car: { select: { make: true, model: true, year: true } } },
  });
  return NextResponse.json({ enquiries });
}
