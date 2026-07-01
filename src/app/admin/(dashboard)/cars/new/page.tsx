import CarForm from "@/components/admin/CarForm";
import { getFilterFacets } from "@/lib/cars";

export const dynamic = "force-dynamic";

export default async function NewCarPage() {
  const { makes } = await getFilterFacets();
  return <CarForm makes={makes} />;
}
