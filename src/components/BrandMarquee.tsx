const BRANDS = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Range Rover",
  "Tesla",
  "Volkswagen",
  "Jaguar",
  "Lexus",
  "Land Rover",
];

/** Infinite, mask-faded marquee of marques we specialise in. */
export default function BrandMarquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <div className="border-y border-ink-100 bg-cream-100 py-7">
      <div className="container-px">
        <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-luxe text-ink-400">
          Specialists in the marques you love
        </p>
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
            {row.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="whitespace-nowrap font-display text-xl font-medium text-ink-400 transition-colors hover:text-ink-900 sm:text-2xl"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
