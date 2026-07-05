export default function Loading() {
  return (
    <>
      <div className="bg-ink-950 pb-16 pt-28 md:pt-40">
        <div className="container-px space-y-4">
          <div className="skeleton h-4 w-44 rounded bg-white/10" />
          <div className="skeleton h-10 w-3/4 max-w-md rounded bg-white/10" />
          <div className="skeleton h-4 w-40 rounded bg-white/10" />
        </div>
      </div>
      <div className="container-px grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="skeleton aspect-[16/10] w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-72 rounded-3xl" />
          <div className="skeleton h-96 rounded-3xl" />
        </div>
      </div>
    </>
  );
}
