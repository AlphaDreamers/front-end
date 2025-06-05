// app/dashboard/reviews/page.tsx
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { prisma } from "@/lib/prisma";
import { me } from "@/lib/actions/auth";
import ReviewsContent from "@/components/reviews/reviews-content";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewStatsCard from "@/components/reviews/review-stats-card";
import { SearchBar } from "@/components/search-bar";
import Filters from "@/components/filter-card";
import { updateReviewResponse } from "@/lib/actions/review";

// Function to calculate review statistics
async function getReviewStats(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      gig: {
        sellerId: userId,
      },
    },
    select: {
      rating: true,
    },
  });

  // Calculate distribution
  const distribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let totalRating = 0;
  reviews.forEach((review) => {
    distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    totalRating += review.rating;
  });

  return {
    total: reviews.length,
    average: reviews.length > 0 ? totalRating / reviews.length : 0,
    distribution,
  };
}

// Function to get filtered reviews
async function getFilteredReviews(
  userId: string,
  searchParams: { [key: string]: string | string[] | undefined }
) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = searchParams.q as string | undefined;
  const rating = searchParams.rating as string | undefined;
  const hasResponse = searchParams.hasResponse as string | undefined;

  // Build where clause for filtering
  const where: any = {
    gig: {
      sellerId: userId,
    },
  };

  // Add search filter
  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        author: {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  // Add rating filter
  if (rating) {
    where.rating = parseInt(rating);
  }

  // Add response filter
  if (hasResponse === "true") {
    where.sellerResponse = {
      not: null,
    };
  } else if (hasResponse === "false") {
    where.sellerResponse = null;
  }

  // Get total count for pagination
  const totalCount = await prisma.review.count({ where });

  // Get paginated reviews
  const reviews = await prisma.review.findMany({
    where,
    select: {
      id: true,
      rating: true,
      title: true,
      description: true,
      sellerResponse: true,
      sellerRespondedAt: true,
      createdAt: true,
      order: {
        select: {
          id: true,
          // You can add transaction hash here if you store it in orders
        },
      },
      gig: {
        select: {
          id: true,
          title: true,
        },
      },
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
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });

  return {
    reviews,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await me();
  if (!user?.isVerified) {
    redirect("/sign-in?callbackUrl=/dashboard/reviews");
  }

  // Get review statistics
  const stats = await getReviewStats(user.id);

  // Get filtered reviews
  const { reviews, totalPages } = await getFilteredReviews(
    user.id,
    searchParams
  );

  // Define filters for the filter card
  const filters = [
    {
      id: "rating",
      label: "Rating",
      type: "select" as const,
      options: [
        { label: "5 Stars", value: "5" },
        { label: "4 Stars", value: "4" },
        { label: "3 Stars", value: "3" },
        { label: "2 Stars", value: "2" },
        { label: "1 Star", value: "1" },
      ],
    },
    {
      id: "hasResponse",
      label: "Response Status",
      type: "select" as const,
      options: [
        { label: "With Response", value: "true" },
        { label: "Without Response", value: "false" },
      ],
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Reviews Dashboard
        </h1>
        <p className="text-gray-400">
          Manage your reputation and respond to client feedback
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Card */}
        <ReviewStatsCard statistics={stats} />

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-4" />
              Filter Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SearchBar placeholder="Search reviews..." />
            <Filters filters={filters} />
          </CardContent>
        </Card>
      </div>

      {/* Reviews List Component (Client Component) */}
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ReviewsContent
          initialReviews={reviews}
          totalPages={totalPages}
          updateReviewResponse={updateReviewResponse}
        />
      </Suspense>
    </div>
  );
}
