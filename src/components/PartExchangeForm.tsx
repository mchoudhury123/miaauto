"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

type Form = {
  name: string;
  email: string;
  phone: string;
  regPlate: string;
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  finance: string;
  interestedIn: string;
  notes: string;
};

const EMPTY: Form = {
  name: "",
  email: "",
  phone: "",
  regPlate: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  condition: "",
  finance: "",
  interestedIn: "",
  notes: "",
};

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
const FINANCE = ["No outstanding finance", "Yes — finance outstanding", "Not sure"];

type Errors = Partial<Record<keyof Form, string>>;

export default function PartExchangeForm({
  carId,
  carTitle,
  compact = false,
}: {
  carId?: string;
  carTitle?: string;
  compact?: boolean;
}) {
  const [form, setForm] = useState<Form>(() => ({
    ...EMPTY,
    interestedIn: carTitle ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const gridCls = compact ? "mt-3 grid gap-4" : "mt-3 grid gap-4 sm:grid-cols-2";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const set =
    (field: keyof Form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate(): boolean {
    const err: Errors = {};
    if (!form.name.trim()) err.name = "Please enter your name";
    if (!form.email.trim()) err.email = "Please enter your email";
    else if (!isValidEmail(form.email)) err.email = "Enter a valid email";
    if (!form.phone.trim()) err.phone = "Please enter your phone number";
    else if (form.phone.replace(/\D/g, "").length < 7)
      err.phone = "Enter a valid phone number";
    if (!form.make.trim()) err.make = "Required";
    if (!form.model.trim()) err.model = "Required";
    if (!form.year.trim()) err.year = "Required";
    if (!form.mileage.trim()) err.mileage = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function buildMessage(): string {
    const lines = [
      "PART-EXCHANGE ENQUIRY",
      "",
      "Vehicle offered:",
      `• Make / Model: ${form.make} ${form.model}`,
      `• Year: ${form.year}`,
      `• Mileage: ${Number(form.mileage).toLocaleString()} miles`,
      form.regPlate ? `• Registration: ${form.regPlate.toUpperCase()}` : null,
      form.condition ? `• Condition: ${form.condition}` : null,
      form.finance ? `• Finance: ${form.finance}` : null,
      form.interestedIn ? `• Interested in: ${form.interestedIn}` : null,
      form.notes ? "" : null,
      form.notes ? `Notes: ${form.notes}` : null,
    ];
    return lines.filter((l) => l !== null).join("\n");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: buildMessage(),
          carId,
        }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setServerError(data.error || "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h3 className="font-display text-2xl font-semibold text-ink-950">
          Thanks, {form.name.split(" ")[0] || "there"}!
        </h3>
        <p className="max-w-md text-sm text-ink-600">
          We&apos;ve received your part-exchange details and will be in touch
          shortly with a valuation. Keep an eye on your phone and email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Your car */}
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-950">
          Your car
        </h3>
        <div className={gridCls}>
          <Field label="Registration" hint="optional">
            <input
              className="input uppercase"
              value={form.regPlate}
              onChange={set("regPlate")}
              placeholder="AB18 CDE"
            />
          </Field>
          <Field label="Mileage" error={errors.mileage} required>
            <input
              type="number"
              min={0}
              className="input"
              value={form.mileage}
              onChange={set("mileage")}
              placeholder="e.g. 45000"
            />
          </Field>
          <Field label="Make" error={errors.make} required>
            <input
              className="input"
              value={form.make}
              onChange={set("make")}
              placeholder="e.g. BMW"
            />
          </Field>
          <Field label="Model" error={errors.model} required>
            <input
              className="input"
              value={form.model}
              onChange={set("model")}
              placeholder="e.g. 3 Series"
            />
          </Field>
          <Field label="Year" error={errors.year} required>
            <input
              type="number"
              className="input"
              value={form.year}
              onChange={set("year")}
              placeholder="e.g. 2018"
            />
          </Field>
          <Field label="Condition" hint="optional">
            <select
              className="input"
              value={form.condition}
              onChange={set("condition")}
            >
              <option value="">Select condition</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Outstanding finance?" hint="optional" className="sm:col-span-2">
            <select
              className="input"
              value={form.finance}
              onChange={set("finance")}
            >
              <option value="">Select</option>
              {FINANCE.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Optional target car */}
      <Field
        label="Car you're interested in"
        hint="optional — which of our cars would you part-exchange against?"
      >
        <input
          className="input"
          value={form.interestedIn}
          onChange={set("interestedIn")}
          placeholder="e.g. the 2021 BMW 5 Series, or 'just selling'"
        />
      </Field>

      {/* Your details */}
      <div>
        <h3 className="font-display text-lg font-semibold text-ink-950">
          Your details
        </h3>
        <div className={gridCls}>
          <Field label="Your name" error={errors.name} required>
            <input
              className="input"
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Smith"
              autoComplete="name"
            />
          </Field>
          <Field label="Phone" error={errors.phone} required>
            <input
              type="tel"
              className="input"
              value={form.phone}
              onChange={set("phone")}
              placeholder="07000 000000"
              autoComplete="tel"
            />
          </Field>
          <Field label="Email" error={errors.email} required className="sm:col-span-2">
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={set("email")}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </Field>
        </div>
      </div>

      <Field label="Anything else?" hint="optional">
        <textarea
          className="input min-h-[90px] resize-y"
          value={form.notes}
          onChange={set("notes")}
          placeholder="Service history, extras, condition notes…"
        />
      </Field>

      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Get my valuation"
        )}
      </button>
      <p className="text-center text-xs text-ink-400">
        We&apos;ll only use your details to prepare your valuation and get back
        to you.
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="label">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && !required && (
          <span className="ml-1 font-normal normal-case tracking-normal text-ink-400">
            ({hint})
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
