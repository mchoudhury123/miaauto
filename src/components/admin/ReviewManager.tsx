"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, Loader2, Plus, Eye, EyeOff } from "lucide-react";
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
  createdAt: string;
};

const EMPTY = {
  author: "",
  source: REVIEW_SOURCES[0] as string,
  rating: 5,
  body: "",
  carBought: "",
  reviewedAt: "",
};

export default function ReviewManager({ initial }: { initial: AdminReview[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 422) {
        const { errors: fieldErrors } = await res.json();
        setErrors(fieldErrors || {});
        return;
      }
      if (!res.ok) {
        setErrors({ body: "Could not save that review. Please try again." });
        return;
      }
      const { review } = await res.json();
      setReviews((rs) => [review, ...rs]);
      setForm(EMPTY);
      router.refresh();
    } catch {
      setErrors({ body: "Network error — please check your connection." });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(r: AdminReview) {
    setBusy(r.id);
    try {
      const res = await fetch(`/api/reviews/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !r.published }),
      });
      if (res.ok) {
        setReviews((rs) =>
          rs.map((x) =>
            x.id === r.id ? { ...x, published: !r.published } : x,
          ),
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
      {/* Add form */}
      <form
        onSubmit={add}
        className="rounded-2xl border border-ink-100 bg-white p-5 sm:p-6"
      >
        <h2 className="font-semibold text-ink-900">Add a review</h2>
        <p className="mt-1 text-sm text-ink-500">
          Copy the wording across from AutoTrader, Instagram or wherever the
          customer left it.
        </p>

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
          </Field>
          <Field label="Rating" error={errors.rating}>
            <StarPicker
              value={form.rating}
              onChange={(v) => set("rating", v)}
            />
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

        <button
          type="submit"
          disabled={saving}
          className="btn-primary mt-5 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Add review"}
        </button>
      </form>

      {/* List */}
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
            {reviews.map((r) => (
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
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                        {r.source}
                      </span>
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
                          onClick={() => togglePublished(r)}
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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
