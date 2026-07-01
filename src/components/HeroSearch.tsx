"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { POPULAR_MAKES } from "@/lib/constants";

const PRICE_STEPS = [5000, 10000, 15000, 20000, 30000, 50000, 75000, 100000];
const YEARS = Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - i);
const MILEAGE_STEPS = [10000, 25000, 50000, 75000, 100000];

/** Compact search bar shown in the hero — submits to /inventory with params. */
export default function HeroSearch({ makes }: { makes: string[] }) {
  const router = useRouter();
  const [v, setV] = useState({
    make: "",
    model: "",
    priceMax: "",
    yearMin: "",
    mileageMax: "",
  });

  const allMakes = Array.from(
    new Set([...makes, ...POPULAR_MAKES]),
  ).sort();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(v).forEach(([k, val]) => val && params.set(k, val));
    router.push(`/inventory?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-luxe backdrop-blur-2xl md:grid-cols-6 md:p-5"
    >
      <Field label="Make" className="col-span-1 md:col-span-1">
        <select
          className="input"
          value={v.make}
          onChange={(e) => setV({ ...v, make: e.target.value })}
        >
          <option value="">Any make</option>
          {allMakes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Model" className="col-span-1">
        <input
          className="input"
          placeholder="Any model"
          value={v.model}
          onChange={(e) => setV({ ...v, model: e.target.value })}
        />
      </Field>

      <Field label="Max price" className="col-span-1">
        <select
          className="input"
          value={v.priceMax}
          onChange={(e) => setV({ ...v, priceMax: e.target.value })}
        >
          <option value="">No max</option>
          {PRICE_STEPS.map((p) => (
            <option key={p} value={p}>
              £{p.toLocaleString()}
            </option>
          ))}
        </select>
      </Field>

      <Field label="From year" className="col-span-1">
        <select
          className="input"
          value={v.yearMin}
          onChange={(e) => setV({ ...v, yearMin: e.target.value })}
        >
          <option value="">Any year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Max mileage" className="col-span-1">
        <select
          className="input"
          value={v.mileageMax}
          onChange={(e) => setV({ ...v, mileageMax: e.target.value })}
        >
          <option value="">No max</option>
          {MILEAGE_STEPS.map((m) => (
            <option key={m} value={m}>
              {m.toLocaleString()} mi
            </option>
          ))}
        </select>
      </Field>

      <div className="col-span-2 flex items-end md:col-span-1">
        <button type="submit" className="btn-primary h-[46px] w-full">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-cream-100/80">
        {label}
      </span>
      {children}
    </div>
  );
}
