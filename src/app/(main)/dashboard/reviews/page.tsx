import { redirect } from "next/navigation";

import ReviewStatsCard from "@/components/reviews/review-stats-card";
import SearchBar from "@/components/search-bar";
import Filters from "@/components/filters";
import {
  getDashboardReviews,
  getDashboardReviewsCount,
  getReviewsStats,
} from "@/lib/actions/review";
import DashboardReviewsList from "@/components/reviews/dashboard-reviews-list";
import Pagination from "@/components/pagination";
import { buildReviewFilter, REVIEW_FILTERS_CONFIG } from "@/lib/utils";

import Async from "@/components/async";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ReviewSearchParams } from "@/lib/types";

export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams: Promise<ReviewSearchParams>;
}) {
  const params = await searchParams;

  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/reviews`)}`
    );
  }

  const filterArgs = buildReviewFilter(params);

  const prismaArgs: Prisma.ReviewFindFirstArgs = {
    ...filterArgs,
    where: {
      ...filterArgs.where,
      order: {
        package: {
          gig: {
            sellerId: session.user.id,
          },
        },
      },
    },
  };

  const [reviews, totalPages] = await Promise.all([
    getDashboardReviews({
      where: {
        order: {
          package: {
            gig: {
              sellerId: session.user.id,
            },
          },
        },
      },
    }),
    getDashboardReviewsCount(prismaArgs),
  ]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your reputation and respond to client feedback
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Card */}
        <Async fetch={() => getReviewsStats(prismaArgs)}>
          {(stats) => <ReviewStatsCard statistics={stats} />}
        </Async>

        <div className="flex flex-col gap-4 w-full min-h-full lg:col-span-2">
          <SearchBar placeholder="Search reviews..." className="w-full" />
          <Filters
            filters={REVIEW_FILTERS_CONFIG}
            className="w-full min-h-full"
          />
        </div>
      </div>

      <DashboardReviewsList reviews={reviews} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
