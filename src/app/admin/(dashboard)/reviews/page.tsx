import ReviewManager from "@/components/admin/ReviewManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ reviewedAt: "desc" }, { createdAt: "desc" }],
    include: { images: { orderBy: { order: "asc" } } },
  });

  // Serialise dates for the client component.
  const data = reviews.map((r) => ({
    id: r.id,
    author: r.author,
    source: r.source,
    showSource: r.showSource,
    rating: r.rating,
    body: r.body,
    carBought: r.carBought,
    reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
    published: r.published,
    createdAt: r.createdAt.toISOString(),
    images: r.images.map((i) => ({ id: i.id, url: i.url, alt: i.alt })),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Reviews</h1>
      <p className="mb-6 mt-1 text-sm text-ink-500">
        Add customer reviews from AutoTrader, Instagram or anywhere else by
        hand. Published ones show on the homepage.
      </p>
      <ReviewManager initial={data} />
    </div>
  );
}
