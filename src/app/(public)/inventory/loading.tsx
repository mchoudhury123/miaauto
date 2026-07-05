import CarCardSkeleton from "@/components/CarCardSkeleton";

export default function Loading() {
  return (
    <>
      <div className="bg-ink-950 pb-14 pt-28 md:pb-16 md:pt-44">
        <div className="container-px">
          <div className="skeleton h-4 w-32 rounded bg-white/10" />
          <div className="skeleton mt-5 h-11 w-72 rounded bg-white/10" />
          <div className="skeleton mt-4 h-4 w-96 max-w-full rounded bg-white/10" />
        </div>
      </div>
      <div className="container-px py-10">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CarCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
