import Link from "next/link";
import { Plus, Car, CheckCircle2, Inbox, PoundSterling } from "lucide-react";
import AdminCarTable from "@/components/admin/AdminCarTable";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [cars, available, sold, newEnquiries, valueAgg] = await Promise.all([
    prisma.car.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        images: { orderBy: [{ isMain: "desc" }, { order: "asc" }] },
        features: true,
      },
    }),
    prisma.car.count({ where: { status: "available" } }),
    prisma.car.count({ where: { status: "sold" } }),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.car.aggregate({
      where: { status: "available" },
      _sum: { price: true },
    }),
  ]);

  const stats = [
    {
      label: "Cars in stock",
      value: available,
      icon: Car,
      tint: "text-blue-600 bg-blue-50",
    },
    {
      label: "Sold",
      value: sold,
      icon: CheckCircle2,
      tint: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "New enquiries",
      value: newEnquiries,
      icon: Inbox,
      tint: "text-green-600 bg-green-50",
      href: "/admin/enquiries",
    },
    {
      label: "Stock value",
      value: formatPrice(valueAgg._sum.price ?? 0),
      icon: PoundSterling,
      tint: "text-ink-900 bg-ink-100",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">
            Manage your stock and respond to enquiries.
          </p>
        </div>
        <Link href="/admin/cars/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Add car
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const card = (
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.tint}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-ink-900">{s.value}</p>
              <p className="text-sm text-ink-500">{s.label}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="transition hover:opacity-80">
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      {/* Stock table */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-ink-900">
          All stock ({cars.length})
        </h2>
        <AdminCarTable cars={cars} />
      </div>
    </div>
  );
}
