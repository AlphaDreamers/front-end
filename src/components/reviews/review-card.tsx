"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/rating";
import { cn } from "@/lib/utils";
import { Review } from "@/lib/types";
import Link from "next/link";
import UserDetails from "../user-details";

export interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <Card className={cn("h-fit", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <UserDetails user={review.author} />

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

        {/* Seller response section */}
        {review.sellerResponse && (
          <div className="mt-4 pl-4 border-l-2 border-primary/20">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Seller Response
              </Badge>
              {review.sellerRespondedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.sellerRespondedAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {review.sellerResponse}
            </p>
          </div>
        )}

        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(review.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </CardContent>
      {review.txId && (
        <CardFooter>
          <Link
            href={`https://solscan.io/tx/${review.txId}`}
            target="_blank"
            className="text-xs text-blue-500 hover:underline"
            rel="noopener noreferrer"
          >
            <span className="font-mono">
              {review.txId.slice(0, 6)}...{review.txId.slice(-4)}
            </span>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

export function ReviewCardSkeleton() {
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
