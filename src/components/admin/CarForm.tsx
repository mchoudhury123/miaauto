"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, Plus, X, ArrowLeft } from "lucide-react";
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

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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
