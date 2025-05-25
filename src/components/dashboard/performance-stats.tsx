"use client";

import { Eye, ShoppingBag, Star, BarChart3 } from "lucide-react";
import { StatCard, StatCardProps } from "./stat-card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PERFORMANCE_STATS_CONFIG: ((...args: any[]) => StatCardProps)[] = [
  (totalViews: number, lastMonthViews: number, previousMonthViews: number) => ({
    variant: "blue" as const,
    size: "sm" as const,
    type: lastMonthViews > previousMonthViews ? "trend-up" : "trend-down",
    config: {
      label: "Profile Views",
      percentChange:
        ((lastMonthViews - previousMonthViews) / previousMonthViews) * 100,
      text: "from last month",
      value: totalViews,
      icon: Eye,
    },
  }),
  (
    completedOrders: number,
    lastMonthOrders: number,
    previousMonthOrders: number
  ) => ({
    variant: "purple" as const,
    size: "sm" as const,
    type: lastMonthOrders > previousMonthOrders ? "trend-up" : "trend-down",
    config: {
      label: "Completed Orders",
      percentChange:
        ((lastMonthOrders - previousMonthOrders) / previousMonthOrders) * 100,
      text: "from last month",
      value: completedOrders,
      icon: ShoppingBag,
    },
  }),
  (averageRating: number, totalReviews: number) => ({
    variant: "yellow" as const,
    size: "sm" as const,
    type: "rating" as const,
    config: {
      label: "Average Rating",
      text: `${totalReviews} reviews`,
      value: averageRating,
      icon: Star,
    },
  }),
  (conversionRate: number) => ({
    variant: "green" as const,
    size: "sm" as const,
    type: "progress" as const,
    config: {
      label: "Conversion Rate",
      value: conversionRate,
      text: "Views to orders",
      icon: BarChart3,
    },
  }),
];

interface PerformanceStatsProps {
  totalViews?: number;
  lastMonthViews?: number;
  previousMonthViews?: number;
  completedOrders?: number;
  lastMonthOrders?: number;
  previousMonthOrders?: number;
  averageRating?: number;
  totalReviews?: number;
  conversionRate?: number;
}

export function PerformanceStats({
  totalViews = 0,
  lastMonthViews = 0,
  previousMonthViews = 0,
  completedOrders = 0,
  lastMonthOrders = 0,
  previousMonthOrders = 0,
  averageRating = 0,
  totalReviews = 0,
  conversionRate = 0,
}: PerformanceStatsProps) {
  const values = [
    [totalViews, lastMonthViews, previousMonthViews],
    [completedOrders, lastMonthOrders, previousMonthOrders],
    [averageRating, totalReviews],
    [conversionRate],
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {PERFORMANCE_STATS_CONFIG.map((item, index) => (
        <StatCard key={index} {...item(...values[index])} />
      ))}
    </div>
  );
}
