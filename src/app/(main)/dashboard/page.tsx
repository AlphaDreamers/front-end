import { redirect } from "next/navigation";
import { startOfMonth, subMonths, endOfMonth } from "date-fns";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrders } from "@/lib/actions/orders";
import { getNotifications } from "@/lib/actions/notifications";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import EarningsChart from "@/components/dashboard/earnings-chart";
import OrderStatusChart from "@/components/dashboard/order-status-chart";
import MonthlyComparisonChart from "@/components/dashboard/monthly-comparison-chart";
import RatingDistributionChart from "@/components/dashboard/rating-distribution-chart";
import RevenueByGigChart from "@/components/dashboard/revenue-by-gig-chart";
import ActiveOrdersCard from "@/components/dashboard/active-orders-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import PageTemplate from "@/components/templates/page-template";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=${encodeURIComponent(`/dashboard`)}`);
  }

  const userId = session.user.id;

  // Calculate date ranges
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));
  const sixMonthsAgo = subMonths(now, 6);

  const [
    orderStatusCounts,
    monthlyEarnings,
    userReviews,
    revenueByGig,
    activeOrders,
    recentNotifications,
    currentMonthOrders,
    lastMonthOrders,
  ] = await Promise.all([
    prisma.order.groupBy({
      by: ["status"],
      where: { sellerId: userId },
      _count: { status: true },
    }),

    prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "COMPLETED",
        completedAt: { gte: sixMonthsAgo },
      },
      include: {
        package: { select: { price: true } },
      },
      orderBy: { completedAt: "asc" },
    }),

    prisma.review.findMany({
      where: {
        gig: { sellerId: userId },
      },
      select: {
        rating: true,
        createdAt: true,
      },
    }),

    prisma.gig.findMany({
      where: { sellerId: userId },
      select: {
        id: true,
        title: true,
        orders: {
          where: { status: "COMPLETED" },
          select: {
            package: { select: { price: true } },
          },
        },
      },
    }),

    getOrders({
      where: {
        sellerId: userId,
        status: { in: ["PAID", "DELIVERED"] },
      },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),

    getNotifications({
      where: { recipientId: userId },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),

    prisma.order.count({
      where: {
        sellerId: userId,
        createdAt: { gte: currentMonthStart },
      },
    }),

    prisma.order.count({
      where: {
        sellerId: userId,
        createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    }),
  ]);

  const orderStatusData = orderStatusCounts.map((item) => ({
    status: item.status.replace(/_/g, " ").toLowerCase(),
    count: item._count.status,
  }));

  const monthlyEarningsMap = new Map<string, number>();
  monthlyEarnings.forEach((order) => {
    if (order.completedAt) {
      const monthKey = `${order.completedAt.getFullYear()}-${String(
        order.completedAt.getMonth() + 1
      ).padStart(2, "0")}`;
      const current = monthlyEarningsMap.get(monthKey) || 0;
      monthlyEarningsMap.set(monthKey, current + order.package.price);
    }
  });

  const earningsData = Array.from(monthlyEarningsMap.entries())
    .map(([month, earnings]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      earnings,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating: rating.toString(),
    count: userReviews.filter((r) => r.rating === rating).length,
  }));

  // Process revenue by gig
  const revenueByGigData = revenueByGig
    .map((gig) => ({
      name:
        gig.title.length > 20 ? gig.title.substring(0, 20) + "..." : gig.title,
      revenue: gig.orders.reduce((sum, order) => sum + order.package.price, 0),
    }))
    .filter((gig) => gig.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate comparison metrics
  const totalEarnings = monthlyEarnings.reduce(
    (sum, order) => sum + order.package.price,
    0
  );
  const averageRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) /
        userReviews.length
      : 0;

  return (
    <PageTemplate
      title={`Welcome back, ${session.user.firstName} ${session.user.lastName}`}
      description="Here's an overview of your performance and earnings"
    >
      <div className="flex flex-col gap-6">
        <DashboardHeader
          totalEarnings={totalEarnings}
          averageRating={averageRating}
          totalReviews={userReviews.length}
        />

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <EarningsChart data={earningsData} className="lg:col-span-2" />
          <OrderStatusChart data={orderStatusData} />
          <MonthlyComparisonChart
            currentMonth={currentMonthOrders}
            lastMonth={lastMonthOrders}
          />
          <RatingDistributionChart data={ratingDistribution} />
          <RevenueByGigChart data={revenueByGigData} />
        </div>

        {/* Activity Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActiveOrdersCard orders={activeOrders || []} />
          </div>
          <RecentActivityCard notifications={recentNotifications} />
        </div>
      </div>
    </PageTemplate>
  );
}
