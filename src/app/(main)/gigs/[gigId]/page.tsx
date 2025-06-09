import { notFound } from "next/navigation";

import PackageComparison from "../../../../components/gig/package-comparison";
import GigDescription from "../../../../components/gig/gig-description";
import GigHeader from "../../../../components/gig/gig-header";
import ImageCarousel from "@/components/image-carousel";
import GigFaqList from "../../../../components/gig/gig-faq-list";
import { getDetailedGig } from "@/lib/actions/gig";
import ReviewsSection from "@/components/reviews/reviews-list";
import OrderDetailsCard from "@/components/gig/order-details-card";

export default async function GigDetailsPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = await params;

  const gig = await getDetailedGig(gigId);

  if (!gig) {
    notFound();
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="xl:w-2/3 space-y-8">
        <GigHeader
          title={gig.title}
          seller={gig.seller}
          avgRating={gig.avgRating}
          reviewCount={gig.reviewCount}
        />

        <ImageCarousel images={gig.images} alt={gig.title} />

        <GigDescription description={gig.description} />

        <PackageComparison packages={gig.packages} />

        <ReviewsSection
          initialReviews={gig.reviews}
          reviewStats={{
            average: gig.avgRating,
            total: gig.reviewCount,
            distribution: gig.reviews.reduce(
              (acc, review) => {
                acc[review.rating] = (acc[review.rating] || 0) + 1;
                return acc;
              },
              {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
              } as Record<number, number>
            ),
          }}
          totalReviews={gig.reviewCount}
        />

        {gig.faqs.length > 0 ? (
          <GigFaqList faqs={gig.faqs} />
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-white mb-2">
              No FAQs available
            </h3>
            <p className="text-gray-400">
              The seller has not provided any FAQs for this gig.
            </p>
          </div>
        )}
      </div>

      <div className="xl:w-1/3">
        <div className="w-full sticky top-24">
          <OrderDetailsCard packages={gig.packages} />
        </div>
      </div>
    </div>
  );
}
