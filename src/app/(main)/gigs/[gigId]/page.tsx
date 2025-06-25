import { notFound } from "next/navigation";

import PackageComparison from "../../../../components/gig/package-comparison";
import GigDescription from "../../../../components/gig/gig-description";
import GigHeader from "../../../../components/gig/gig-header";
import GigFaqList from "../../../../components/gig/gig-faq-list";
import { getDetailedGig } from "@/lib/actions/gigs";
import ReviewsSection from "@/components/reviews/reviews-list";
import OrderDetailsCard from "@/components/gig/order-details-card";
import { ReviewSearchParams } from "@/lib/types";
import { buildReviewFilter, REVIEW_FILTERS_CONFIG } from "@/lib/utils";
import {
  getReviewCnt,
  getReviews,
  getReviewsStats,
} from "@/lib/actions/review";
import { Prisma } from "@prisma/client";
import MediaCarousel from "@/components/image-carousel";

export default async function GigDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ gigId: string }>;
  searchParams: Promise<ReviewSearchParams>;
}) {
  const { gigId } = await params;

  const res = await getDetailedGig(gigId);

  if (res.success === false) {
    throw new Error(res.error || "Failed to fetch gig details");
  }

  const gig = res.data;

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

        {/* Updated to use MediaCarousel with media property */}
        <MediaCarousel media={gig.media} alt={gig.title} />

        <GigDescription description={gig.description} />

        <PackageComparison packages={gig.packages} />

        <ReviewsSection
          getReviewsData={async () => {
            const args = buildReviewFilter(await searchParams);
            const finalArgs: Prisma.ReviewFindManyArgs = {
              ...args,
              where: {
                gigId: gig.id,
              },
            };
            return await Promise.all([
              getReviews(finalArgs),
              getReviewCnt(finalArgs),
            ]);
          }}
          getReviewStats={() =>
            getReviewsStats({
              where: {
                order: {
                  package: {
                    gigId: gig.id,
                  },
                },
              },
            })
          }
          getFilters={async () => REVIEW_FILTERS_CONFIG}
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
