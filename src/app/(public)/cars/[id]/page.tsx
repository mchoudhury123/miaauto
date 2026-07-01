import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Gauge,
  Fuel,
  Cog,
  Calendar,
  Users,
  Wrench,
  Leaf,
  ShieldCheck,
  Check,
  Phone,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import ImageGallery from "@/components/ImageGallery";
import EnquiryForm from "@/components/EnquiryForm";
import CarCard from "@/components/CarCard";
import StatusBadge from "@/components/StatusBadge";
import Reveal from "@/components/Reveal";
import { getCarById, getSimilarCars } from "@/lib/cars";
import { SITE } from "@/lib/constants";
import {
  carTitle,
  formatMileage,
  formatPrice,
  telUrl,
  whatsappUrl,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const car = await getCarById(params.id);
  if (!car) return { title: "Car not found" };
  const title = carTitle(car);
  return {
    title,
    description: `${title} — ${formatMileage(car.mileage)}, ${car.fuelType}, ${
      car.transmission
    }. ${formatPrice(car.price)} at ${SITE.name}.`,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await getCarById(params.id);
  if (!car) notFound();

  const similar = await getSimilarCars(car, 3);
  const title = carTitle(car);
  const waMessage = `Hi ${SITE.name}, I'm interested in the ${title} (${formatPrice(
    car.price,
  )}). Is it still available?`;

  const highlights = [
    { icon: Calendar, label: "Year", value: `${car.year}${car.regYear ? ` · ${car.regYear}` : ""}` },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Fuel, label: "Fuel", value: car.fuelType },
    { icon: Cog, label: "Gearbox", value: car.transmission },
  ];

  const details = [
    { label: "Make", value: car.make },
    { label: "Model", value: car.model },
    car.variant && { label: "Variant", value: car.variant },
    { label: "Year", value: String(car.year) },
    car.regYear && { label: "Registration", value: car.regYear },
    { label: "Mileage", value: formatMileage(car.mileage) },
    { label: "Fuel type", value: car.fuelType },
    { label: "Transmission", value: car.transmission },
    { label: "Body type", value: car.bodyType },
    { label: "Colour", value: car.colour },
    car.engineSize && { label: "Engine size", value: car.engineSize },
    car.doors && { label: "Doors", value: String(car.doors) },
    car.seats && { label: "Seats", value: String(car.seats) },
    car.bootSpace != null && {
      label: "Boot space",
      value: `${car.bootSpace} litres`,
    },
    car.taxPerYear != null && {
      label: "Road tax",
      value: `£${car.taxPerYear.toLocaleString()} / year`,
    },
    car.insuranceGroup != null && {
      label: "Insurance group",
      value: `${car.insuranceGroup} of 50`,
    },
    car.previousOwners != null && {
      label: "Previous owners",
      value: String(car.previousOwners),
    },
    car.motMonths != null && {
      label: "MOT",
      value: `${car.motMonths} months remaining`,
    },
    car.serviceHistory && { label: "Service history", value: car.serviceHistory },
    { label: "ULEZ compliant", value: car.ulez ? "Yes" : "No" },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* ───────── CINEMATIC HEADER ───────── */}
      <section className="grain relative overflow-hidden bg-ink-950 pb-32 pt-28 text-cream-50 md:pb-40 md:pt-40">
        {car.images[0]?.url && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
            style={{ backgroundImage: `url('${car.images[0].url}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/70 to-ink-950" />

        <div className="container-px relative">
          {/* breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-cream-200/70">
            <Link href="/" className="hover:text-green-400">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/inventory" className="hover:text-green-400">
              Showroom
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-cream-100">
              {car.make} {car.model}
            </span>
          </nav>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="eyebrow text-green-400">{car.year} · {car.fuelType}</span>
                <StatusBadge status={car.status} />
              </div>
              <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.02] tracking-tight">
                {car.make} {car.model}
              </h1>
              {car.variant && (
                <p className="mt-1 text-lg text-cream-100/70">{car.variant}</p>
              )}
            </div>
            <div className="w-full text-left sm:w-auto sm:text-right">
              <p className="text-[11px] uppercase tracking-luxe text-cream-200/60">
                Price
              </p>
              <p className="text-[2.5rem] font-bold leading-none tabular-nums tracking-tight text-green-gradient sm:text-4xl">
                {formatPrice(car.price)}
              </p>
            </div>
          </div>

          {/* Mobile quick-contact bar */}
          {car.status !== "sold" && (
            <div className="mt-6 flex gap-2.5 lg:hidden">
              <a href={telUrl()} className="btn-primary flex-1">
                <Phone className="h-4 w-4" />
                Call
              </a>
              <a
                href={whatsappUrl(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex-1"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ───────── BODY (overlaps header) ───────── */}
      <div className="container-px relative z-10 -mt-20 pb-4 sm:-mt-28">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* LEFT */}
          <div className="min-w-0">
            <Reveal className="rounded-3xl bg-white p-3 shadow-luxe ring-1 ring-ink-100">
              <ImageGallery images={car.images} alt={title} />
            </Reveal>

            {/* highlight tiles */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {highlights.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-ink-100 bg-white p-4"
                >
                  <s.icon className="h-5 w-5 text-green-600" />
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-ink-400">
                    {s.label}
                  </p>
                  <p className="text-sm font-semibold text-ink-950">{s.value}</p>
                </div>
              ))}
            </div>

            {/* compliance chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {car.ulez && (
                <span className="badge bg-emerald-100 text-emerald-700">
                  <Leaf className="h-3.5 w-3.5" /> ULEZ compliant
                </span>
              )}
              {car.motMonths != null && (
                <span className="badge bg-blue-100 text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> MOT {car.motMonths} mo
                </span>
              )}
              {car.serviceHistory && (
                <span className="badge bg-ink-100 text-ink-700">
                  <Wrench className="h-3.5 w-3.5" /> {car.serviceHistory}
                </span>
              )}
              {car.previousOwners != null && (
                <span className="badge bg-ink-100 text-ink-700">
                  <Users className="h-3.5 w-3.5" /> {car.previousOwners} previous
                  owner{car.previousOwners === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {car.description && (
              <Section title="Overview">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink-600">
                  {car.description}
                </p>
              </Section>
            )}

            {car.features.length > 0 && (
              <Section title="Features & specification">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {car.features.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-2.5 text-sm text-ink-700"
                    >
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                      {f.name}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {car.conditionNotes && (
              <Section title="Condition notes">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-amber-900">
                    {car.conditionNotes}
                  </p>
                </div>
              </Section>
            )}

            <Section title="Full vehicle details">
              <dl className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink-100 sm:grid-cols-2">
                {details.map((d, i) => (
                  <div
                    key={d.label}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                      i % 2 === 0 ? "bg-cream-100/60" : "bg-white"
                    }`}
                  >
                    <dt className="text-ink-400">{d.label}</dt>
                    <dd className="text-right font-semibold text-ink-950">
                      {d.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          </div>

          {/* RIGHT — sticky purchase + enquiry */}
          <div className="lg:relative">
            <div className="space-y-6 lg:sticky lg:top-[120px]">
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-luxe-sm">
                <div className="bg-ink-950 p-6 text-cream-50">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-luxe text-cream-200/60">
                      {SITE.name}
                    </p>
                    <StatusBadge status={car.status} />
                  </div>
                  <p className="mt-3 text-4xl font-bold tabular-nums tracking-tight text-green-gradient">
                    {formatPrice(car.price)}
                  </p>
                  <p className="mt-1 text-sm text-cream-200/70">
                    {car.make} {car.model}
                    {car.variant ? ` · ${car.variant}` : ""}
                  </p>
                </div>

                <div className="p-6">
                  {car.status === "sold" ? (
                    <div className="rounded-xl bg-ink-100 p-4 text-center text-sm text-ink-600">
                      This car has now been sold.{" "}
                      <Link
                        href="/inventory"
                        className="font-semibold text-green-700"
                      >
                        See similar stock
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <a href={telUrl()} className="btn-dark w-full">
                        <Phone className="h-4 w-4" />
                        Call {SITE.phone}
                      </a>
                      <a
                        href={whatsappUrl(waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp w-full"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Enquire on WhatsApp
                      </a>
                      <a href="#enquire" className="btn-outline w-full">
                        Send a message
                      </a>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-y-3 border-t border-ink-100 pt-5 text-sm">
                    <MiniFact label="Year" value={`${car.year}`} />
                    <MiniFact label="Mileage" value={formatMileage(car.mileage)} />
                    <MiniFact label="Fuel" value={car.fuelType} />
                    <MiniFact label="Gearbox" value={car.transmission} />
                    {car.engineSize && (
                      <MiniFact label="Engine" value={car.engineSize} />
                    )}
                    <MiniFact label="Colour" value={car.colour} />
                  </div>
                </div>
              </div>

              {/* Enquiry form */}
              <div
                id="enquire"
                className="scroll-mt-28 rounded-3xl border border-ink-100 bg-white p-6 shadow-luxe-sm"
              >
                <span className="eyebrow text-green-600">Enquiry</span>
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink-950">
                  Interested in this car?
                </h2>
                <p className="mb-5 mt-1 text-sm text-ink-500">
                  Send us a message and we&apos;ll get straight back to you.
                </p>
                <EnquiryForm carId={car.id} carTitle={title} compact />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── SIMILAR CARS ───────── */}
      {similar.length > 0 && (
        <section className="bg-cream-100 py-16 lg:py-24">
          <div className="container-px">
            <Reveal>
              <span className="eyebrow text-green-600">Keep looking</span>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-tight text-ink-950">
                Similar cars you might like
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c, i) => (
                <CarCard key={c.id} car={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-10">
      <h2 className="mb-4 font-display text-2xl font-semibold text-ink-950">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function MiniFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="font-semibold text-ink-900">{value}</p>
    </div>
  );
}
