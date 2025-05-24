"use client";

import Image from "next/image";
import { Prisma } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Rating from "@/components/rating";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface ReviewCardProps {
  review: Prisma.ReviewGetPayload<{
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
    };
  }>;
}

const MAX_LENGTH = 200;

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate =
    !!review.description && review.description.length > MAX_LENGTH;
  const displayText =
    review.description && shouldTruncate && !isExpanded
      ? `${review.description.substring(0, MAX_LENGTH)}...`
      : review.description;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          <Link
            href={`/profile/${review.author.username}`}
            className="rounded-full overflow-hidden"
          >
            <Image
              src={review.author.avatar || "/avatar-placeholder.png"}
              alt={`${review.author.firstName} ${review.author.lastName}`}
              width={40}
              height={40}
            />
          </Link>

          <div className="flex flex-col">
            <Link
              href={`/profile/${review.author.username}`}
              className="tracking-wide font-semibold"
            >
              {review.author.firstName} {review.author.lastName}
            </Link>
            <Link
              href={`/profile/${review.author.username}`}
              className="text-xs text-muted-foreground -mt-0.5"
            >
              @{review.author.username}
            </Link>
            <time
              dateTime={review.createdAt.toISOString()}
              className="text-xs text-muted-foreground mt-0.5"
            >
              {formatDistanceToNow(review.createdAt)}
            </time>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Rating rating={review.rating} />
          <div className="text-xs text-muted-foreground mt-1">
            {review.rating} out of 5
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-xl font-semibold mb-3">{review.title}</h3>
        <div className="leading-relaxed">
          {displayText}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "inline p-0 m-0",
              })}
            >
              {isExpanded ? " Show less" : " Show more"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

export const ReviewCardSkeleton = () => {
  return <Skeleton className="h-48 w-full rounded-xl" />;
};
