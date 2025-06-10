import { redirect } from "next/navigation";

import ActiveItemsCard from "@/components/dashboard/active-items-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import { me } from "@/lib/actions/auth";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { EarningsSummary } from "@/components/dashboard/earnings-summary";
import { PerformanceStats } from "@/components/dashboard/performance-stats";

export default async function DashboardPage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">
            Manage your gigs, orders, and earnings all in one place. Whether
            you&apos;re a buyer or seller, we&apos;ve got you covered.
          </p>
        </div>
      </div>

      <main className="flex flex-col gap-8">
        <div>
          <StatsSummary
            ordersInProgress={0}
            completedOrders={0}
            pendingOrders={0}
            disputedOrders={0}
          />

          <EarningsSummary
            totalEarnings={0}
            lastMonthEarnings={0}
            previousMonthEarnings={0}
            gigsGeneratingIncome={0}
          />
          <PerformanceStats
            totalViews={0}
            lastMonthViews={0}
            previousMonthViews={0}
            completedOrders={0}
            lastMonthOrders={0}
            previousMonthOrders={0}
            averageRating={0}
            totalReviews={0}
            conversionRate={0}
          />
        </div>

        {/* Main content grid */}
        <div className="flex flex-col lg:flex-row  gap-6">
          {/* Wallet widget */}

          {/* Recent activity */}
          <RecentActivityCard notifications={[]} />
        </div>

        {/* Active orders and gigs */}
        <ActiveItemsCard orders={[]} />
      </main>
    </div>
  );
}
