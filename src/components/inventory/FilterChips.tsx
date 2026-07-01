"use client";

import { X } from "lucide-react";
import type { Filters } from "./FilterControls";

const LABELS: Partial<Record<keyof Filters, string>> = {
  make: "Make",
  model: "Model",
  variant: "Variant",
  yearMin: "From",
  yearMax: "To",
  mileageMax: "Max miles",
  priceMin: "Min",
  priceMax: "Max",
  fuelType: "Fuel",
  transmission: "Gearbox",
  bodyType: "Body",
  colour: "Colour",
  doors: "Doors",
  seats: "Seats",
  engineSize: "Engine",
  taxMax: "Max tax",
  insMax: "Max ins.",
  bootMin: "Min boot",
  status: "Status",
};

function display(key: keyof Filters, value: string): string {
  if (key === "priceMin" || key === "priceMax")
    return `£${Number(value).toLocaleString()}`;
  if (key === "taxMax") return `£${Number(value).toLocaleString()}/yr`;
  if (key === "mileageMax") return `${Number(value).toLocaleString()} mi`;
  if (key === "bootMin") return `${Number(value).toLocaleString()} L`;
  if (key === "status") return value === "all" ? "All statuses" : value;
  return value;
}

/** Removable chips for every applied filter. */
export default function FilterChips({
  filters,
  onRemove,
  onClear,
}: {
  filters: Filters;
  onRemove: (key: keyof Filters) => void;
  onClear: () => void;
}) {
  const active = (Object.keys(LABELS) as (keyof Filters)[]).filter((k) => {
    if (k === "status") return filters.status && filters.status !== "available";
    return Boolean(filters[k]);
  });

  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {active.map((k) => (
        <button
          key={k}
          onClick={() => onRemove(k)}
          className="group inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-ink-700 transition hover:border-ink-900 hover:bg-ink-950 hover:text-cream-50"
        >
          <span className="text-ink-400 group-hover:text-cream-200">
            {LABELS[k]}:
          </span>
          {display(k, filters[k]!)}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        onClick={onClear}
        className="text-xs font-semibold uppercase tracking-wide text-green-700 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
