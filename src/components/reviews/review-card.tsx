"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Rating from "@/components/rating";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Review } from "@/lib/types";

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const reviewerName = review.author
    ? `${review.author.firstName} ${review.author.lastName}`
    : "Anonymous User";

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <Image
            src={review.author?.avatar || "/avatar-fallback.png"}
            alt={reviewerName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border object-cover flex-shrink-0"
          />

          {/* User info section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-base truncate">
                {reviewerName}
              </h4>
              <p className="text-sm text-muted-foreground">
                @{review.author?.username || "anonymous"}
              </p>
            </div>
          </div>
        </div>

        {/* Rating always positioned consistently */}
        <div className="flex-shrink-0">
          <Rating rating={review.rating} size={18} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Review title if exists */}
        {review.title && (
          <h5 className="font-medium text-sm mb-2 line-clamp-1">
            {review.title}
          </h5>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          {review.description}
        </p>

        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
