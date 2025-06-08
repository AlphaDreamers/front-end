"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

import Async from "@/components/async";
import ReviewStatsCard from "@/components/reviews/review-stats-card";
import Rating from "@/components/rating";
import { ProfileReview } from "@/lib/types";

interface ProfileReviewsProps {
  userId: string;
  stats: {
    total: number;
    average: number;
    distribution: Record<number, number>;
  };
  fetchReviews: (
    userId: string,
    skip: number,
    take: number
  ) => Promise<ProfileReview[]>;
}

export default function ProfileReviews({
  userId,
  stats,
  fetchReviews,
}: ProfileReviewsProps) {
  const [skip, setSkip] = useState(0);
  const [reviews, setReviews] = useState<ProfileReview[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialReviews = async () => {
    const initialReviews = await fetchReviews(userId, 0, 6);
    setReviews(initialReviews);
    setSkip(6);
    setHasMore(initialReviews.length === 6);
    return initialReviews;
  };

  const loadMoreReviews = async () => {
    const newReviews = await fetchReviews(userId, skip, 6);
    setReviews((prev) => [...prev, ...newReviews]);
    setSkip((prev) => prev + 6);
    setHasMore(newReviews.length === 6);
  };

  return (
    <div className="space-y-6">
      <ReviewStatsCard statistics={stats} />

      <Async fetch={loadInitialReviews} fallback={<ReviewsSkeleton />}>
        {(initialReviews) => (
          <>
            <div className="space-y-4">
              {reviews.length === 0 && initialReviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">No reviews yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {[
                    ...initialReviews,
                    ...reviews.slice(initialReviews.length),
                  ].map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </>
              )}
            </div>

            {hasMore && reviews.length > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={loadMoreReviews}
                  variant="outline"
                  className="w-full max-w-xs"
                >
                  <ChevronDown className="size-4 mr-2" />
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </Async>
    </div>
  );
}

function ReviewCard({ review }: { review: ProfileReview }) {
  const reviewerName = review.author
    ? `${review.author.firstName} ${review.author.lastName}`
    : "Anonymous";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={review.author?.avatar || ""} />
            <AvatarFallback>
              {review.author
                ? `${review.author.firstName[0]}${review.author.lastName[0]}`
                : "AN"}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{reviewerName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Rating rating={review.rating} size={16} />
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {review.title && <h5 className="font-medium">{review.title}</h5>}

            <p className="text-muted-foreground">{review.description}</p>

            {review.sellerResponse && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Seller Response</Badge>
                  {review.sellerRespondedAt && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(review.sellerRespondedAt, {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm">{review.sellerResponse}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
