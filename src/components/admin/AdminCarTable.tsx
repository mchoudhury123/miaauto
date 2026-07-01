"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Star,
  MoreVertical,
  Loader2,
  Check,
} from "lucide-react";
import CarImage from "@/components/CarImage";
import StatusBadge from "@/components/StatusBadge";
import { carTitle, formatMileage, formatPrice } from "@/lib/utils";
import type { CarWithRelations } from "@/lib/types";

export default function AdminCarTable({
  cars: initial,
}: {
  cars: CarWithRelations[];
}) {
  const router = useRouter();
  const [cars, setCars] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id);
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const { car } = await res.json();
        setCars((cs) =>
          cs.map((c) => (c.id === id ? { ...c, ...car } : c)),
        );
      }
    } finally {
      setBusy(null);
      setMenu(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this car permanently? This cannot be undone.")) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCars((cs) => cs.filter((c) => c.id !== id));
        router.refresh();
      }
    } finally {
      setBusy(null);
      setMenu(null);
    }
  }

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white py-16 text-center">
        <p className="text-ink-500">No cars yet.</p>
        <Link href="/admin/cars/new" className="btn-primary mt-4">
          Add your first car
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-400">
          <tr>
            <th className="px-4 py-3 font-semibold">Car</th>
            <th className="hidden px-4 py-3 font-semibold sm:table-cell">Price</th>
            <th className="hidden px-4 py-3 font-semibold md:table-cell">
              Mileage
            </th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {cars.map((car) => {
            const main =
              car.images.find((i) => i.isMain)?.url ??
              car.images[0]?.url ??
              null;
            return (
              <tr key={car.id} className="hover:bg-ink-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-900">
                      <CarImage src={main} alt={carTitle(car)} sizes="64px" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/cars/${car.id}/edit`}
                        className="block truncate font-semibold text-ink-900 hover:text-green-600"
                      >
                        {car.make} {car.model}
                        {car.featured && (
                          <Star className="ml-1 inline h-3.5 w-3.5 fill-green-500 text-green-500" />
                        )}
                      </Link>
                      <span className="text-xs text-ink-400">
                        {car.year}
                        {car.variant ? ` • ${car.variant}` : ""}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 font-semibold sm:table-cell">
                  {formatPrice(car.price)}
                </td>
                <td className="hidden px-4 py-3 text-ink-500 md:table-cell">
                  {formatMileage(car.mileage)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={car.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {busy === car.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
                    ) : (
                      <>
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenu((m) => (m === car.id ? null : car.id))
                            }
                            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                            aria-label="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {menu === car.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setMenu(null)}
                              />
                              <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-xl border border-ink-100 bg-white py-1 shadow-xl">
                                <MenuItem
                                  onClick={() =>
                                    patch(car.id, { status: "available" })
                                  }
                                  active={car.status === "available"}
                                >
                                  Mark available
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    patch(car.id, { status: "reserved" })
                                  }
                                  active={car.status === "reserved"}
                                >
                                  Mark reserved
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    patch(car.id, { status: "sold" })
                                  }
                                  active={car.status === "sold"}
                                >
                                  Mark sold
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    patch(car.id, { featured: !car.featured })
                                  }
                                  active={car.featured}
                                >
                                  {car.featured
                                    ? "Remove featured"
                                    : "Mark featured"}
                                </MenuItem>
                                <div className="my-1 border-t border-ink-100" />
                                <button
                                  onClick={() => remove(car.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete car
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
    >
      {children}
      {active && <Check className="h-4 w-4 text-green-600" />}
    </button>
  );
}
