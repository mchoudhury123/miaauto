import { cn } from "@/lib/utils";
import { STATUS_LABELS, type CarStatus } from "@/lib/constants";

const styles: Record<CarStatus, string> = {
  available: "bg-emerald-100 text-emerald-700",
  reserved: "bg-amber-100 text-amber-700",
  sold: "bg-ink-900 text-white",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const s = (["available", "reserved", "sold"].includes(status)
    ? status
    : "available") as CarStatus;
  return (
    <span className={cn("badge", styles[s], className)}>
      {s !== "available" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {STATUS_LABELS[s]}
    </span>
  );
}
