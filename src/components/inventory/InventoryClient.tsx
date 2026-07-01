"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, AlertCircle, SearchX } from "lucide-react";
import CarCard from "@/components/CarCard";
import CarCardSkeleton from "@/components/CarCardSkeleton";
import FilterControls, { type Filters, emptyFilters } from "./FilterControls";
import FilterBar from "./FilterBar";
import FilterChips from "./FilterChips";
import { SORT_OPTIONS } from "@/lib/constants";
import type { CarWithRelations } from "@/lib/types";

interface Props {
  makes: string[];
  modelsByMake: Record<string, string[]>;
}

function filtersFromParams(sp: URLSearchParams): Filters {
  const get = (k: string) => sp.get(k) ?? "";
  return {
    make: get("make"),
    model: get("model"),
    variant: get("variant"),
    yearMin: get("yearMin"),
    yearMax: get("yearMax"),
    mileageMax: get("mileageMax"),
    priceMin: get("priceMin"),
    priceMax: get("priceMax"),
    fuelType: get("fuelType"),
    transmission: get("transmission"),
    bodyType: get("bodyType"),
    colour: get("colour"),
    doors: get("doors"),
    seats: get("seats"),
    engineSize: get("engineSize"),
    taxMax: get("taxMax"),
    insMax: get("insMax"),
    bootMin: get("bootMin"),
    status: get("status") || "available",
    sort: get("sort") || "newest",
    q: get("q"),
  };
}

function toQuery(f: Filters): string {
  const params = new URLSearchParams();
  (Object.keys(f) as (keyof Filters)[]).forEach((k) => {
    const v = f[k];
    if (!v) return;
    if (k === "status" && v === "available") return; // default
    if (k === "sort" && v === "newest") return; // default
    params.set(k, v);
  });
  return params.toString();
}

export default function InventoryClient({ makes, modelsByMake }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>(() =>
    filtersFromParams(new URLSearchParams(searchParams.toString())),
  );
  const [cars, setCars] = useState<CarWithRelations[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCars = useCallback(async (f: Filters) => {
    setLoading(true);
    setError(null);
    try {
      const qs = toQuery(f);
      const res = await fetch(`/api/cars?${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setCars(data.cars);
    } catch {
      setError("We couldn't load the stock. Please try again.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const qs = toQuery(filters);
      router.replace(qs ? `/inventory?${qs}` : "/inventory", { scroll: false });
      fetchCars(filters);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const activeCount = useMemo(() => {
    let n = 0;
    (Object.keys(filters) as (keyof Filters)[]).forEach((k) => {
      if (k === "sort") return;
      if (k === "status") {
        if (filters.status && filters.status !== "available") n++;
        return;
      }
      if (filters[k]) n++;
    });
    return n;
  }, [filters]);

  const models = filters.make ? modelsByMake[filters.make] ?? [] : [];

  const reset = () => setFilters(emptyFilters());
  const removeFilter = (key: keyof Filters) =>
    setFilters((f) => ({
      ...f,
      [key]: key === "status" ? "available" : "",
    }));

  const count = cars?.length ?? 0;

  return (
    <div className="container-px py-8 lg:py-10">
      {/* Desktop top filter bar (sticky under nav) */}
      <div className="relative z-30 mb-6 hidden lg:sticky lg:top-[120px] lg:block">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          makes={makes}
          models={models}
          activeCount={activeCount}
        />
      </div>

      {/* Mobile filter trigger + sort */}
      <div className="mb-5 flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-outline flex-1"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-green-500 px-1.5 text-xs font-bold text-ink-950">
              {activeCount}
            </span>
          )}
        </button>
        <select
          className="input w-auto"
          value={filters.sort}
          onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          aria-label="Sort"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Result count + chips */}
      <div className="mb-6 flex flex-col gap-3 border-b border-ink-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500" aria-live="polite">
          {loading ? (
            "Searching the collection…"
          ) : (
            <>
              <span className="font-display text-lg font-semibold text-ink-950">
                {count}
              </span>{" "}
              {count === 1 ? "car" : "cars"} available
            </>
          )}
        </p>
        <FilterChips
          filters={filters}
          onRemove={removeFilter}
          onClear={reset}
        />
      </div>

      {/* States */}
      {error ? (
        <ErrorState onRetry={() => fetchCars(filters)} message={error} />
      ) : loading ? (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      ) : cars && cars.length === 0 ? (
        <EmptyState onReset={reset} hasFilters={activeCount > 0} />
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {cars?.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      )}

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-cream-50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-100 p-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-green-600" />
                Filters
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 hover:bg-ink-100"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterControls
                filters={filters}
                setFilters={setFilters}
                makes={makes}
                models={models}
              />
            </div>
            <div className="flex gap-3 border-t border-ink-100 p-4">
              <button onClick={reset} className="btn-outline flex-1">
                Clear all
              </button>
              <button
                onClick={() => setMobileOpen(false)}
                className="btn-primary flex-1"
              >
                Show {count} cars
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({
  onReset,
  hasFilters,
}: {
  onReset: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 py-24 text-center">
      <SearchX className="h-12 w-12 text-ink-300" />
      <h3 className="mt-4 font-display text-2xl font-semibold text-ink-950">
        No cars found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        {hasFilters
          ? "Try widening your search — adjust or clear some filters to see more of the collection."
          : "There's no stock to show right now. Please check back soon."}
      </p>
      {hasFilters && (
        <button onClick={onReset} className="btn-primary mt-6">
          Clear all filters
        </button>
      )}
    </div>
  );
}

function ErrorState({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 py-24 text-center">
      <AlertCircle className="h-12 w-12 text-red-400" />
      <h3 className="mt-4 font-display text-2xl font-semibold text-ink-950">
        Something went wrong
      </h3>
      <p className="mt-2 text-sm text-ink-500">{message}</p>
      <button onClick={onRetry} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
