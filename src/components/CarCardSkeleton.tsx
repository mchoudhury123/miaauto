export default function CarCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
        </div>
        <div className="flex gap-2 pt-3">
          <div className="skeleton h-11 flex-1 rounded-lg" />
          <div className="skeleton h-11 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
