import {
  FUEL_TYPES,
  COLOURS,
  TRANSMISSIONS,
  BODY_TYPES,
  DOORS,
  SEATS,
} from "./constants";

// ── Number-plate vehicle lookup ──────────────────────────────────────────────
// Primary source: a paid commercial provider (UK Vehicle Data) which returns the
// full taxonomy — make, model, variant/derivative, body shape, transmission,
// doors, seats, colour, fuel, engine (like AutoTrader).
//   Sign up: https://ukvehicledata.co.uk/  → set UKVD_API_KEY (+ UKVD_PACKAGE).
// Optional free supplement: DVLA VES + DVSA MOT History fill any gaps (esp. the
// MOT expiry → months remaining) if their keys are also configured.
// With no keys at all we return clearly-labelled demo data so the feature is
// visible immediately; it goes live the moment a real key is added.

export interface VehicleLookupResult {
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  colour?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  doors?: number;
  seats?: number;
  engineSize?: string;
  previousOwners?: number;
  insuranceGroup?: number;
  bootSpace?: number;
  taxPerYear?: number;
  motMonths?: number;
  // Emissions & tax banding
  co2Emissions?: number;
  taxBand?: string;
  // Fuel economy (mpg)
  mpgUrban?: number;
  mpgExtraUrban?: number;
  mpgCombined?: number;
  // Performance
  powerBhp?: number;
  torqueNm?: number;
  topSpeedMph?: number;
  zeroToSixty?: number;
  // Drivetrain
  gears?: number;
  driveType?: string;
  drivingAxle?: string;
  // Dimensions (mm) & capacity
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  wheelbaseMm?: number;
  fuelTankCapacity?: number;
}

export interface LookupResponse {
  found: boolean;
  data: VehicleLookupResult;
  warnings: string[];
  sources: { ukvd: boolean; dvla: boolean; mot: boolean };
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

function toNum(v: unknown): number | undefined {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** Round to a whole number, preserving undefined. */
function rnd(v: number | undefined): number | undefined {
  return v === undefined ? undefined : Math.round(v);
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
  const v = raw.toUpperCase();
  if (v.includes("GREY") || v.includes("GRAY")) return "Grey";
  if (v.includes("SILVER")) return "Silver";
  if (v.includes("BLUE")) return "Blue";
  if (v.includes("BLACK")) return "Black";
  if (v.includes("WHITE")) return "White";
  if (v.includes("RED")) return "Red";
  if (v.includes("GREEN")) return "Green";
  if (v.includes("ORANGE")) return "Orange";
  if (v.includes("YELLOW")) return "Yellow";
  if (v.includes("BROWN") || v.includes("BEIGE")) return "Brown";
  if (v.includes("GOLD")) return "Gold";
  return "Other";
}

/** Provider transmission → Manual | Automatic. */
function mapTransmission(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.toUpperCase();
  if (v.includes("MANUAL")) return "Manual";
  if (v.includes("AUTO") || v.includes("CVT") || v.includes("SEMI") || v.includes("DSG") || v.includes("DCT"))
    return "Automatic";
  const t = titleCase(raw);
  return (TRANSMISSIONS as readonly string[]).includes(t) ? t : undefined;
}

/** Provider body style → one of BODY_TYPES. */
function mapBodyType(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.toUpperCase();
  if (v.includes("HATCH")) return "Hatchback";
  if (v.includes("SALOON") || v.includes("SEDAN")) return "Saloon";
  if (v.includes("ESTATE") || v.includes("TOURING") || v.includes("AVANT") || v.includes("WAGON"))
    return "Estate";
  if (v.includes("SUV") || v.includes("4X4") || v.includes("UTILITY") || v.includes("CROSSOVER"))
    return "SUV";
  if (v.includes("COUPE")) return "Coupe";
  if (v.includes("CONVERT") || v.includes("CABRIO") || v.includes("ROADSTER") || v.includes("SPIDER"))
    return "Convertible";
  if (v.includes("MPV") || v.includes("PEOPLE") || v.includes("TOURER") || v.includes("VAN"))
    return "MPV";
  if (v.includes("PICK")) return "Pickup";
  return undefined;
}

function mapDoors(n?: number): number | undefined {
  return n && (DOORS as readonly number[]).includes(n) ? n : undefined;
}

function mapSeats(n?: number): number | undefined {
  return n && (SEATS as readonly number[]).includes(n) ? n : undefined;
}

/** Engine capacity in cc → e.g. "2.0L". */
function ccToLitres(cc?: number): string | undefined {
  if (!cc || cc <= 0) return undefined;
  return `${(cc / 1000).toFixed(1)}L`;
}

// ── Defensive object search ──────────────────────────────────────────────────
// VDG's response nests spec data under known parents (Performance, Dimensions,
// BodyDetails…) but the exact leaf key names vary by package. Rather than
// hard-code paths that might silently miss, we scope to the right parent object
// and find the first key that matches a pattern. Wrong guesses just leave a
// field blank (admin fills it in), never throw.
function deepFindNum(obj: Record<string, any>, re: RegExp): number | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj)) {
    if (re.test(k)) {
      const n = toNum(v);
      if (n !== undefined) return n;
    }
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") {
      const found = deepFindNum(v, re);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function deepFindStr(obj: Record<string, any>, re: RegExp): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj)) {
    if (re.test(k) && typeof v === "string" && v.trim() !== "") return v.trim();
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") {
      const found = deepFindStr(v, re);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

/** First immediate child object whose key matches `re`. */
function childObj(
  obj: Record<string, any>,
  re: RegExp,
): Record<string, any> | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj)) {
    if (re.test(k) && v && typeof v === "object") {
      return v as Record<string, any>;
    }
  }
  return undefined;
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

// ── Vehicle Data Global (paid, full taxonomy) ────────────────────────────────
// GET https://uk.api.vehicledataglobal.com/r2/lookup?ApiKey=..&PackageName=..&Vrm=..
async function fetchUkvd(
  reg: string,
  warnings: string[],
): Promise<Partial<VehicleLookupResult> | null> {
  const key = process.env.UKVD_API_KEY;
  if (!key) return null;
  const pkg = process.env.UKVD_PACKAGE || "VehicleDetails";
  try {
    const url =
      `https://uk.api.vehicledataglobal.com/r2/lookup` +
      `?ApiKey=${encodeURIComponent(key)}` +
      `&PackageName=${encodeURIComponent(pkg)}` +
      `&Vrm=${encodeURIComponent(reg)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (res.status !== 200) {
      warnings.push(`Vehicle data lookup failed (${res.status}).`);
      return null;
    }
    const json = (await res.json()) as Record<string, any>;
    const info = json?.ResponseInformation ?? {};
    if (!info.IsSuccessStatusCode) {
      // 2 NoResults, 14 NoSearchTerm, 25 NoDvlaData, 26 NoMatch → treat as "not found"
      if ([2, 14, 25, 26].includes(info.StatusCode)) return null;
      warnings.push(`Vehicle data: ${info.StatusMessage || "lookup unsuccessful"}.`);
      return null;
    }

    const results = json?.Results ?? {};
    const vd = results.VehicleDetails ?? {};
    const vi = vd.VehicleIdentification ?? {};
    const hist = vd.VehicleHistory ?? {};
    const dvlaTech = vd.DvlaTechnicalDetails ?? {};
    const ved = vd.VehicleStatus?.VehicleExciseDutyDetails?.VedRate?.Standard ?? {};

    const md = results.ModelDetails ?? {};
    const mi = md.ModelIdentification ?? {};
    const body = md.BodyDetails ?? {};
    const power = md.Powertrain ?? {};
    const ice = power.IceDetails ?? {};
    const trans = power.Transmission ?? {};
    const perf = md.Performance ?? {};
    const dims = md.Dimensions ?? {};
    const ved2 = vd.VehicleStatus?.VehicleExciseDutyDetails ?? {};

    // Spec groups — searched defensively (leaf names vary by package).
    const fuelEco = childObj(perf, /fueleconomy|economy|mpg/i) ?? perf;
    const stats = childObj(perf, /statistic|performance/i) ?? perf;
    const mph = childObj(stats, /^mph$|milesperhour/i) ?? stats;
    const torque = childObj(perf, /torque/i) ?? perf;

    const litres = toNum(ice.EngineCapacityLitres);
    const engineSize =
      litres !== undefined
        ? `${litres.toFixed(1)}L`
        : ccToLitres(toNum(ice.EngineCapacityCc ?? dvlaTech.EngineCapacityCc));

    const keepers = Array.isArray(hist.KeeperChangeList)
      ? hist.KeeperChangeList
      : [];
    const tax = toNum(ved.TwelveMonths);

    return {
      make:
        mi.Make || vi.DvlaMake ? titleCase(mi.Make || vi.DvlaMake) : undefined,
      model:
        mi.Range || mi.Model || vi.DvlaModel
          ? titleCase(mi.Range || mi.Model || vi.DvlaModel)
          : undefined,
      variant: mi.ModelVariant ? titleCase(mi.ModelVariant) : undefined,
      year: toNum(vi.YearOfManufacture),
      colour: mapColour(hist.ColourDetails?.CurrentColour),
      fuelType: mapFuel(power.FuelType || vi.DvlaFuelType),
      transmission: mapTransmission(trans.TransmissionType),
      bodyType: mapBodyType(body.BodyStyle || vi.DvlaBodyType),
      doors: mapDoors(toNum(body.NumberOfDoors)),
      seats: mapSeats(toNum(body.NumberOfSeats ?? dvlaTech.NumberOfSeats)),
      engineSize,
      previousOwners: toNum(keepers[0]?.NumberOfPreviousKeepers),
      taxPerYear: tax !== undefined ? Math.round(tax) : undefined,
      // Emissions & banding
      co2Emissions: deepFindNum(ved2, /co2(?!.*band)|carbondioxide/i),
      taxBand: deepFindStr(ved2, /^dvlaband$|vedband|^band$/i),
      // Fuel economy
      mpgUrban: deepFindNum(fuelEco, /urbancold|(?<!extra)urban|coldstart/i),
      mpgExtraUrban: deepFindNum(fuelEco, /extraurban/i),
      mpgCombined: deepFindNum(fuelEco, /combined/i),
      // Performance
      powerBhp: deepFindNum(power, /bhp|brakehorse|horsepower|maxpower/i),
      torqueNm: rnd(deepFindNum(torque, /^nm$|torquenm|newton/i)),
      topSpeedMph: rnd(deepFindNum(mph, /maxspeed|topspeed/i)),
      zeroToSixty: deepFindNum(mph, /zerotosixty|zeroto60|0to60|sixty/i),
      // Drivetrain
      gears: deepFindNum(trans, /numberofgears|^gears$|gearcount/i),
      driveType: deepFindStr(trans, /drivetype/i),
      drivingAxle: deepFindStr(trans, /drivingaxle|driveaxle/i),
      // Dimensions & capacity
      lengthMm: rnd(deepFindNum(dims, /(?<!wheelbase)length|^length/i)),
      widthMm: rnd(deepFindNum(dims, /width/i)),
      heightMm: rnd(deepFindNum(dims, /height/i)),
      wheelbaseMm: rnd(deepFindNum(dims, /wheelbase/i)),
      fuelTankCapacity: rnd(deepFindNum(body, /fueltank|tankcapacity/i)),
    };
  } catch (e) {
    console.error("VDG lookup error", e);
    warnings.push("Could not reach the vehicle data service.");
    return null;
  }
}

// ── DVLA VES (free, partial) ─────────────────────────────────────────────────
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
    if (res.status === 404) return null;
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

// ── DVSA MOT History (free, adds model) ──────────────────────────────────────
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
      { headers: { Authorization: `Bearer ${token}`, "X-API-Key": key }, cache: "no-store" },
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
      year: v.manufactureYear
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
    process.env.UKVD_API_KEY ||
      process.env.DVLA_VES_API_KEY ||
      process.env.MOT_API_KEY,
  );

  if (!configured) {
    // Rich demo sample so the UI is usable before a key is added.
    return {
      found: true,
      demo: true,
      sources: { ukvd: false, dvla: false, mot: false },
      warnings: [
        "Demo data — add a UK Vehicle Data API key (UKVD_API_KEY) in .env for live lookups.",
      ],
      data: {
        make: "BMW",
        model: "3 Series",
        variant: "320d M Sport",
        year: 2019,
        colour: "Grey",
        fuelType: "Diesel",
        transmission: "Automatic",
        bodyType: "Saloon",
        doors: 4,
        seats: 5,
        engineSize: "2.0L",
        previousOwners: 2,
        taxPerYear: 190,
        co2Emissions: 114,
        taxBand: "C",
        mpgUrban: 56.5,
        mpgExtraUrban: 72.4,
        mpgCombined: 65.7,
        powerBhp: 187,
        torqueNm: 400,
        topSpeedMph: 146,
        zeroToSixty: 7.1,
        gears: 8,
        driveType: "4x2",
        drivingAxle: "Rear",
        lengthMm: 4709,
        widthMm: 1827,
        heightMm: 1442,
        wheelbaseMm: 2851,
        fuelTankCapacity: 59,
      },
    };
  }

  // Paid provider is authoritative; free sources fill any gaps (e.g. MOT months).
  const ukvd = await fetchUkvd(reg, warnings);
  const dvla = process.env.DVLA_VES_API_KEY ? await fetchDvla(reg, warnings) : null;
  const mot = process.env.MOT_API_KEY ? await fetchMot(reg, warnings) : null;

  if (!ukvd && !dvla && !mot) {
    return {
      found: false,
      demo: false,
      sources: { ukvd: false, dvla: false, mot: false },
      warnings:
        warnings.length > 0
          ? warnings
          : ["No vehicle found for that registration."],
      data: {},
    };
  }

  let data: VehicleLookupResult = { ...(ukvd ?? {}) };
  data = fillGaps(data, dvla);
  data = fillGaps(data, mot);

  return {
    found: true,
    demo: false,
    sources: {
      ukvd: Boolean(ukvd),
      dvla: Boolean(dvla),
      mot: Boolean(mot),
    },
    warnings,
    data,
  };
}
