"use client";

import {
  FUEL_TYPES,
  TRANSMISSIONS,
  BODY_TYPES,
  COLOURS,
  DOORS,
  SEATS,
} from "@/lib/constants";

export interface Filters {
  make: string;
  model: string;
  variant: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  priceMin: string;
  priceMax: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  colour: string;
  doors: string;
  seats: string;
  engineSize: string;
  taxMax: string;
  insMax: string;
  bootMin: string;
  status: string;
  sort: string;
  q: string;
}

export function emptyFilters(): Filters {
  return {
    make: "",
    model: "",
    variant: "",
    yearMin: "",
    yearMax: "",
    mileageMax: "",
    priceMin: "",
    priceMax: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    colour: "",
    doors: "",
    seats: "",
    engineSize: "",
    taxMax: "",
    insMax: "",
    bootMin: "",
    status: "available",
    sort: "newest",
    q: "",
  };
}

interface Props {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  makes: string[];
  models: string[];
}

const YEARS = Array.from(
  { length: 26 },
  (_, i) => new Date().getFullYear() - i,
);

export default function FilterControls({
  filters,
  setFilters,
  makes,
  models,
}: Props) {
  const set = (key: keyof Filters, value: string) =>
    setFilters((f) => {
      const next = { ...f, [key]: value };
      // Reset model when make changes.
      if (key === "make") next.model = "";
      return next;
    });

  return (
    <div className="space-y-5">
      <Group label="Make">
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
      </Group>

      <Group label="Model">
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
      </Group>

      <Group label="Model variant">
        <input
          className="input"
          placeholder="e.g. M Sport, AMG Line"
          value={filters.variant}
          onChange={(e) => set("variant", e.target.value)}
        />
      </Group>

      <Group label="Year">
        <div className="grid grid-cols-2 gap-2">
          <select
            className="input"
            value={filters.yearMin}
            onChange={(e) => set("yearMin", e.target.value)}
          >
            <option value="">From</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={filters.yearMax}
            onChange={(e) => set("yearMax", e.target.value)}
          >
            <option value="">To</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </Group>

      <Group label="Price (£)">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="input"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => set("priceMin", e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="input"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => set("priceMax", e.target.value)}
          />
        </div>
      </Group>

      <Group label="Max mileage">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          className="input"
          placeholder="e.g. 60000"
          value={filters.mileageMax}
          onChange={(e) => set("mileageMax", e.target.value)}
        />
      </Group>

      <Group label="Fuel type">
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
      </Group>

      <Group label="Transmission">
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
      </Group>

      <Group label="Body type">
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
      </Group>

      <Group label="Colour">
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
      </Group>

      <div className="grid grid-cols-2 gap-2">
        <Group label="Doors">
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
        </Group>
        <Group label="Seats">
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
        </Group>
      </div>

      <Group label="Engine size">
        <input
          className="input"
          placeholder="e.g. 2.0"
          value={filters.engineSize}
          onChange={(e) => set("engineSize", e.target.value)}
        />
      </Group>

      <Group label="Max road tax (£/yr)">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          className="input"
          placeholder="e.g. 180"
          value={filters.taxMax}
          onChange={(e) => set("taxMax", e.target.value)}
        />
      </Group>

      <div className="grid grid-cols-2 gap-2">
        <Group label="Max ins. group">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={50}
            className="input"
            placeholder="1–50"
            value={filters.insMax}
            onChange={(e) => set("insMax", e.target.value)}
          />
        </Group>
        <Group label="Min boot (L)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            className="input"
            placeholder="e.g. 300"
            value={filters.bootMin}
            onChange={(e) => set("bootMin", e.target.value)}
          />
        </Group>
      </div>

      <Group label="Availability">
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
      </Group>
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}
