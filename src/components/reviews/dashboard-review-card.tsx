"use client";

import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/rating";
import { cn } from "@/lib/utils";
import { DashboardReview } from "@/lib/types";

export interface DashboardReviewCardProps {
  review: DashboardReview;
  status: "no_response" | "responded" | "editing";
  responseText: string;
  onReviewEditInit: (id: string) => void;
  onReviewEditSubmit: (id: string) => Promise<void>;
  onReviewEdit: (value: string) => void;
  onReviewEditCancel: () => void;
}
export function DashboardReviewCard({
  review,
  status,
  responseText,
  onReviewEditInit,
  onReviewEditSubmit,
  onReviewEdit,
  onReviewEditCancel,
}: DashboardReviewCardProps) {
  const reviewerName = review.author
    ? `${review.author.firstName} ${review.author.lastName}`
    : "Anonymous User";

  return (
    <Card>
      {/* Extended header with gig and order info */}
      <CardHeader className="space-y-4">
        {/* Top section with gig and order info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="font-medium">
              {review.gig.title}
            </Badge>
            <Link
              href={`/dashboard/orders/${review.order.id}`}
              className={cn(
                buttonVariants({
                  variant: "link",
                  size: "sm",
                }),
                "text-xs text-muted-foreground hover:no-underline hover:text-primary h-auto p-0"
              )}
            >
              Order: #{review.order.id.slice(0, 8)}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Review header matching ReviewCard structure */}
        <div className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Image
              src={review.author?.avatar || "/avatar-fallback.png"}
              alt={reviewerName}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border object-cover flex-shrink-0"
            />

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

          <div className="flex-shrink-0">
            <Rating rating={review.rating} size={18} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review content */}
        <div>
          {review.title && (
            <h5 className="font-medium text-sm mb-2">{review.title}</h5>
          )}
          <p className="text-muted-foreground text-sm leading-relaxed">
            {review.description}
          </p>
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Seller response section */}
        {status === "responded" && review.sellerResponse && (
          <div className="pl-4 border-l-2 border-primary/20">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Your Response
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

        {/* Response editor */}
        {status === "editing" && (
          <div className="pl-4 border-l-2 border-primary/20 space-y-3 animate-in fade-in-0 slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-medium text-primary">
                Your Response
              </h6>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onReviewEditCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              value={responseText}
              onChange={(e) => onReviewEdit(e.target.value)}
              placeholder="Write a professional and helpful response..."
              className="min-h-[100px] resize-none text-sm"
              maxLength={1000}
            />

            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {responseText.length}/1000 characters
              </span>
              <Button
                onClick={() => onReviewEditSubmit(review.id)}
                disabled={!responseText.trim()}
                size="sm"
              >
                Submit Response
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action footer */}
      {status === "no_response" && (
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReviewEditInit(review.id)}
            className="w-full sm:w-auto"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Respond to Review
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
