"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { me } from "./auth";
import {
  Review,
  DashboardReview,
  Testimonial,
  ReviewStats,
  ReviewFilterParams,
} from "@/lib/types";
import { SellerResponseSchema } from "../schemas/review";

export async function getReviews(
  args: Omit<Prisma.ReviewFindManyArgs, "select" | "include">
): Promise<Review[]> {
  const data = await prisma.review.findMany({
    ...args,
    select: {
      id: true,
      rating: true,
      title: true,
      description: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
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
    author: review.author,
  }));
}

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
    sellerResponse: review.sellerResponse,
    sellerRespondedAt: review.sellerRespondedAt,
    author: review.author,
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
): Promise<Testimonial[]> {
  const data = await prisma.contactMessage.findMany({
    ...args,
    where: {
      ...("where" in args ? args.where : {}),
      type: "TESTIMONIAL",
      testimonialContent: {
        isNot: null,
      },
    },
    select: {
      id: true,
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      testimonialContent: {
        select: {
          content: true,
          rating: true,
        },
      },
    },
  });

  return data
    .filter((message) => message.author && message.testimonialContent)
    .map((message) => ({
      id: message.id,
      rating: message.testimonialContent!.rating,
      content: message.testimonialContent!.content,
      author: {
        id: message.author!.id,
        username: message.author!.username,
        firstName: message.author!.firstName,
        lastName: message.author!.lastName,
        avatar: message.author!.avatar,
      },
    }));
}

export async function updateReviewResponse({
  reviewId,
  response,
}: z.infer<typeof SellerResponseSchema>) {
  const {user,} = await me();

  if (!user?.isVerified) {
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

  if (review.gig.sellerId !== user.id) {
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

export async function deleteReviewResponse(reviewId: string) {
  const {user,} = await me();

  if (!user?.isVerified) {
    throw new Error("You must be logged in to delete review responses");
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: {
      id: true,
      sellerResponse: true,
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

  if (!review.gig || review.gig.sellerId !== user.id) {
    throw new Error(
      "You can only delete responses to reviews on your own gigs"
    );
  }

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      sellerResponse: null,
      sellerRespondedAt: null,
    },
  });

  revalidatePath("/dashboard/reviews");
  revalidatePath(`/gigs/${review.gig.id}`);
}

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
  const distribution: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = stats.filter((review) => review.rating === i).length;
  }
  return {
    total,
    average: parseFloat(average.toFixed(2)),
    distribution,
  };
};

export async function getFilteredReviews(params: ReviewFilterParams): Promise<{
  reviews: Review[];
  hasMore: boolean;
}> {
  const { rating, sort = "recent", skip = 0, take = 6 } = params;

  const where: Prisma.ReviewWhereInput = {};

  if (rating) {
    where.rating = parseInt(rating, 10);
  }

  let orderBy: Prisma.ReviewOrderByWithRelationInput = {};
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "highest":
      orderBy = { rating: "desc" };
      break;
    case "lowest":
      orderBy = { rating: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        rating: true,
        title: true,
        description: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  // Transform to Review type
  const transformedReviews: Review[] = reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    title: review.title,
    description: review.description,
    createdAt: review.createdAt,
    author: review.author,
  }));

  return {
    reviews: transformedReviews,
    hasMore: skip + take < totalCount,
  };
}
