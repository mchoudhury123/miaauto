"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Trash2,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  X,
  Check,
} from "lucide-react";
import ImageUploader, { type FormImage } from "./ImageUploader";
import { REVIEW_SOURCES } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

export type AdminReview = {
  id: string;
  author: string;
  source: string;
  rating: number;
  body: string;
  carBought: string | null;
  reviewedAt: string | null;
  published: boolean;
  showSource: boolean;
  createdAt: string;
  images: { id: string; url: string; alt: string | null }[];
};

type FormValues = {
  author: string;
  source: string;
  showSource: boolean;
  rating: number;
  body: string;
  carBought: string;
  reviewedAt: string;
  images: FormImage[];
};

const EMPTY: FormValues = {
  author: "",
  source: REVIEW_SOURCES[0],
  showSource: true,
  rating: 5,
  body: "",
  carBought: "",
  reviewedAt: "",
  images: [],
};

function toFormValues(r: AdminReview): FormValues {
  return {
    author: r.author,
    source: r.source,
    showSource: r.showSource,
    rating: r.rating,
    body: r.body,
    carBought: r.carBought ?? "",
    // <input type="date"> wants YYYY-MM-DD.
    reviewedAt: r.reviewedAt ? r.reviewedAt.slice(0, 10) : "",
    images: r.images.map((i) => ({ url: i.url, isMain: false, alt: i.alt })),
  };
}

export default function ReviewManager({ initial }: { initial: AdminReview[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  /** Shared by add and edit; returns field errors, or null on success. */
  async function submit(
    url: string,
    method: "POST" | "PUT",
    values: FormValues,
  ): Promise<Record<string, string> | null> {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.status === 422) {
      const { errors } = await res.json();
      return errors || { body: "Please check the fields above." };
    }
    if (!res.ok) return { body: "Could not save. Please try again." };

    const { review } = await res.json();
    setReviews((rs) =>
      method === "POST"
        ? [review, ...rs]
        : rs.map((r) => (r.id === review.id ? review : r)),
    );
    router.refresh();
    return null;
  }

  async function patchReview(id: string, patch: Partial<AdminReview>) {
    setBusy(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setReviews((rs) =>
          rs.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        );
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review permanently? This cannot be undone."))
      return;
    setBusy(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((rs) => rs.filter((r) => r.id !== id));
        router.refresh();
      } else {
        alert("Could not delete that review. Please try again.");
      }
    } catch {
      alert("Network error while deleting. Please check your connection.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <ReviewForm
        key="add"
        title="Add a review"
        description="Copy the wording across from AutoTrader, Instagram or wherever the customer left it."
        submitLabel="Add review"
        resetOnSuccess
        onSubmit={(v) => submit("/api/reviews", "POST", v)}
      />

      <div>
        <h2 className="mb-3 font-semibold text-ink-900">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </h2>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-14 text-center">
            <p className="text-ink-500">No reviews yet.</p>
            <p className="mt-1 text-sm text-ink-400">
              Added reviews appear on the homepage straight away.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) =>
              editing === r.id ? (
                <li key={r.id}>
                  <ReviewForm
                    title="Edit review"
                    description="Changes go live on the homepage as soon as you save."
                    submitLabel="Save changes"
                    initialValues={toFormValues(r)}
                    onCancel={() => setEditing(null)}
                    onSubmit={async (v) => {
                      const errs = await submit(
                        `/api/reviews/${r.id}`,
                        "PUT",
                        v,
                      );
                      if (!errs) setEditing(null);
                      return errs;
                    }}
                  />
                </li>
              ) : (
                <li
                  key={r.id}
                  className={cn(
                    "rounded-2xl border border-ink-100 bg-white p-5",
                    !r.published && "opacity-60",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Stars n={r.rating} />
                        <button
                          onClick={() =>
                            patchReview(r.id, { showSource: !r.showSource })
                          }
                          title={
                            r.showSource
                              ? "Source is shown on the website — click to hide it"
                              : "Source is hidden on the website — click to show it"
                          }
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition",
                            r.showSource
                              ? "bg-ink-100 text-ink-600 hover:bg-ink-200"
                              : "bg-ink-50 text-ink-400 line-through hover:bg-ink-100",
                          )}
                        >
                          {r.showSource ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                          {r.source}
                        </button>
                        {!r.published && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-2 font-semibold text-ink-900">
                        {r.author}
                        {r.carBought && (
                          <span className="font-normal text-ink-500">
                            {" "}
                            — {r.carBought}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-ink-400">
                        {formatDate(r.reviewedAt ?? r.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {busy === r.id ? (
                        <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
                      ) : (
                        <>
                          <button
                            onClick={() => setEditing(r.id)}
                            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                            aria-label="Edit review"
                            title="Edit review"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              patchReview(r.id, { published: !r.published })
                            }
                            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                            aria-label={
                              r.published
                                ? "Hide from website"
                                : "Show on website"
                            }
                            title={
                              r.published
                                ? "Hide from website"
                                : "Show on website"
                            }
                          >
                            {r.published ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => remove(r.id)}
                            className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Delete review"
                            title="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
                    {r.body}
                  </p>

                  {r.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.images.map((img) => (
                        <a
                          key={img.id}
                          href={img.url}
                          target="_blank"
                          rel="noreferrer"
                          className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink-200 bg-ink-900"
                          title="Open full size"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt || `Picture from ${r.author}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

/** The add and edit forms are the same fields, so they share one component. */
function ReviewForm({
  title,
  description,
  submitLabel,
  initialValues,
  onSubmit,
  onCancel,
  resetOnSuccess,
}: {
  title: string;
  description: string;
  submitLabel: string;
  initialValues?: FormValues;
  onSubmit: (v: FormValues) => Promise<Record<string, string> | null>;
  onCancel?: () => void;
  resetOnSuccess?: boolean;
}) {
  const [form, setForm] = useState<FormValues>(initialValues ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const errs = await onSubmit(form);
      if (errs) setErrors(errs);
      else if (resetOnSuccess) setForm(EMPTY);
    } catch {
      setErrors({ body: "Network error — please check your connection." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6"
    >
      <h2 className="font-semibold text-ink-900">{title}</h2>
      <p className="mt-1 text-sm text-ink-500">{description}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Reviewer name" error={errors.author}>
          <input
            className="input"
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            placeholder="e.g. Daniel R."
          />
        </Field>
        <Field label="Source" error={errors.source}>
          <select
            className="input"
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
          >
            {REVIEW_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <SourceToggle
            on={form.showSource}
            onClick={() => set("showSource", !form.showSource)}
          />
        </Field>
        <Field label="Rating" error={errors.rating}>
          <StarPicker value={form.rating} onChange={(v) => set("rating", v)} />
        </Field>
        <Field label="Car bought (optional)" error={errors.carBought}>
          <input
            className="input"
            value={form.carBought}
            onChange={(e) => set("carBought", e.target.value)}
            placeholder="e.g. BMW 3 Series"
          />
        </Field>
        <Field label="Date left (optional)" error={errors.reviewedAt}>
          <input
            type="date"
            className="input"
            value={form.reviewedAt}
            onChange={(e) => set("reviewedAt", e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Review" error={errors.body}>
          <textarea
            className="input min-h-[110px] resize-y"
            value={form.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder="Paste or type what the customer wrote…"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Pictures (optional)" error={errors.images}>
          <p className="mb-2 text-xs text-ink-400">
            A screenshot of the original review, or photos the customer sent in.
            These show under the review on the homepage.
          </p>
          <ImageUploader
            images={form.images}
            onChange={(imgs) => set("images", imgs)}
            allowMain={false}
            label="Click to upload pictures"
          />
        </Field>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : resetOnSuccess ? (
            <Plus className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-600 hover:bg-ink-100 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

/** Controls whether "via AutoTrader" appears under the review on the website. */
function SourceToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="mt-2 flex items-center gap-2 text-xs font-medium text-ink-500 hover:text-ink-900"
    >
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition",
          on ? "bg-green-500" : "bg-ink-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            on ? "left-[1.125rem]" : "left-0.5",
          )}
        />
      </span>
      {on ? "Shown on the website" : "Hidden on the website"}
    </button>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-green-600" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < n ? "fill-current" : "text-ink-200")}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex h-[46px] items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded p-1 text-green-600 hover:scale-110"
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              n <= value ? "fill-current" : "text-ink-200",
            )}
          />
        </button>
      ))}
    </div>
  );
}
