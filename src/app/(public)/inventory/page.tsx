import { Suspense } from "react";
import type { Metadata } from "next";
import InventoryClient from "@/components/inventory/InventoryClient";
import { getFilterFacets } from "@/lib/cars";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Showroom",
  description:
    "Browse the full collection of premium used cars at MIA Automotive. Filter by make, model, price, mileage, fuel and more.",
};

export default async function InventoryPage() {
  const [{ makes, modelsByMake }, available] = await Promise.all([
    getFilterFacets(),
    prisma.car.count({ where: { status: "available" } }),
  ]);

  return (
    <>
      {/* Cinematic header */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-14 pt-28 text-cream-50 md:pb-16 md:pt-44">
        <div
          className="absolute inset-0 animate-kenburns bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=2200&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
        <div className="container-px relative">
          <span className="eyebrow text-green-400">The collection</span>
          <h1 className="mt-5 font-display text-[clamp(2.1rem,5.5vw,4.25rem)] font-semibold leading-[1.02] tracking-tight">
            The <span className="italic text-green-gradient">Showroom</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-cream-100/80">
            {available} hand-selected{" "}
            {available === 1 ? "car" : "cars"} available now. Every one inspected,
            prepared and ready to drive.
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <InventoryClient makes={makes} modelsByMake={modelsByMake} />
      </Suspense>
    </>
  );
}
