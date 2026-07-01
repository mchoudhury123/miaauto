import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { lookupVehicle, normalisePlate } from "@/lib/vehicleLookup";

export const dynamic = "force-dynamic";

// POST /api/admin/lookup  { reg: "AB18CDE" }  → vehicle details (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { reg?: string };
    const reg = normalisePlate(body.reg ?? "");
    if (reg.length < 2 || reg.length > 8) {
      return NextResponse.json(
        { error: "Please enter a valid registration." },
        { status: 400 },
      );
    }
    const result = await lookupVehicle(reg);
    if (!result.found) {
      return NextResponse.json(
        { error: result.warnings[0] || "No vehicle found.", warnings: result.warnings },
        { status: 404 },
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/admin/lookup failed", err);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}
