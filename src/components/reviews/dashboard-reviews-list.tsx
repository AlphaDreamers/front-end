"use client";

import { DashboardReview } from "@/lib/types";
import { useState } from "react";
import { DashboardReviewCard } from "./dashboard-review-card";
import { updateReviewResponse } from "@/lib/actions/review";
import { toast } from "sonner";
import { SellerResponseSchema } from "@/lib/schemas/review";

interface DashboardReviewsListProps {
  reviews: DashboardReview[];
}

const DashboardReviewsList = ({ reviews }: DashboardReviewsListProps) => {
  const [responseReviewId, setResponseReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");

  const handleReviewEditInit = (reviewId: string) => {
    setResponseReviewId(reviewId);
    const review = reviews.find((r) => r.id === reviewId);
    if (review && review.sellerResponse) {
      setResponseText(review.sellerResponse);
    } else {
      setResponseText("");
    }
  };

  const handleReviewEditSubmit = async (reviewId: string) => {
    toast.promise(
      async () => {
        const values = SellerResponseSchema.parse({
          reviewId,
          response: responseText,
        });

        await updateReviewResponse(values);
      },
      {
        loading: "Submitting your response...",
        success: () => {
          setResponseReviewId(null);
          setResponseText("");
          return "Response submitted successfully!";
        },
        error: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          return message;
        },
      }
    );
  };

  const handleReviewEdit = (value: string) => {
    setResponseText(value);
  };

  const handleReviewEditCancel = () => {
    setResponseReviewId(null);
    setResponseText("");
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <DashboardReviewCard
          key={review.id}
          review={review}
          status={
            responseReviewId === review.id
              ? "editing"
              : review.sellerResponse
                ? "responded"
                : "no_response"
          }
          responseText={responseText}
          onReviewEditInit={handleReviewEditInit}
          onReviewEditSubmit={handleReviewEditSubmit}
          onReviewEdit={handleReviewEdit}
          onReviewEditCancel={handleReviewEditCancel}
        />
      ))}
    </div>
  );
};

export default DashboardReviewsList;
