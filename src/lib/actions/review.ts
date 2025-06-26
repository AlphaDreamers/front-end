"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  Review,
  DashboardReview,
  ReviewStats,
  Color,
  LucideIconName,
} from "@/lib/types";
import { SellerResponseSchema } from "../schemas/review";
import { auth } from "../auth";
import { createNotification } from "./notifications";
import { getDistribution } from "../utils";
import { checkCommunityStarBadge } from "./badges";

export async function getDashboardReviews(
  args: Omit<Prisma.ReviewFindManyArgs, "select" | "include">
): Promise<DashboardReview[]> {
  const data = await prisma.review.findMany({
    ...args,
    select: {
      id: true,
      rating: true,
      title: true,
      description: true,
      createdAt: true,
      sellerResponse: true,
      sellerRespondedAt: true,
      author: {
        select: {
          badgeProgress: {
            where: {
              isFeatured: true,
            },
            select: {
              highestTier: true,
              badge: {
                select: {
                  id: true,
                  title: true,
                  icon: true,
                  color: true,
                },
              },
            },
          },
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      order: {
        select: {
          id: true,
          package: {
            select: {
              gig: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      gig: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return data.map((review) => ({
    id: review.id,
    rating: review.rating,
    title: review.title,
    description: review.description,
    createdAt: review.createdAt,
    sellerResponse: review.sellerResponse || undefined,
    sellerRespondedAt: review.sellerRespondedAt || undefined,
    author: {
      id: review.author.id,
      username: review.author.username,
      firstName: review.author.firstName,
      lastName: review.author.lastName,
      avatar: review.author.avatar || undefined,
      badge:
        review.author.badgeProgress.length > 0
          ? {
              id: review.author.badgeProgress[0].badge.id,
              title: review.author.badgeProgress[0].badge.title,
              icon: review.author.badgeProgress[0].badge.icon as LucideIconName,
              color: review.author.badgeProgress[0].badge.color as Color,
              tier: review.author.badgeProgress[0].highestTier,
            }
          : undefined,
    },
    order: {
      id: review.order?.id,
    },
    gig: {
      id: review.order.package.gig.id,
      title: review.order.package.gig.title,
    },
  }));
}

export async function getDashboardReviewsCount(
  args: Omit<Prisma.ReviewCountArgs, "select" | "include"> = {}
): Promise<number> {
  return prisma.review.count({
    ...args,
  });
}

export async function getTestimonials(
  args: Omit<Prisma.ContactMessageFindManyArgs, "select" | "include"> = {}
): Promise<Review[]> {
  const data = await prisma.contactMessage.findMany({
    ...args,
    where: {
      ...("where" in args ? args.where : {}),
      type: "TESTIMONIAL",
    },
    select: {
      id: true,
      createdAt: true,
      guestEmail: true,
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      testimonial: {
        select: {
          title: true,
          rating: true,
          message: true,
        },
      },
    },
  });

  return data
    .filter((message) => message.testimonial) // Only need testimonial data, author is optional
    .map((message) => ({
      id: message.id,
      rating: message.testimonial!.rating,
      title: message.testimonial!.title,
      description: message.testimonial!.message,
      author: message.author
        ? {
            id: message.author.id,
            username: message.author.username,
            firstName: message.author.firstName,
            lastName: message.author.lastName,
            avatar: message.author.avatar || undefined,
          }
        : {
            // Handle guest testimonials - create a fake user from email
            id: "guest",
            username: message.guestEmail?.split("@")[0] || "Guest",
            firstName: message.guestEmail?.split("@")[0] || "Guest",
            lastName: "User",
            avatar: undefined,
          },
      createdAt: message.createdAt,
    }));
}

export async function updateReviewResponse({
  reviewId,
  response,
}: z.infer<typeof SellerResponseSchema>) {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in to respond to reviews");
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      gig: {
        select: {
          id: true,
          sellerId: true,
        },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (!review.gig) {
    throw new Error("Associated gig not found");
  }

  if (review.gig.sellerId !== session.user.id) {
    throw new Error("You can only respond to reviews on your own gigs");
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      sellerResponse: response.trim(),
      sellerRespondedAt: new Date(),
    },
    select: {
      gig: {
        select: {
          id: true,
        },
      },
    },
  });

  // Revalidate the relevant paths
  revalidatePath("/dashboard/reviews");
  revalidatePath(`/gigs/${review.gig.id}`);
}

export const getReviews = async (
  args: Omit<Prisma.ReviewFindManyArgs, "select" | "include"> = {}
): Promise<Review[]> => {
  const data = await prisma.review.findMany({
    ...args,
    select: {
      id: true,
      rating: true,
      orderId: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          avatar: true,
        },
      },
      order: {
        select: {
          transaction: {
            select: {
              txId: true,
            },
          },
        },
      },
      title: true,
      description: true,
      createdAt: true,
      sellerResponse: true,
      sellerRespondedAt: true,
    },
  });

  return data.map((review) => ({
    id: review.id,
    rating: review.rating,
    orderId: review.orderId,
    author: {
      id: review.author.id,
      firstName: review.author.firstName,
      lastName: review.author.lastName,
      username: review.author.username,
      avatar: review.author.avatar || undefined,
    },
    title: review.title,
    description: review.description,
    createdAt: review.createdAt,
    sellerResponse: review.sellerResponse || undefined,
    sellerRespondedAt: review.sellerRespondedAt || undefined,
    txId: review.order?.transaction?.txId || undefined,
  }));
};

export const getReviewCnt = async (
  args: Omit<Prisma.ReviewFindManyArgs, "select" | "include"> = {}
): Promise<number> => {
  return prisma.review.count({
    where: args.where || {},
  });
};

export const getReviewsStats = async (
  args: Omit<Prisma.ReviewFindManyArgs, "select" | "include"> = {}
): Promise<ReviewStats> => {
  const stats = await prisma.review.findMany({
    ...args,
    select: {
      rating: true,
    },
  });

  const total = stats.length;
  const average =
    total > 0
      ? stats.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;
  return {
    total,
    average: parseFloat(average.toFixed(2)),
    distribution: getDistribution(stats, { min: 1, max: 5 }, "rating"),
  };
};

export async function leaveReview(data: {
  rating: number;
  title: string;
  description: string;
  orderId: string;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("You must be logged in to leave a review");
  }

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
    select: {
      id: true,
      status: true,
      completedAt: true,
      package: {
        select: {
          title: true,
          gig: {
            select: {
              id: true,
              title: true,
              sellerId: true,
            },
          },
        },
      },
      transaction: {
        select: {
          txId: true,
        },
      },
      review: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status !== "COMPLETED") {
    throw new Error("You can only leave a review for completed orders");
  }

  if (order.review) {
    throw new Error("You have already left a review for this order");
  }

  if (!order.transaction?.txId) {
    throw new Error("Transaction not found for this order");
  }

  if (
    order.completedAt &&
    new Date(order.completedAt).getTime() + 72 * 60 * 60 * 1000 < Date.now()
  ) {
    throw new Error(
      "You can only leave a review within 72 hours of order completion"
    );
  }

  const review = await prisma.review.create({
    data: {
      rating: data.rating,
      title: data.title,
      description: data.description,
      authorId: session.user.id,
      orderId: order.id,
      gigId: order.package.gig.id,
    },
  });

  await createNotification(
    order.package.gig.sellerId,
    "REVIEW",
    {
      reviewId: review.id,
      gigId: order.package.gig.id,
      rating: data.rating,
      transactionId: order.transaction.txId,
    },
    `You received a new review for your gig "${order.package.gig.title}"`
  );

  await prisma.$transaction(async (tx) => {
    await checkCommunityStarBadge(session.user.id, tx);
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath(`/orders/${data.orderId}/review`);
}
