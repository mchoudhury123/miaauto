"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gauge, Fuel, Cog, Calendar, ArrowUpRight, Check } from "lucide-react";
import CarImage from "./CarImage";
import type { CarWithRelations } from "@/lib/types";
import { carTitle, formatMileage, formatPrice } from "@/lib/utils";

export default function CarCard({
  car,
  index = 0,
}: {
  car: CarWithRelations;
  index?: number;
}) {
  const main =
    car.images.find((i) => i.isMain)?.url ?? car.images[0]?.url ?? null;
  const title = carTitle(car);
  const isSold = car.status === "sold";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.06, 0.4),
      }}
      className="group relative flex flex-col overflow-hidden rounded-[20px] border border-ink-100 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-green-300 hover:shadow-luxe"
    >
      <Link
        href={`/cars/${car.id}`}
        className="relative block aspect-[3/2] overflow-hidden bg-ink-950"
      >
        <CarImage
          src={main}
          alt={title}
          className="transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
        />
        {/* gradient veil */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/55 backdrop-blur-[1px]">
            <span className="rotate-[-5deg] border-y-2 border-green-500 px-5 py-1.5 font-display text-xl font-semibold uppercase tracking-[0.2em] text-cream-50">
              Sold
            </span>
          </div>
        )}

        {/* top badges */}
        <div className="absolute left-4 top-4 flex gap-2">
          {car.featured && !isSold && (
            <span className="badge bg-green-500/95 text-ink-950 shadow-sm backdrop-blur">
              ★ Featured
            </span>
          )}
          {car.status === "reserved" && (
            <span className="badge bg-amber-400/95 text-ink-950 backdrop-blur">
              Reserved
            </span>
          )}
        </div>

        {/* price */}
        <div className="absolute bottom-4 left-4">
          <p className="text-[11px] font-medium uppercase tracking-widest text-cream-200/80">
            Price
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-cream-50">
            {formatPrice(car.price)}
          </p>
        </div>

        {/* hover arrow */}
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-green-500 text-ink-950 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-ink-950">
          <Link href={`/cars/${car.id}`} className="hover:text-green-700">
            {car.make} {car.model}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-ink-400">
          {[car.variant, car.regYear ? `${car.regYear} plate` : null]
            .filter(Boolean)
            .join("  ·  ") || "Premium specification"}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 text-sm">
          <Spec icon={<Calendar />} label="Year" value={`${car.year}`} />
          <Spec icon={<Gauge />} label="Mileage" value={formatMileage(car.mileage)} />
          <Spec icon={<Fuel />} label="Fuel" value={car.fuelType} />
          <Spec icon={<Cog />} label="Gearbox" value={car.transmission} />
        </dl>

        {car.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {car.features.slice(0, 3).map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-medium text-ink-600"
              >
                <Check className="h-3 w-3 text-green-600" />
                {f.name}
              </span>
            ))}
            {car.features.length > 3 && (
              <span className="inline-flex items-center rounded-full px-1.5 py-1 text-[11px] font-medium text-ink-400">
                +{car.features.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-2.5 border-t border-ink-100 pt-5">
          <Link href={`/cars/${car.id}`} className="btn-dark flex-1">
            View car
          </Link>
          <Link
            href={`/cars/${car.id}#enquire`}
            className="btn-outline px-5"
            aria-label={`Enquire about ${title}`}
          >
            Enquire
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-white px-3 py-2.5">
      <span className="text-green-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-ink-400">
          {label}
        </span>
        <span className="block truncate font-medium text-ink-800">{value}</span>
      </span>
    </div>
  );
}
