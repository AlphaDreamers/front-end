import { redirect } from "next/navigation";

import ActiveItemsCard from "@/components/dashboard/active-items-card";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { EarningsSummary } from "@/components/dashboard/earnings-summary";
import { PerformanceStats } from "@/components/dashboard/performance-stats";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=${encodeURIComponent(`/dashboard`)}`);
  }

  const userId = session.user.id;

  const [
    ordersInProgressCount,
    completedOrdersCount,
    pendingOrdersCount,
    disputedOrdersCount,
    completedOrdersForEarnings,
    lastMonthCompletedOrders,
    previousMonthCompletedOrders,
    userReviews,
    activeGigsCount,
    activeOrders,
    recentNotifications,
  ] = await Promise.all([
    prisma.order.count({
      where: {
        sellerId: userId,
        status: { in: ["PAID", "DELIVERED"] },
      },
    }),

    // Completed orders
    prisma.order.count({
      where: {
        sellerId: userId,
        status: "COMPLETED",
      },
    }),

    // Pending orders
    prisma.order.count({
      where: {
        sellerId: userId,
        status: "PENDING_PAYMENT",
      },
    }),

    // Disputed orders
    prisma.order.count({
      where: {
        sellerId: userId,
        status: "DISPUTE",
      },
    }),

    // All completed orders for earnings calculation
    prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "COMPLETED",
      },
      include: {
        package: {
          select: { price: true },
        },
      },
    }),

    // Last month completed orders
    prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "COMPLETED",
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      include: {
        package: {
          select: { price: true },
        },
      },
    }),

    // Previous month completed orders
    prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "COMPLETED",
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        },
      },
      include: {
        package: {
          select: { price: true },
        },
      },
    }),

    // Reviews for seller's gigs
    prisma.review.findMany({
      where: {
        gig: {
          sellerId: userId,
        },
      },
      select: {
        rating: true,
      },
    }),

    // Active gigs count (for gigs generating income)
    prisma.gig.count({
      where: {
        sellerId: userId,
        orders: {
          some: {
            status: "COMPLETED",
          },
        },
      },
    }),

    // Active orders for ActiveItemsCard
    prisma.order.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
        status: { in: ["PAID", "DELIVERED", "PENDING_PAYMENT"] },
      },
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        package: {
          select: {
            price: true,
            title: true,
          },
        },
        gig: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    }),

    // Recent notifications
    prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        type: true,
        title: true,
        createdAt: true,
        isRead: true,
        metadata: true,
      },
    }),
  ]);

  // Calculate earnings
  const totalEarnings = completedOrdersForEarnings.reduce(
    (sum, order) => sum + order.package.price,
    0
  );
  const lastMonthEarnings = lastMonthCompletedOrders.reduce(
    (sum, order) => sum + order.package.price,
    0
  );
  const previousMonthEarnings = previousMonthCompletedOrders.reduce(
    (sum, order) => sum + order.package.price,
    0
  );

  // Calculate performance stats
  const averageRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) /
        userReviews.length
      : 0;

  const totalReviews = userReviews.length;

  // Transform notifications to include description
  const notificationsWithDescription = recentNotifications.map(
    (notification) => ({
      ...notification,
      description: generateNotificationDescription(
        notification.type,
        notification.metadata
      ),
    })
  );

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
            ordersInProgress={ordersInProgressCount}
            completedOrders={completedOrdersCount}
            pendingOrders={pendingOrdersCount}
            disputedOrders={disputedOrdersCount}
          />

          <EarningsSummary
            totalEarnings={totalEarnings}
            lastMonthEarnings={lastMonthEarnings}
            previousMonthEarnings={previousMonthEarnings}
            gigsGeneratingIncome={activeGigsCount}
          />

          <PerformanceStats
            totalViews={1250} // Placeholder - views not tracked in schema
            lastMonthViews={340} // Placeholder
            previousMonthViews={290} // Placeholder
            completedOrders={completedOrdersCount}
            lastMonthOrders={lastMonthCompletedOrders.length}
            previousMonthOrders={previousMonthCompletedOrders.length}
            averageRating={Math.round(averageRating * 10) / 10} // Round to 1 decimal
            totalReviews={totalReviews}
            conversionRate={8.5} // Placeholder - conversion rate calculation would need view tracking
          />
        </div>

        {/* Main content grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recent activity */}
          <RecentActivityCard notifications={notificationsWithDescription} />
        </div>

        {/* Active orders and gigs */}
        <ActiveItemsCard orders={activeOrders} />
      </main>
    </div>
  );
}

// Helper function to generate notification descriptions
function generateNotificationDescription(type: string, metadata: any): string {
  switch (type) {
    case "ORDER_UPDATE":
      return "Your order status has been updated";
    case "MESSAGE":
      return "You have a new message";
    case "PAYMENT":
      return "Payment has been processed";
    case "REVIEW":
      return "You received a new review";
    default:
      return "You have a new notification";
  }
}
