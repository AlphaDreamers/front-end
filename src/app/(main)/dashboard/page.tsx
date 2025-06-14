import { redirect } from "next/navigation";

import ActiveItemsCard from "@/components/dashboard/active-items-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { EarningsSummary } from "@/components/dashboard/earnings-summary";
import { PerformanceStats } from "@/components/dashboard/performance-stats";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=${encodeURIComponent(`/dashboard`)}`);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back {session.user.firstName} {session.user.lastName}
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
