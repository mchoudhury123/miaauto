import EnquiryList from "@/components/admin/EnquiryList";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { car: { select: { make: true, model: true, year: true } } },
  });

  // Serialise dates for the client component.
  const data = enquiries.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    message: e.message,
    status: e.status,
    createdAt: e.createdAt.toISOString(),
    car: e.car,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Enquiries</h1>
      <p className="mb-6 mt-1 text-sm text-ink-500">
        Messages from customers via the website, car pages and contact form.
      </p>
      <EnquiryList initial={data} />
    </div>
  );
}
