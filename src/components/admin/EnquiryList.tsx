"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Car,
  Trash2,
  Check,
  Archive,
  Inbox,
  Loader2,
} from "lucide-react";
import { cn, formatDate, mailtoUrl } from "@/lib/utils";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  car: { make: string; model: string; year: number } | null;
};

export default function EnquiryList({ initial }: { initial: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initial);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">(
    "all",
  );
  const [busy, setBusy] = useState<string | null>(null);

  async function update(id: string, status: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok)
        setEnquiries((es) =>
          es.map((e) => (e.id === id ? { ...e, status } : e)),
        );
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this enquiry?")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (res.ok) setEnquiries((es) => es.filter((e) => e.id !== id));
    } finally {
      setBusy(null);
    }
  }

  const filtered =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    read: enquiries.filter((e) => e.status === "read").length,
    archived: enquiries.filter((e) => e.status === "archived").length,
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "new", "read", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition",
              filter === f
                ? "bg-ink-900 text-white"
                : "bg-ink-100 text-ink-600 hover:bg-ink-200",
            )}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
          <Inbox className="h-10 w-10 text-ink-300" />
          <p className="mt-3 text-ink-500">No enquiries here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <article
              key={e.id}
              className={cn(
                "rounded-2xl border bg-white p-5 transition",
                e.status === "new"
                  ? "border-gold-300 shadow-sm"
                  : "border-ink-100",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-ink-900">{e.name}</h3>
                    {e.status === "new" && (
                      <span className="badge bg-gold-500 text-ink-900">New</span>
                    )}
                    {e.status === "archived" && (
                      <span className="badge bg-ink-100 text-ink-500">
                        Archived
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
                    <a
                      href={mailtoUrl()}
                      className="flex items-center gap-1.5 hover:text-gold-600"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {e.email}
                    </a>
                    {e.phone && (
                      <a
                        href={`tel:${e.phone}`}
                        className="flex items-center gap-1.5 hover:text-gold-600"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {e.phone}
                      </a>
                    )}
                    {e.car && (
                      <span className="flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5" />
                        {e.car.year} {e.car.make} {e.car.model}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-ink-400">
                  {formatDate(e.createdAt)}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-line rounded-lg bg-ink-50 p-3 text-sm text-ink-700">
                {e.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {busy === e.id ? (
                  <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
                ) : (
                  <>
                    <a
                      href={mailtoUrl(`Re: your enquiry to MIA Automotive`)}
                      className="btn-dark px-3 py-1.5 text-xs"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      Reply
                    </a>
                    {e.status !== "read" && (
                      <button
                        onClick={() => update(e.id, "read")}
                        className="btn-outline px-3 py-1.5 text-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Mark read
                      </button>
                    )}
                    {e.status !== "archived" && (
                      <button
                        onClick={() => update(e.id, "archived")}
                        className="btn-ghost px-3 py-1.5 text-xs"
                      >
                        <Archive className="h-3.5 w-3.5" />
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => remove(e.id)}
                      className="btn-ghost px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
