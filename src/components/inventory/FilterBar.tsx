"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  COLOURS,
  DOORS,
  SEATS,
  SORT_OPTIONS,
} from "@/lib/constants";
import type { Filters } from "./FilterControls";

const YEARS = Array.from({ length: 26 }, (_, i) => new Date().getFullYear() - i);

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  makes: string[];
  models: string[];
  activeCount: number;
}

/** Desktop catalogue-style filter bar that sits across the top. */
export default function FilterBar({
  filters,
  setFilters,
  makes,
  models,
  activeCount,
}: Props) {
  const [open, setOpen] = useState(false);

  const set = (key: keyof Filters, value: string) =>
    setFilters((f) => {
      const next = { ...f, [key]: value };
      if (key === "make") next.model = "";
      return next;
    });

  return (
    <div className="rounded-2xl border border-ink-100 bg-white/80 shadow-luxe-sm backdrop-blur-xl">
      {/* Primary row */}
      <div className="flex flex-wrap items-end gap-3 p-4">
        <Field label="Search" className="min-w-[180px] flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-9"
              placeholder="Search make, model…"
              value={filters.q ?? ""}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
        </Field>

        <Field label="Make" className="w-40">
          <select
            className="input"
            value={filters.make}
            onChange={(e) => set("make", e.target.value)}
          >
            <option value="">Any make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Model" className="w-40">
          {models.length > 0 ? (
            <select
              className="input"
              value={filters.model}
              onChange={(e) => set("model", e.target.value)}
            >
              <option value="">Any model</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="input"
              placeholder="Any model"
              value={filters.model}
              onChange={(e) => set("model", e.target.value)}
            />
          )}
        </Field>

        <Field label="Min price" className="w-32">
          <input
            type="number"
            min={0}
            className="input"
            placeholder="£ min"
            value={filters.priceMin}
            onChange={(e) => set("priceMin", e.target.value)}
          />
        </Field>

        <Field label="Max price" className="w-32">
          <input
            type="number"
            min={0}
            className="input"
            placeholder="£ max"
            value={filters.priceMax}
            onChange={(e) => set("priceMax", e.target.value)}
          />
        </Field>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "btn-outline h-[42px] shrink-0",
            open && "border-ink-900 bg-ink-950 text-cream-50",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          All filters
          {activeCount > 0 && (
            <span className="ml-0.5 rounded-full bg-green-500 px-1.5 text-xs font-bold text-ink-950">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>

        <Field label="Sort" className="w-44">
          <select
            className="input"
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Advanced panel */}
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="grid grid-cols-2 gap-4 border-t border-ink-100 p-4 md:grid-cols-3 lg:grid-cols-4">
            <Field label="Model variant">
              <input
                className="input"
                placeholder="e.g. M Sport"
                value={filters.variant}
                onChange={(e) => set("variant", e.target.value)}
              />
            </Field>
            <Field label="Year from">
              <select
                className="input"
                value={filters.yearMin}
                onChange={(e) => set("yearMin", e.target.value)}
              >
                <option value="">Any</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Year to">
              <select
                className="input"
                value={filters.yearMax}
                onChange={(e) => set("yearMax", e.target.value)}
              >
                <option value="">Any</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Max mileage">
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 60000"
                value={filters.mileageMax}
                onChange={(e) => set("mileageMax", e.target.value)}
              />
            </Field>
            <Field label="Fuel">
              <select
                className="input"
                value={filters.fuelType}
                onChange={(e) => set("fuelType", e.target.value)}
              >
                <option value="">Any fuel</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Transmission">
              <select
                className="input"
                value={filters.transmission}
                onChange={(e) => set("transmission", e.target.value)}
              >
                <option value="">Any</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Body type">
              <select
                className="input"
                value={filters.bodyType}
                onChange={(e) => set("bodyType", e.target.value)}
              >
                <option value="">Any body</option>
                {BODY_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Colour">
              <select
                className="input"
                value={filters.colour}
                onChange={(e) => set("colour", e.target.value)}
              >
                <option value="">Any colour</option>
                {COLOURS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Doors">
              <select
                className="input"
                value={filters.doors}
                onChange={(e) => set("doors", e.target.value)}
              >
                <option value="">Any</option>
                {DOORS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Seats">
              <select
                className="input"
                value={filters.seats}
                onChange={(e) => set("seats", e.target.value)}
              >
                <option value="">Any</option>
                {SEATS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Engine size">
              <input
                className="input"
                placeholder="e.g. 2.0"
                value={filters.engineSize}
                onChange={(e) => set("engineSize", e.target.value)}
              />
            </Field>
            <Field label="Max road tax (£/yr)">
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 180"
                value={filters.taxMax}
                onChange={(e) => set("taxMax", e.target.value)}
              />
            </Field>
            <Field label="Max insurance group">
              <input
                type="number"
                min={1}
                max={50}
                className="input"
                placeholder="1–50"
                value={filters.insMax}
                onChange={(e) => set("insMax", e.target.value)}
              />
            </Field>
            <Field label="Min boot space (L)">
              <input
                type="number"
                min={0}
                className="input"
                placeholder="e.g. 300"
                value={filters.bootMin}
                onChange={(e) => set("bootMin", e.target.value)}
              />
            </Field>
            <Field label="Availability">
              <select
                className="input"
                value={filters.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="available">Available only</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="all">Show all</option>
              </select>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}
