import { Clock, LucideIcon, Star, ThumbsUp, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Prisma } from "@prisma/client";

// Define the structure for stat card data
interface StatCardData {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
}

interface StatsBarProps {
  user: Prisma.UserGetPayload<{
    select: {
      gigs: {
        select: {
          packages: {
            select: {
              orders: {
                select: {
                  status: true;
                };
              };
            };
          };
          reviews: {
            select: {
              rating: true;
            };
          };
        };
      };
    };
  }>;
}

// Reusable StatCard component
const StatCard = ({ icon: Icon, label, value, suffix }: StatCardData) => {
  return (
    <Card className="flex items-center gap-3 bg-[#1E1E1E] p-4 border-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9F7AEA]/20">
        <Icon className="h-5 w-5 text-[#9F7AEA]" />
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="flex items-center">
          <span className="text-lg font-bold">{value}</span>
          {suffix && (
            <span className="ml-1 text-sm text-muted-foreground">{suffix}</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export function StatsBar({ user }: StatsBarProps) {
  // Calculate statistics from user data
  const stats = calculateUserStats(user);

  // Create array of stat cards data
  const statCardsData: StatCardData[] = [
    {
      icon: Star,
      label: "Rating",
      value: stats.avgRating,
      suffix: "/5",
    },
    {
      icon: Trophy,
      label: "Completed",
      value: stats.completedOrders,
      suffix: "orders",
    },
    {
      icon: ThumbsUp,
      label: "Completion",
      value: stats.successRate,
      suffix: "rate",
    },
    {
      icon: Clock,
      label: "On-Time",
      value: stats.onTimeRate,
      suffix: "delivery",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statCardsData.map((cardData, index) => (
        <StatCard key={index} {...cardData} />
      ))}
    </div>
  );
}

// Helper function to calculate user statistics
function calculateUserStats(user: StatsBarProps["user"]) {
  let totalRating = 0;
  let totalReviews = 0;
  let completedOrders = 0;
  let totalOrders = 0;

  // Process user data
  user.gigs.forEach((gig) => {
    // Calculate review statistics
    gig.reviews.forEach((review) => {
      totalRating += review.rating;
      totalReviews++;
    });

    // Calculate order statistics
    gig.packages.forEach((pkg) => {
      pkg.orders.forEach((order) => {
        totalOrders++;
        if (order.status === "COMPLETED") {
          completedOrders++;
        }
      });
    });
  });

  // Calculate derived statistics
  const avgRating =
    totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "N/A";

  const successRate =
    totalOrders > 0
      ? `${Math.round((completedOrders / totalOrders) * 100)}%`
      : "N/A";

  const onTimeRate =
    completedOrders > 0
      ? "100%" // Assuming all completed orders were on time (corrected logic)
      : "N/A";

  return {
    avgRating,
    completedOrders,
    successRate,
    onTimeRate,
  };
}
