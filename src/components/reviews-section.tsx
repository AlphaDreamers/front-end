"use client";

import { Prisma } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { loadMoreReviews } from "@/lib/actions";
import ReviewStatsCard from "./reviews/review-stats-card";
import ReviewCard, { ReviewCardSkeleton } from "./reviews/review-card";

type Review = Prisma.ReviewGetPayload<{
  select: {
    author: {
      select: {
        avatar: true;
        firstName: true;
        lastName: true;
        username: true;
      };
    };
    title: true;
    description: true;
    rating: true;
    createdAt: true;
    id: true;
  };
}>;

interface ReviewSectionProps {
  userId: string;
  statistics: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
  initialReviews?: Review[];
}

const ReviewsSection = ({
  userId,
  statistics,
  initialReviews = [],
}: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const newReviews = await loadMoreReviews(userId, reviews.length, 3);

      await new Promise((resolve) => setTimeout(resolve, 10000)); // Simulate network delay

      setReviews((prev) => [...prev, ...newReviews]);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ReviewStatsCard statistics={statistics} />

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium">Client Reviews</h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {isLoading && null}
      </div>

      {isLoading && (
        <ReviewsCardSkeletion
          cnt={
            reviews.length + 3 < statistics.total
              ? 3
              : statistics.total - reviews.length
          }
        />
      )}

      {statistics.total !== reviews.length && (
        <Button
          variant="outline"
          className="mx-auto"
          disabled={isLoading}
          onClick={handleLoadMore}
        >
          {isLoading ? "Loading..." : "Load More Reviews"}
        </Button>
      )}
    </div>
  );
};
export default ReviewsSection;

const ReviewsCardSkeletion = ({ cnt }: { cnt: number }) => {
  return Array.from({ length: cnt }).map((_, index) => (
    <ReviewCardSkeleton key={index} />
  ));
};
