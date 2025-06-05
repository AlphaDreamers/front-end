"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewStats from "@/components/reviews/review-stats-card";

interface Review {
  id: string;
  rating: number;
  title: string;
  description: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
}

interface ReviewSectionProps {
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
}

export default function ReviewSection({
  reviews,
  avgRating,
  reviewCount,
}: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = reviews.reduce(
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
  );

  // Display only first 3 reviews unless showAll is true
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <p className="text-muted-foreground">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews ({reviewCount})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating summary */}
        <ReviewStats
          statistics={{
            total: reviewCount,
            average: avgRating,
            distribution: ratingDistribution,
          }}
          maxRating={5}
        />

        {/* Review list */}
        <div className="space-y-6 md:col-span-2">
          {displayedReviews.map((review) => (
            <div key={review.id} className="space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={review.author.avatar || undefined}
                    alt={review.author.username}
                  />
                  <AvatarFallback>
                    {review.author.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{review.author.username}</span>
              </div>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "fill-primary text-primary"
                        : "fill-none text-gray-400"
                    }`}
                  />
                ))}
              </div>

              <h4 className="font-medium">{review.title}</h4>
              <p className="text-sm text-muted-foreground">
                {review.description}
              </p>
            </div>
          ))}

          {reviews.length > 3 && (
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full"
            >
              {showAll ? "Show Less" : `Show All ${reviewCount} Reviews`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
