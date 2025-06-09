"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Review, ReviewStats } from "@/lib/types";
import { FilterType } from "@/components/filter-card";
import Filters from "@/components/filter-card";
import ReviewStatsCard from "@/components/reviews/review-stats-card";
import { ReviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";
import { getFilteredReviews } from "@/lib/actions/review";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  initialReviews: Review[];
  reviewStats: ReviewStats;
  totalReviews: number;
  className?: string;
}

const REVIEWS_PER_PAGE = 6;

// Filter configuration for reviews
const reviewFilters: FilterType[] = [
  {
    id: "rating",
    label: "Rating",
    type: "select",
    options: [
      { label: "All Ratings", value: "" },
      { label: "5 Stars", value: "5" },
      { label: "4 Stars", value: "4" },
      { label: "3 Stars", value: "3" },
      { label: "2 Stars", value: "2" },
      { label: "1 Star", value: "1" },
    ],
  },
  {
    id: "sort",
    label: "Sort By",
    type: "select",
    options: [
      { label: "Most Recent", value: "recent" },
      { label: "Oldest First", value: "oldest" },
      { label: "Highest Rated", value: "highest" },
      { label: "Lowest Rated", value: "lowest" },
    ],
  },
  {
    id: "verified",
    label: "Verified Purchases Only",
    type: "toggle",
  },
  {
    id: "withPhotos",
    label: "With Photos",
    type: "toggle",
  },
];

export default function ReviewsSection({
  initialReviews,
  reviewStats,
  totalReviews,
  className,
}: ReviewsSectionProps) {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [hasMore, setHasMore] = useState(initialReviews.length < totalReviews);
  const [isPending, startTransition] = useTransition();

  // Reset reviews when filters change
  useEffect(() => {
    setReviews(initialReviews);
    setHasMore(initialReviews.length < totalReviews);
  }, [searchParams, initialReviews, totalReviews]);

  const handleLoadMore = () => {
    startTransition(async () => {
      try {
        // Build filter object from search params
        const filters = {
          rating: searchParams.get("rating") || undefined,
          sort: searchParams.get("sort") || "recent",
          verified: searchParams.get("verified") === "true",
          withPhotos: searchParams.get("withPhotos") === "true",
        };

        // Fetch more reviews
        const { reviews: newReviews, hasMore: moreAvailable } =
          await getFilteredReviews({
            ...filters,
            skip: reviews.length,
            take: REVIEWS_PER_PAGE,
          });

        setReviews((prev) => [...prev, ...newReviews]);
        setHasMore(moreAvailable);
      } catch (error) {
        console.error("Failed to load more reviews:", error);
      }
    });
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Review Stats */}
      <ReviewStatsCard statistics={reviewStats} />

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <Filters filters={reviewFilters} />
        </aside>

        {/* Reviews List */}
        <ReviewList
          reviews={reviews}
          hasMore={hasMore}
          isLoading={isPending}
          onLoadMore={handleLoadMore}
          skeletonCount={REVIEWS_PER_PAGE}
        />
      </div>
    </div>
  );
}

// Separate ReviewList component for better organization
interface ReviewListProps {
  reviews: Review[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  skeletonCount: number;
}

function ReviewList({
  reviews,
  hasMore,
  isLoading,
  onLoadMore,
  skeletonCount,
}: ReviewListProps) {
  return (
    <div className="space-y-6">
      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {/* Loading Skeletons */}
          {isLoading && (
            <>
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <ReviewCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No reviews found matching your filters.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && reviews.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Reviews"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Review Card Skeleton Component
function ReviewCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-200" />

        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Name and rating */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>

          {/* Title */}
          <div className="h-4 w-48 bg-gray-200 rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
            <div className="h-3 w-4/6 bg-gray-200 rounded" />
          </div>

          {/* Date */}
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
