import { Review, ReviewStats } from "@/lib/types";
import { FilterCardSkeleton, FilterType } from "@/components/filters";
import Filters from "@/components/filters";
import ReviewStatsCard, {
  ReviewStatCardSkeletion,
} from "@/components/reviews/review-stats-card";
import {
  ReviewCard,
  ReviewCardSkeleton,
} from "@/components/reviews/review-card";
import { cn } from "@/lib/utils";
import Pagination from "../pagination";
import Async from "../async";

interface ReviewsSectionProps {
  getReviewStats: () => Promise<ReviewStats>;
  getReviewsData: () => Promise<[Review[], number]>;
  getFilters: () => Promise<FilterType[]>;
  className?: string;
  fallback?: React.ReactNode;
}

const REVIEWS_PER_PAGE = 6;

export default function ReviewsSection({
  getReviewStats,
  getReviewsData,
  getFilters,
  className,
  fallback,
}: ReviewsSectionProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Review Stats */}
      <Async fetch={getReviewStats} fallback={<ReviewStatCardSkeletion />}>
        {(reviewStats) => <ReviewStatsCard statistics={reviewStats} />}
      </Async>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <Async fetch={getFilters} fallback={<FilterCardSkeleton />}>
            {(filters) => <Filters filters={filters} />}
          </Async>
        </aside>

        {/* Reviews List */}
        <Async fetch={getReviewsData} fallback={<ReviewsListSkeleton />}>
          {([reviews, cnt]) => (
            <div className="space-y-6">
              {reviews.length === 0 &&
                (fallback || (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No reviews found matching your filters.
                    </p>
                  </div>
                ))}

              {
                /* Render each review */
                reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              }
              <Pagination totalPages={Math.ceil(cnt / REVIEWS_PER_PAGE)} />
            </div>
          )}
        </Async>
      </div>
    </div>
  );
}

const ReviewsListSkeleton = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
};
