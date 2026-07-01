import { notFound } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { getCarById, getFilterFacets } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function EditCarPage({
  params,
}: {
  params: { id: string };
}) {
  const [car, { makes }] = await Promise.all([
    getCarById(params.id),
    getFilterFacets(),
  ]);
  if (!car) notFound();
  return <CarForm car={car} makes={makes} />;
}
