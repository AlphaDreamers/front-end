"use server";

import { prisma } from "../prisma";
import { me } from "./auth";

export async function updateReviewResponse({
  reviewId,
  response,
}: {
  reviewId: string;
  response: string;
}) {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  // Verify the review belongs to the user's gig
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      gig: {
        sellerId: user.id,
      },
    },
  });

  if (!review) {
    throw new Error("Review not found or unauthorized");
  }

  // Update the review with the response
  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      sellerResponse: response,
      sellerRespondedAt: new Date(),
    },
  });
}
