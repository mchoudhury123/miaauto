"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Plus,
  X,
  ArrowLeft,
  Search,
  Check,
} from "lucide-react";
import ImageUploader, { type FormImage } from "./ImageUploader";
import {
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  COLOURS,
  DOORS,
  SEATS,
  SERVICE_HISTORY,
  CAR_STATUS,
  STATUS_LABELS,
  POPULAR_MAKES,
} from "@/lib/constants";
import type { CarWithRelations } from "@/lib/types";

type FormState = {
  make: string;
  model: string;
  variant: string;
  year: string;
  regYear: string;
  mileage: string;
  price: string;
  doors: string;
  seats: string;
  previousOwners: string;
  bootSpace: string;
  taxPerYear: string;
  insuranceGroup: string;
  co2Emissions: string;
  taxBand: string;
  mpgUrban: string;
  mpgExtraUrban: string;
  mpgCombined: string;
  powerBhp: string;
  torqueNm: string;
  topSpeedMph: string;
  zeroToSixty: string;
  gears: string;
  driveType: string;
  drivingAxle: string;
  lengthMm: string;
  widthMm: string;
  heightMm: string;
  wheelbaseMm: string;
  fuelTankCapacity: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  colour: string;
  engineSize: string;
  ulez: boolean;
  motMonths: string;
  serviceHistory: string;
  description: string;
  conditionNotes: string;
  status: string;
  featured: boolean;
};

function initialState(car?: CarWithRelations): FormState {
  return {
    make: car?.make ?? "",
    model: car?.model ?? "",
    variant: car?.variant ?? "",
    year: car ? String(car.year) : String(new Date().getFullYear()),
    regYear: car?.regYear ?? "",
    mileage: car ? String(car.mileage) : "",
    price: car ? String(car.price) : "",
    doors: car?.doors ? String(car.doors) : "",
    seats: car?.seats ? String(car.seats) : "",
    previousOwners: car?.previousOwners != null ? String(car.previousOwners) : "",
    bootSpace: car?.bootSpace != null ? String(car.bootSpace) : "",
    taxPerYear: car?.taxPerYear != null ? String(car.taxPerYear) : "",
    insuranceGroup: car?.insuranceGroup != null ? String(car.insuranceGroup) : "",
    co2Emissions: car?.co2Emissions != null ? String(car.co2Emissions) : "",
    taxBand: car?.taxBand ?? "",
    mpgUrban: car?.mpgUrban != null ? String(car.mpgUrban) : "",
    mpgExtraUrban: car?.mpgExtraUrban != null ? String(car.mpgExtraUrban) : "",
    mpgCombined: car?.mpgCombined != null ? String(car.mpgCombined) : "",
    powerBhp: car?.powerBhp != null ? String(car.powerBhp) : "",
    torqueNm: car?.torqueNm != null ? String(car.torqueNm) : "",
    topSpeedMph: car?.topSpeedMph != null ? String(car.topSpeedMph) : "",
    zeroToSixty: car?.zeroToSixty != null ? String(car.zeroToSixty) : "",
    gears: car?.gears != null ? String(car.gears) : "",
    driveType: car?.driveType ?? "",
    drivingAxle: car?.drivingAxle ?? "",
    lengthMm: car?.lengthMm != null ? String(car.lengthMm) : "",
    widthMm: car?.widthMm != null ? String(car.widthMm) : "",
    heightMm: car?.heightMm != null ? String(car.heightMm) : "",
    wheelbaseMm: car?.wheelbaseMm != null ? String(car.wheelbaseMm) : "",
    fuelTankCapacity: car?.fuelTankCapacity != null ? String(car.fuelTankCapacity) : "",
    fuelType: car?.fuelType ?? "Petrol",
    transmission: car?.transmission ?? "Manual",
    bodyType: car?.bodyType ?? "Hatchback",
    colour: car?.colour ?? "Black",
    engineSize: car?.engineSize ?? "",
    ulez: car?.ulez ?? true,
    motMonths: car?.motMonths != null ? String(car.motMonths) : "",
    serviceHistory: car?.serviceHistory ?? "",
    description: car?.description ?? "",
    conditionNotes: car?.conditionNotes ?? "",
    status: car?.status ?? "available",
    featured: car?.featured ?? false,
  };
}

export default function CarForm({
  car,
  makes = [],
}: {
  car?: CarWithRelations;
  makes?: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(car);

  // Suggest makes already in the database first, then common UK makes.
  const makeSuggestions = Array.from(
    new Set([...makes, ...POPULAR_MAKES]),
  ).sort();

  const [form, setForm] = useState<FormState>(() => initialState(car));
  const [features, setFeatures] = useState<string[]>(
    car?.features.map((f) => f.name) ?? [],
  );
  const [featureInput, setFeatureInput] = useState("");
  const [images, setImages] = useState<FormImage[]>(
    car?.images.map((i) => ({ url: i.url, isMain: i.isMain, alt: i.alt })) ?? [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Number-plate lookup ──
  const [reg, setReg] = useState(car?.regYear ?? "");
  const [lookupState, setLookupState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [lookupMsg, setLookupMsg] = useState("");
  const [lookupWarnings, setLookupWarnings] = useState<string[]>([]);
  const [filled, setFilled] = useState<string[]>([]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function runLookup() {
    const plate = reg.trim();
    if (!plate) return;
    setLookupState("loading");
    setLookupMsg("");
    setLookupWarnings([]);
    setFilled([]);
    try {
      const res = await fetch("/api/admin/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg: plate }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLookupState("error");
        setLookupMsg(json.error || "No vehicle found for that registration.");
        return;
      }
      const d = json.data as {
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
        co2Emissions?: number;
        taxBand?: string;
        mpgUrban?: number;
        mpgExtraUrban?: number;
        mpgCombined?: number;
        powerBhp?: number;
        torqueNm?: number;
        topSpeedMph?: number;
        zeroToSixty?: number;
        gears?: number;
        driveType?: string;
        drivingAxle?: string;
        lengthMm?: number;
        widthMm?: number;
        heightMm?: number;
        wheelbaseMm?: number;
        fuelTankCapacity?: number;
      };
      const got: string[] = [];
      setForm((f) => {
        const next = { ...f, regYear: plate.toUpperCase() };
        const fillStr = (key: keyof FormState, val: string | undefined, label: string) => {
          if (val) {
            (next[key] as string) = val;
            got.push(label);
          }
        };
        const fillNum = (
          key: keyof FormState,
          val: number | undefined,
          label: string,
        ) => {
          if (val !== undefined && val !== null) {
            (next[key] as string) = String(val);
            got.push(label);
          }
        };
        fillStr("make", d.make, "Make");
        fillStr("model", d.model, "Model");
        fillStr("variant", d.variant, "Variant");
        fillNum("year", d.year, "Year");
        fillStr("colour", d.colour, "Colour");
        fillStr("fuelType", d.fuelType, "Fuel");
        fillStr("transmission", d.transmission, "Gearbox");
        fillStr("bodyType", d.bodyType, "Body");
        fillNum("doors", d.doors, "Doors");
        fillNum("seats", d.seats, "Seats");
        fillStr("engineSize", d.engineSize, "Engine");
        fillNum("previousOwners", d.previousOwners, "Owners");
        fillNum("insuranceGroup", d.insuranceGroup, "Insurance");
        fillNum("bootSpace", d.bootSpace, "Boot");
        fillNum("taxPerYear", d.taxPerYear, "Tax");
        fillNum("motMonths", d.motMonths, "MOT");
        fillNum("co2Emissions", d.co2Emissions, "CO₂");
        fillStr("taxBand", d.taxBand, "Tax band");
        fillNum("mpgUrban", d.mpgUrban, "MPG urban");
        fillNum("mpgExtraUrban", d.mpgExtraUrban, "MPG extra-urban");
        fillNum("mpgCombined", d.mpgCombined, "MPG combined");
        fillNum("powerBhp", d.powerBhp, "Power");
        fillNum("torqueNm", d.torqueNm, "Torque");
        fillNum("topSpeedMph", d.topSpeedMph, "Top speed");
        fillNum("zeroToSixty", d.zeroToSixty, "0–60");
        fillNum("gears", d.gears, "Gears");
        fillStr("driveType", d.driveType, "Drive type");
        fillStr("drivingAxle", d.drivingAxle, "Driving axle");
        fillNum("lengthMm", d.lengthMm, "Length");
        fillNum("widthMm", d.widthMm, "Width");
        fillNum("heightMm", d.heightMm, "Height");
        fillNum("wheelbaseMm", d.wheelbaseMm, "Wheelbase");
        fillNum("fuelTankCapacity", d.fuelTankCapacity, "Fuel tank");
        return next;
      });
      setFilled(got);
      setLookupWarnings(json.warnings || []);
      setLookupState("done");
      setLookupMsg(
        got.length > 0
          ? `Found it — auto-filled ${got.length} field${got.length === 1 ? "" : "s"}. Add the mileage, price and photos to finish.`
          : "Vehicle found, but no details could be auto-filled.",
      );
    } catch {
      setLookupState("error");
      setLookupMsg("Lookup failed. Please try again.");
    }
  }

  function addFeature() {
    const v = featureInput.trim();
    if (v && !features.includes(v)) setFeatures((f) => [...f, v]);
    setFeatureInput("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setServerError("");

    const payload = {
      ...form,
      year: Number(form.year),
      mileage: Number(form.mileage),
      price: Number(form.price),
      doors: form.doors ? Number(form.doors) : null,
      seats: form.seats ? Number(form.seats) : null,
      previousOwners: form.previousOwners ? Number(form.previousOwners) : null,
      bootSpace: form.bootSpace ? Number(form.bootSpace) : null,
      taxPerYear: form.taxPerYear ? Number(form.taxPerYear) : null,
      insuranceGroup: form.insuranceGroup ? Number(form.insuranceGroup) : null,
      motMonths: form.motMonths ? Number(form.motMonths) : null,
      co2Emissions: form.co2Emissions ? Number(form.co2Emissions) : null,
      taxBand: form.taxBand || null,
      mpgUrban: form.mpgUrban ? Number(form.mpgUrban) : null,
      mpgExtraUrban: form.mpgExtraUrban ? Number(form.mpgExtraUrban) : null,
      mpgCombined: form.mpgCombined ? Number(form.mpgCombined) : null,
      powerBhp: form.powerBhp ? Number(form.powerBhp) : null,
      torqueNm: form.torqueNm ? Number(form.torqueNm) : null,
      topSpeedMph: form.topSpeedMph ? Number(form.topSpeedMph) : null,
      zeroToSixty: form.zeroToSixty ? Number(form.zeroToSixty) : null,
      gears: form.gears ? Number(form.gears) : null,
      driveType: form.driveType || null,
      drivingAxle: form.drivingAxle || null,
      lengthMm: form.lengthMm ? Number(form.lengthMm) : null,
      widthMm: form.widthMm ? Number(form.widthMm) : null,
      heightMm: form.heightMm ? Number(form.heightMm) : null,
      wheelbaseMm: form.wheelbaseMm ? Number(form.wheelbaseMm) : null,
      fuelTankCapacity: form.fuelTankCapacity ? Number(form.fuelTankCapacity) : null,
      features,
      images: images.map((img, i) => ({ ...img, order: i })),
    };

    try {
      const res = await fetch(
        isEdit ? `/api/cars/${car!.id}` : "/api/cars",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setServerError(data.error || "Failed to save. Please try again.");
      }
    } catch {
      setServerError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink-500 hover:text-green-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">
            {isEdit ? "Edit car" : "Add new car"}
          </h1>
        </div>
      </div>

      {/* Quick add by registration */}
      <section className="rounded-2xl border border-green-300 bg-green-50/60 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-green-700" />
          <h2 className="text-base font-bold text-ink-900">
            Quick add by registration
          </h2>
        </div>
        <p className="mt-1 text-sm text-ink-500">
          Enter the number plate and we&apos;ll auto-fill the make, model,
          variant, body, colour, fuel, gearbox, doors, seats, engine and MOT.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 overflow-hidden rounded-lg border-2 border-ink-900 shadow-sm sm:max-w-xs">
            <span className="flex w-9 items-center justify-center bg-[#0a3aa3] text-[10px] font-bold text-white">
              GB
            </span>
            <input
              value={reg}
              onChange={(e) => setReg(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  runLookup();
                }
              }}
              placeholder="AB18 CDE"
              className="w-full bg-[#fcd932] px-3 py-2.5 text-center text-lg font-bold uppercase tracking-widest text-ink-950 placeholder:text-ink-700/50 focus:outline-none"
              aria-label="Number plate"
            />
          </div>
          <button
            type="button"
            onClick={runLookup}
            disabled={lookupState === "loading" || !reg.trim()}
            className="btn-dark shrink-0"
          >
            {lookupState === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Looking up…
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Look up
              </>
            )}
          </button>
        </div>

        {lookupState === "done" && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{lookupMsg}</p>
              {filled.length > 0 && (
                <p className="mt-1 text-xs text-emerald-700">
                  Filled: {filled.join(", ")}.
                </p>
              )}
            </div>
          </div>
        )}
        {lookupState === "error" && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {lookupMsg}
          </div>
        )}
        {lookupWarnings.length > 0 && (
          <div className="mt-2 space-y-1">
            {lookupWarnings.map((w, i) => (
              <p
                key={i}
                className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {w}
              </p>
            ))}
          </div>
        )}
      </section>

      {serverError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}
      {Object.keys(errors).length > 0 && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Please fix the highlighted fields below.
        </div>
      )}

      {/* Identity */}
      <Card title="Vehicle">
        <Grid>
          <FieldWrap label="Make" error={errors.make} required>
            <input
              className="input"
              list="makes"
              value={form.make}
              onChange={(e) => set("make", e.target.value)}
              placeholder="e.g. BMW"
            />
            <datalist id="makes">
              {makeSuggestions.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </FieldWrap>
          <FieldWrap label="Model" error={errors.model} required>
            <input
              className="input"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              placeholder="e.g. 3 Series"
            />
          </FieldWrap>
          <FieldWrap label="Variant" error={errors.variant}>
            <input
              className="input"
              value={form.variant}
              onChange={(e) => set("variant", e.target.value)}
              placeholder="e.g. M Sport"
            />
          </FieldWrap>
          <FieldWrap label="Year" error={errors.year} required>
            <input
              type="number"
              className="input"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
            />
          </FieldWrap>
          <FieldWrap label="Registration / plate" error={errors.regYear}>
            <input
              className="input"
              value={form.regYear}
              onChange={(e) => set("regYear", e.target.value)}
              placeholder="e.g. 21 or AB21 XYZ"
            />
          </FieldWrap>
          <FieldWrap label="Engine size" error={errors.engineSize}>
            <input
              className="input"
              value={form.engineSize}
              onChange={(e) => set("engineSize", e.target.value)}
              placeholder="e.g. 2.0L"
            />
          </FieldWrap>
        </Grid>
      </Card>

      {/* Numbers + specs */}
      <Card title="Specification">
        <Grid>
          <FieldWrap label="Mileage" error={errors.mileage} required>
            <input
              type="number"
              className="input"
              value={form.mileage}
              onChange={(e) => set("mileage", e.target.value)}
              placeholder="e.g. 35000"
            />
          </FieldWrap>
          <FieldWrap label="Price (£)" error={errors.price} required>
            <input
              type="number"
              className="input"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="e.g. 18995"
            />
          </FieldWrap>
          <FieldWrap label="Fuel type" error={errors.fuelType} required>
            <Select
              value={form.fuelType}
              onChange={(v) => set("fuelType", v)}
              options={FUEL_TYPES}
            />
          </FieldWrap>
          <FieldWrap label="Transmission" error={errors.transmission} required>
            <Select
              value={form.transmission}
              onChange={(v) => set("transmission", v)}
              options={TRANSMISSIONS}
            />
          </FieldWrap>
          <FieldWrap label="Body type" error={errors.bodyType} required>
            <Select
              value={form.bodyType}
              onChange={(v) => set("bodyType", v)}
              options={BODY_TYPES}
            />
          </FieldWrap>
          <FieldWrap label="Colour" error={errors.colour} required>
            <Select
              value={form.colour}
              onChange={(v) => set("colour", v)}
              options={COLOURS}
            />
          </FieldWrap>
          <FieldWrap label="Doors" error={errors.doors}>
            <Select
              value={form.doors}
              onChange={(v) => set("doors", v)}
              options={DOORS.map(String)}
              placeholder="Select"
            />
          </FieldWrap>
          <FieldWrap label="Seats" error={errors.seats}>
            <Select
              value={form.seats}
              onChange={(v) => set("seats", v)}
              options={SEATS.map(String)}
              placeholder="Select"
            />
          </FieldWrap>
          <FieldWrap label="Previous owners" error={errors.previousOwners}>
            <input
              type="number"
              className="input"
              value={form.previousOwners}
              onChange={(e) => set("previousOwners", e.target.value)}
              placeholder="e.g. 2"
            />
          </FieldWrap>
        </Grid>
      </Card>

      {/* Compliance / history / running costs */}
      <Card title="History, running costs & compliance">
        <Grid>
          <FieldWrap label="MOT remaining (months)" error={errors.motMonths}>
            <input
              type="number"
              className="input"
              value={form.motMonths}
              onChange={(e) => set("motMonths", e.target.value)}
              placeholder="e.g. 11"
            />
          </FieldWrap>
          <FieldWrap label="Service history" error={errors.serviceHistory}>
            <Select
              value={form.serviceHistory}
              onChange={(v) => set("serviceHistory", v)}
              options={SERVICE_HISTORY}
              placeholder="Select"
            />
          </FieldWrap>
          <FieldWrap label="Road tax (£/year)" error={errors.taxPerYear}>
            <input
              type="number"
              className="input"
              value={form.taxPerYear}
              onChange={(e) => set("taxPerYear", e.target.value)}
              placeholder="e.g. 180"
            />
          </FieldWrap>
          <FieldWrap label="Insurance group (1–50)" error={errors.insuranceGroup}>
            <input
              type="number"
              min={1}
              max={50}
              className="input"
              value={form.insuranceGroup}
              onChange={(e) => set("insuranceGroup", e.target.value)}
              placeholder="e.g. 21"
            />
          </FieldWrap>
          <FieldWrap label="Boot space (litres)" error={errors.bootSpace}>
            <input
              type="number"
              className="input"
              value={form.bootSpace}
              onChange={(e) => set("bootSpace", e.target.value)}
              placeholder="e.g. 480"
            />
          </FieldWrap>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.ulez}
                onChange={(e) => set("ulez", e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-ink-700">
                ULEZ compliant
              </span>
            </label>
          </div>
        </Grid>
      </Card>

      {/* Performance & economy */}
      <Card title="Performance & economy">
        <Grid>
          <FieldWrap label="Power (bhp)" error={errors.powerBhp}>
            <input
              type="number"
              className="input"
              value={form.powerBhp}
              onChange={(e) => set("powerBhp", e.target.value)}
              placeholder="e.g. 187"
            />
          </FieldWrap>
          <FieldWrap label="Torque (Nm)" error={errors.torqueNm}>
            <input
              type="number"
              className="input"
              value={form.torqueNm}
              onChange={(e) => set("torqueNm", e.target.value)}
              placeholder="e.g. 400"
            />
          </FieldWrap>
          <FieldWrap label="0–60 mph (seconds)" error={errors.zeroToSixty}>
            <input
              type="number"
              step="0.1"
              className="input"
              value={form.zeroToSixty}
              onChange={(e) => set("zeroToSixty", e.target.value)}
              placeholder="e.g. 7.1"
            />
          </FieldWrap>
          <FieldWrap label="Top speed (mph)" error={errors.topSpeedMph}>
            <input
              type="number"
              className="input"
              value={form.topSpeedMph}
              onChange={(e) => set("topSpeedMph", e.target.value)}
              placeholder="e.g. 146"
            />
          </FieldWrap>
          <FieldWrap label="MPG (combined)" error={errors.mpgCombined}>
            <input
              type="number"
              step="0.1"
              className="input"
              value={form.mpgCombined}
              onChange={(e) => set("mpgCombined", e.target.value)}
              placeholder="e.g. 65.7"
            />
          </FieldWrap>
          <FieldWrap label="MPG (urban)" error={errors.mpgUrban}>
            <input
              type="number"
              step="0.1"
              className="input"
              value={form.mpgUrban}
              onChange={(e) => set("mpgUrban", e.target.value)}
              placeholder="e.g. 56.5"
            />
          </FieldWrap>
          <FieldWrap label="MPG (extra-urban)" error={errors.mpgExtraUrban}>
            <input
              type="number"
              step="0.1"
              className="input"
              value={form.mpgExtraUrban}
              onChange={(e) => set("mpgExtraUrban", e.target.value)}
              placeholder="e.g. 72.4"
            />
          </FieldWrap>
          <FieldWrap label="CO₂ emissions (g/km)" error={errors.co2Emissions}>
            <input
              type="number"
              className="input"
              value={form.co2Emissions}
              onChange={(e) => set("co2Emissions", e.target.value)}
              placeholder="e.g. 114"
            />
          </FieldWrap>
          <FieldWrap label="Tax band" error={errors.taxBand}>
            <input
              className="input"
              value={form.taxBand}
              onChange={(e) => set("taxBand", e.target.value)}
              placeholder="e.g. C"
            />
          </FieldWrap>
        </Grid>
      </Card>

      {/* Dimensions & drivetrain */}
      <Card title="Dimensions & drivetrain">
        <Grid>
          <FieldWrap label="Gears" error={errors.gears}>
            <input
              type="number"
              className="input"
              value={form.gears}
              onChange={(e) => set("gears", e.target.value)}
              placeholder="e.g. 6"
            />
          </FieldWrap>
          <FieldWrap label="Drive type" error={errors.driveType}>
            <input
              className="input"
              value={form.driveType}
              onChange={(e) => set("driveType", e.target.value)}
              placeholder="e.g. 4x2"
            />
          </FieldWrap>
          <FieldWrap label="Driving axle" error={errors.drivingAxle}>
            <input
              className="input"
              value={form.drivingAxle}
              onChange={(e) => set("drivingAxle", e.target.value)}
              placeholder="e.g. Front"
            />
          </FieldWrap>
          <FieldWrap label="Length (mm)" error={errors.lengthMm}>
            <input
              type="number"
              className="input"
              value={form.lengthMm}
              onChange={(e) => set("lengthMm", e.target.value)}
              placeholder="e.g. 4830"
            />
          </FieldWrap>
          <FieldWrap label="Width (mm)" error={errors.widthMm}>
            <input
              type="number"
              className="input"
              value={form.widthMm}
              onChange={(e) => set("widthMm", e.target.value)}
              placeholder="e.g. 2078"
            />
          </FieldWrap>
          <FieldWrap label="Height (mm)" error={errors.heightMm}>
            <input
              type="number"
              className="input"
              value={form.heightMm}
              onChange={(e) => set("heightMm", e.target.value)}
              placeholder="e.g. 1512"
            />
          </FieldWrap>
          <FieldWrap label="Wheelbase (mm)" error={errors.wheelbaseMm}>
            <input
              type="number"
              className="input"
              value={form.wheelbaseMm}
              onChange={(e) => set("wheelbaseMm", e.target.value)}
              placeholder="e.g. 2850"
            />
          </FieldWrap>
          <FieldWrap label="Fuel tank (litres)" error={errors.fuelTankCapacity}>
            <input
              type="number"
              className="input"
              value={form.fuelTankCapacity}
              onChange={(e) => set("fuelTankCapacity", e.target.value)}
              placeholder="e.g. 70"
            />
          </FieldWrap>
        </Grid>
      </Card>

      {/* Copy */}
      <Card title="Description & notes">
        <FieldWrap label="Description" error={errors.description}>
          <textarea
            className="input min-h-[120px] resize-y"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the car, its history and what makes it stand out…"
          />
        </FieldWrap>
        <div className="mt-4">
          <FieldWrap label="Condition notes" error={errors.conditionNotes}>
            <textarea
              className="input min-h-[90px] resize-y"
              value={form.conditionNotes}
              onChange={(e) => set("conditionNotes", e.target.value)}
              placeholder="Any marks, wear or things a buyer should know…"
            />
          </FieldWrap>
        </div>
      </Card>

      {/* Features */}
      <Card title="Features">
        <div className="flex gap-2">
          <input
            className="input"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="e.g. Apple CarPlay, Heated seats…"
          />
          <button type="button" onClick={addFeature} className="btn-dark shrink-0">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
        {features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 py-1 pl-3 pr-1.5 text-sm text-ink-700"
              >
                {f}
                <button
                  type="button"
                  onClick={() =>
                    setFeatures((fs) => fs.filter((x) => x !== f))
                  }
                  className="rounded-full p-0.5 hover:bg-ink-200"
                  aria-label={`Remove ${f}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Images */}
      <Card title="Images">
        <ImageUploader images={images} onChange={setImages} />
      </Card>

      {/* Status / featured */}
      <Card title="Listing status">
        <Grid>
          <FieldWrap label="Status" error={errors.status} required>
            <Select
              value={form.status}
              onChange={(v) => set("status", v)}
              options={CAR_STATUS.map((s) => s)}
              render={(s) => STATUS_LABELS[s as keyof typeof STATUS_LABELS] ?? s}
            />
          </FieldWrap>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 rounded border-ink-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-ink-700">
                Feature on homepage
              </span>
            </label>
          </div>
        </Grid>
      </Card>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-ink-100 bg-white/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <Link href="/admin" className="btn-outline">
          Cancel
        </Link>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Add car"
          )}
        </button>
      </div>
    </form>
  );
}

/* ---- small presentational helpers ---- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-base font-bold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function FieldWrap({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  render,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  render?: (v: string) => string;
}) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {render ? render(o) : o}
        </option>
      ))}
    </select>
  );
}
