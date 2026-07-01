"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface EnquiryFormProps {
  carId?: string;
  carTitle?: string;
  compact?: boolean;
}

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message", string>
>;

export default function EnquiryForm({
  carId,
  carTitle,
  compact = false,
}: EnquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: carTitle
      ? `Hi, I'm interested in the ${carTitle}. Please get in touch.`
      : "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [serverError, setServerError] = useState("");

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    setServerError("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, carId }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setServerError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
        <h3 className="text-lg font-bold text-ink-900">Enquiry sent</h3>
        <p className="text-sm text-ink-600">
          Thanks {form.name.split(" ")[0] || "there"} — we&apos;ve received your
          message and will be in touch very shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className="label" htmlFor="ef-name">
            Your name
          </label>
          <input
            id="ef-name"
            className="input"
            value={form.name}
            onChange={update("name")}
            placeholder="Jane Smith"
            autoComplete="name"
          />
          {errors.name && <FieldError msg={errors.name} />}
        </div>
        <div>
          <label className="label" htmlFor="ef-email">
            Email
          </label>
          <input
            id="ef-email"
            type="email"
            className="input"
            value={form.email}
            onChange={update("email")}
            placeholder="jane@example.com"
            autoComplete="email"
          />
          {errors.email && <FieldError msg={errors.email} />}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="ef-phone">
          Phone
        </label>
        <input
          id="ef-phone"
          type="tel"
          className="input"
          value={form.phone}
          onChange={update("phone")}
          placeholder="07000 000000"
          autoComplete="tel"
        />
        {errors.phone && <FieldError msg={errors.phone} />}
        <p className="mt-1 text-xs text-ink-400">
          We&apos;ll give you a quick call to discuss the car.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="ef-message">
          Message
        </label>
        <textarea
          id="ef-message"
          className="input min-h-[120px] resize-y"
          value={form.message}
          onChange={update("message")}
          placeholder="Let us know how we can help…"
        />
        {errors.message && <FieldError msg={errors.message} />}
      </div>

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
          "Send enquiry"
        )}
      </button>
      <p className="text-center text-xs text-ink-400">
        We&apos;ll only use your details to respond to this enquiry.
      </p>
    </form>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1 text-xs font-medium text-red-600">{msg}</p>;
}
