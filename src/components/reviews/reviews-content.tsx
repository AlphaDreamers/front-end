"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";

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
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";

// Type definitions for the review data
interface ReviewAuthor {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface ReviewGig {
  id: string;
  title: string;
}

interface ReviewOrder {
  id: string;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  description: string;
  sellerResponse: string | null;
  sellerRespondedAt: Date | null;
  createdAt: Date;
  order: ReviewOrder;
  gig: ReviewGig;
  author: ReviewAuthor | null;
}

interface ReviewsContentProps {
  initialReviews: Review[];
  totalPages: number;
  updateReviewResponse: (data: {
    reviewId: string;
    response: string;
  }) => Promise<any>;
}

export default function ReviewsContent({
  initialReviews,
  totalPages,
  updateReviewResponse,
}: ReviewsContentProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [respondingReviewId, setRespondingReviewId] = useState<string | null>(
    null
  );
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>(
    {}
  );

  const handleReviewEditInit = (reviewId: string) => {
    setRespondingReviewId(reviewId);
    // Initialize response text with existing response if any
    const review = reviews.find((r) => r.id === reviewId);
    if (review?.sellerResponse) {
      setResponseTexts({
        ...responseTexts,
        [reviewId]: review.sellerResponse,
      });
    }
  };

  const handleReviewEditSubmit = async (reviewId: string) => {
    const response = responseTexts[reviewId] || "";

    if (!response.trim()) {
      toast.error("Please write a response before submitting");
      return;
    }

    await toast.promise(
      async () => {
        const result = await updateReviewResponse({
          reviewId,
          response,
        });

        // Update local state with the response
        setReviews((prev) =>
          prev.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  sellerResponse: response,
                  sellerRespondedAt: new Date(),
                }
              : review
          )
        );

        setRespondingReviewId(null);
        return result;
      },
      {
        loading: "Submitting your response...",
        success: "Response submitted successfully!",
        error: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          setRespondingReviewId(null);
          return message;
        },
      }
    );
  };

  const handleReviewEdit = (reviewId: string, value: string) => {
    setResponseTexts({
      ...responseTexts,
      [reviewId]: value,
    });
  };

  const handleReviewEditCancel = () => {
    setRespondingReviewId(null);
  };

  return (
    <>
      <div className="space-y-6">
        {reviews.map((review) => (
          <DashboardReviewCard
            key={review.id}
            review={review}
            status={
              review.sellerResponse
                ? "responded"
                : respondingReviewId === review.id
                  ? "editing"
                  : "no_response"
            }
            responseText={responseTexts[review.id] || ""}
            onReviewEditInit={handleReviewEditInit}
            onReviewEditSubmit={handleReviewEditSubmit}
            onReviewEdit={handleReviewEdit}
            onReviewEditCancel={handleReviewEditCancel}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} className="mt-8" />
      )}
    </>
  );
}

interface DashboardReviewCardProps {
  review: Review;
  status: "no_response" | "responded" | "editing";
  responseText: string;
  onReviewEditInit: (id: string) => void;
  onReviewEditSubmit: (id: string) => Promise<void>;
  onReviewEdit: (id: string, value: string) => void;
  onReviewEditCancel: () => void;
}

function DashboardReviewCard({
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
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge>{review.gig.title}</Badge>
          {/* If you store transaction hash in orders, you can display it here */}
          <Link
            href={`/dashboard/orders/${review.order.id}`}
            className={cn(
              buttonVariants({
                variant: "link",
                className:
                  "text-xs text-muted-foreground hover:no-underline hover:text-primary w-fit h-fit p-0 m-0",
              })
            )}
          >
            <span>Order:</span> #{review.order.id.slice(0, 8)}
            <ExternalLink className="size-3 ml-1" />
          </Link>
        </div>

        <Rating rating={review.rating} size={20} />
      </CardHeader>

      <CardContent>
        <div className="flex items-start gap-3">
          <Image
            src={review.author?.avatar || "/avatar-fallback.png"}
            alt={reviewerName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border object-cover"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{reviewerName}</h3>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {review.title && (
              <h4 className="font-medium text-sm mt-1">{review.title}</h4>
            )}
            <p className="text-muted-foreground mt-1">{review.description}</p>
          </div>
        </div>

        {status === "responded" && review.sellerResponse && (
          <div className="ml-12 mt-3 pl-4 border-l-2 border-primary/35">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary">Your Response</Badge>
              {review.sellerRespondedAt && (
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.sellerRespondedAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {review.sellerResponse}
            </p>
          </div>
        )}

        {status === "editing" && (
          <div className="ml-12 mt-4 pl-4 border-l-2 border-primary/35 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-primary">
                Your Response
              </h4>

              <Button variant="ghost" size="icon" onClick={onReviewEditCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              value={responseText}
              onChange={(e) => onReviewEdit(review.id, e.target.value)}
              placeholder="Write a professional and helpful response..."
              className="h-[100px] resize-none"
              maxLength={1000}
            />

            <div className="flex justify-between items-center mt-2">
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

      <CardFooter>
        {status === "no_response" && (
          <Button variant="outline" onClick={() => onReviewEditInit(review.id)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Respond to Review
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
