import { redirect } from "next/navigation";
import { Filter as FilterIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ReviewStatsCard from "@/components/reviews/review-stats-card";
import SearchBar from "@/components/search-bar";
import Filters, { FilterType } from "@/components/filter-card";
import {
  getDashboardReviews,
  getDashboardReviewsCount,
  getReviewsStats,
} from "@/lib/actions/review";
import DashboardReviewsList from "@/components/reviews/dashboard-reviews-list";
import Pagination from "@/components/pagination";
import { getDashboardReviewsFilters } from "@/lib/utils";
import { me } from "@/lib/actions/auth";
import Async from "@/components/async";
import { Prisma } from "@prisma/client";

export default async function DashboardReviewsPage({
  searchParams,
}: {
  searchParams: Promise<>;
}) {
  const params = await searchParams;

  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/reviews`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  const filterArgs = getDashboardReviewsFilters(params);

  const prismaArgs: Prisma.ReviewFindFirstArgs = {
    ...filterArgs,
    where: {
      ...filterArgs.where,
      gig: {
        sellerId: user.id,
      },
    },
  };

  const [reviews, totalPages] = await Promise.all([
    getDashboardReviews(prismaArgs),
    getDashboardReviewsCount(prismaArgs),
  ]);

  const filters: FilterType[] = [
    {
      id: "sortBy",
      label: "Sort By",
      type: "select",
      options: [
        { label: "Newest", value: "createdAt" },
        { label: "Highest Rating", value: "rating" },
      ],
    },
    {
      id: "order",
      label: "Order",
      type: "select",
      options: [
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
      ],
    },
    {
      id: "filterBy",
      label: "Filter By",
      type: "select",
      options: [
        { label: "All Reviews", value: "all" },
        { label: "Responded", value: "responded" },
        { label: "Unresponded", value: "unresponded" },
      ],
    },
  ];

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

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="size-4" />
              Filter Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SearchBar placeholder="Search reviews..." />
            <Filters filters={filters} />
          </CardContent>
        </Card>
      </div>

      <DashboardReviewsList reviews={reviews} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}
