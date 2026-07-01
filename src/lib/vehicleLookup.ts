import { FUEL_TYPES, COLOURS } from "./constants";

// ── Number-plate vehicle lookup ──────────────────────────────────────────────
// Combines two free UK government APIs:
//   1. DVLA Vehicle Enquiry Service (VES) → make, year, fuel, engine cc, colour, MOT expiry
//      Register: https://register-for-ves.driver-vehicle-licensing.api.gov.uk/
//   2. DVSA MOT History API → model (and a fallback for make/fuel/colour)
//      Docs: https://documentation.history.mot.api.gov.uk/
// If no keys are configured we return clearly-labelled demo data so the feature
// is visible immediately; it goes live the moment real keys are added to .env.

export interface VehicleLookupResult {
  make?: string;
  model?: string;
  year?: number;
  fuelType?: string;
  engineSize?: string;
  colour?: string;
  motMonths?: number;
}

export interface LookupResponse {
  found: boolean;
  data: VehicleLookupResult;
  warnings: string[];
  sources: { dvla: boolean; mot: boolean };
  demo: boolean;
}

export function normalisePlate(reg: string): string {
  return reg.replace(/\s+/g, "").toUpperCase();
}

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** Map a provider fuel string to our controlled vocabulary. */
function mapFuel(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.toUpperCase();
  if (v.includes("PLUG")) return "Plug-in Hybrid";
  if (v.includes("HYBRID")) return "Hybrid";
  if (v.includes("ELECTRIC")) return "Electric";
  if (v.includes("DIESEL")) return "Diesel";
  if (v.includes("PETROL") || v.includes("GASOLINE")) return "Petrol";
  const t = titleCase(raw);
  return (FUEL_TYPES as readonly string[]).includes(t) ? t : undefined;
}

/** Map a provider colour to our list, falling back to "Other". */
function mapColour(raw?: string): string | undefined {
  if (!raw) return undefined;
  const t = titleCase(raw);
  if ((COLOURS as readonly string[]).includes(t)) return t;
  // Common DVLA variants
  const v = raw.toUpperCase();
  if (v.includes("GREY") || v.includes("GRAY")) return "Grey";
  if (v.includes("SILVER")) return "Silver";
  if (v.includes("BLUE")) return "Blue";
  if (v.includes("BLACK")) return "Black";
  if (v.includes("WHITE")) return "White";
  if (v.includes("RED")) return "Red";
  if (v.includes("GREEN")) return "Green";
  return "Other";
}

/** Engine capacity in cc → e.g. "2.0L". */
function ccToLitres(cc?: number): string | undefined {
  if (!cc || cc <= 0) return undefined;
  return `${(cc / 1000).toFixed(1)}L`;
}

/** Months remaining until an ISO date (clamped at 0). */
function monthsUntil(dateStr?: string): number | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return undefined;
  const months = Math.round(
    (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30.44),
  );
  return months > 0 ? months : 0;
}

// ── DVLA VES ─────────────────────────────────────────────────────────────────
async function fetchDvla(
  reg: string,
  warnings: string[],
): Promise<Partial<VehicleLookupResult> | null> {
  const key = process.env.DVLA_VES_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      {
        method: "POST",
        headers: { "x-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber: reg }),
        cache: "no-store",
      },
    );
    if (res.status === 404) return null; // not found — let caller decide
    if (!res.ok) {
      warnings.push(`DVLA lookup failed (${res.status}).`);
      return null;
    }
    const v = await res.json();
    return {
      make: v.make ? titleCase(v.make) : undefined,
      year: v.yearOfManufacture ? Number(v.yearOfManufacture) : undefined,
      fuelType: mapFuel(v.fuelType),
      engineSize: ccToLitres(v.engineCapacity),
      colour: mapColour(v.colour),
      motMonths: monthsUntil(v.motExpiryDate),
    };
  } catch (e) {
    console.error("DVLA lookup error", e);
    warnings.push("Could not reach the DVLA service.");
    return null;
  }
}

// ── DVSA MOT History (OAuth2 client credentials) ─────────────────────────────
async function getMotToken(): Promise<string | null> {
  const { MOT_CLIENT_ID, MOT_CLIENT_SECRET, MOT_TOKEN_URL } = process.env;
  const scope = process.env.MOT_SCOPE || "https://tapi.dvsa.gov.uk/.default";
  if (!MOT_CLIENT_ID || !MOT_CLIENT_SECRET || !MOT_TOKEN_URL) return null;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: MOT_CLIENT_ID,
    client_secret: MOT_CLIENT_SECRET,
    scope,
  });
  const res = await fetch(MOT_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.access_token ?? null;
}

async function fetchMot(
  reg: string,
  warnings: string[],
): Promise<Partial<VehicleLookupResult> | null> {
  const key = process.env.MOT_API_KEY;
  if (!key) return null;
  try {
    const token = await getMotToken();
    if (!token) {
      warnings.push("MOT service not configured correctly.");
      return null;
    }
    const res = await fetch(
      `https://history.mot.api.gov.uk/v1/trade/vehicles/registration/${encodeURIComponent(
        reg,
      )}`,
      {
        headers: { Authorization: `Bearer ${token}`, "X-API-Key": key },
        cache: "no-store",
      },
    );
    if (res.status === 404) return null;
    if (!res.ok) {
      warnings.push(`MOT lookup failed (${res.status}).`);
      return null;
    }
    const data = await res.json();
    const v = Array.isArray(data) ? data[0] : data;
    if (!v) return null;
    const firstUsed: string | undefined = v.firstUsedDate || v.registrationDate;
    return {
      make: v.make ? titleCase(v.make) : undefined,
      model: v.model ? titleCase(v.model) : undefined,
      fuelType: mapFuel(v.fuelType),
      colour: mapColour(v.primaryColour),
      year:
        v.manufactureYear
          ? Number(v.manufactureYear)
          : firstUsed
            ? new Date(firstUsed).getFullYear()
            : undefined,
    };
  } catch (e) {
    console.error("MOT lookup error", e);
    warnings.push("Could not reach the MOT service.");
    return null;
  }
}

/** Merge b into a, only filling fields a is missing. */
function fillGaps(
  a: VehicleLookupResult,
  b: Partial<VehicleLookupResult> | null,
): VehicleLookupResult {
  if (!b) return a;
  const out = { ...a };
  (Object.keys(b) as (keyof VehicleLookupResult)[]).forEach((k) => {
    if (out[k] === undefined && b[k] !== undefined) {
      // @ts-expect-error index assignment across union is safe here
      out[k] = b[k];
    }
  });
  return out;
}

export async function lookupVehicle(rawReg: string): Promise<LookupResponse> {
  const reg = normalisePlate(rawReg);
  const warnings: string[] = [];

  const configured = Boolean(
    process.env.DVLA_VES_API_KEY || process.env.MOT_API_KEY,
  );

  if (!configured) {
    // Demo fallback so the UI is usable before keys are added.
    return {
      found: true,
      demo: true,
      sources: { dvla: false, mot: false },
      warnings: [
        "Demo data — add DVLA / MOT API keys to .env for live lookups.",
      ],
      data: {
        make: "Volkswagen",
        model: "Golf",
        year: 2019,
        fuelType: "Petrol",
        engineSize: "1.5L",
        colour: "Grey",
        motMonths: 8,
      },
    };
  }

  // DVLA is authoritative for make/year/fuel/engine/colour; MOT adds the model.
  const dvla = await fetchDvla(reg, warnings);
  const mot = await fetchMot(reg, warnings);

  if (!dvla && !mot) {
    return {
      found: false,
      demo: false,
      sources: { dvla: false, mot: false },
      warnings:
        warnings.length > 0
          ? warnings
          : ["No vehicle found for that registration."],
      data: {},
    };
  }

  let data: VehicleLookupResult = { ...(dvla ?? {}) };
  data = fillGaps(data, mot); // model + any DVLA gaps

  return {
    found: true,
    demo: false,
    sources: { dvla: Boolean(dvla), mot: Boolean(mot) },
    warnings,
    data,
  };
}
