import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PATCH /api/enquiries/:id — update status (new | read | archived).
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = (await req.json()) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status : "";
  if (!["new", "read", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }
  const enquiry = await prisma.enquiry.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json({ enquiry });
}

// DELETE /api/enquiries/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  await prisma.enquiry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
