"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Detail = { label: string; value: string };
type Group = { title: string; items: Detail[] };

function DetailGrid({ items }: { items: Detail[] }) {
  return (
    <dl className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink-100 sm:grid-cols-2">
      {items.map((d, i) => (
        <div
          key={d.label}
          className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
            i % 2 === 0 ? "bg-cream-100/60" : "bg-white"
          }`}
        >
          <dt className="text-ink-400">{d.label}</dt>
          <dd className="text-right font-semibold text-ink-950">{d.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function FullVehicleDetails({
  primary,
  groups,
}: {
  primary: Detail[];
  groups: Group[];
}) {
  const [open, setOpen] = useState(false);
  const hasMore = groups.some((g) => g.items.length > 0);

  return (
    <div>
      <DetailGrid items={primary} />

      {hasMore && (
        <>
          {open && (
            <div className="mt-6 space-y-6">
              {groups
                .filter((g) => g.items.length > 0)
                .map((g) => (
                  <div key={g.title}>
                    <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-ink-500">
                      {g.title}
                    </h3>
                    <DetailGrid items={g.items} />
                  </div>
                ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 transition hover:border-green-500 hover:text-green-700"
          >
            {open ? "Show less" : "Show all details"}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </>
      )}
    </div>
  );
}
