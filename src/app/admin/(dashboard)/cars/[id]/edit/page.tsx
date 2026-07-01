import { notFound } from "next/navigation";
import CarForm from "@/components/admin/CarForm";
import { getCarById } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function EditCarPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await getCarById(params.id);
  if (!car) notFound();
  return <CarForm car={car} />;
}
