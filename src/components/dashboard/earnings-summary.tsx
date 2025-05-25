"use client";
import { Wallet, Plus } from "lucide-react";
import { StatCard, StatCardProps } from "./stat-card";

const EARNINGS_CONFIG: ((...args: any[]) => StatCardProps)[] = [
  (
    totalEarnings: number,
    lastMonthEarnings: number,
    previousMonthEarnings: number
  ) => ({
    variant: "purple" as const,
    size: "lg" as const,
    type: lastMonthEarnings > previousMonthEarnings ? "trend-up" : "trend-down",
    config: {
      label: "Total Earnings",
      text: "from last month",
      value: totalEarnings,
      percentChange:
        ((lastMonthEarnings - previousMonthEarnings) / previousMonthEarnings) *
        100,
      icon: Wallet,
      suffix: "SOL",
    },
  }),
  (gigsGeneratingIncome: number) => ({
    variant: "blue" as const,
    size: "lg" as const,
    type: "link" as const,
    config: {
      label: "Active Gigs",
      text: "Generating income",
      value: gigsGeneratingIncome,
      icon: Plus,
      href: "/dashboard/gigs/active",
    },
  }),
];

interface EarningsSummaryProps {
  totalEarnings?: number;
  lastMonthEarnings?: number;
  previousMonthEarnings?: number;
  gigsGeneratingIncome?: number;
}

export function EarningsSummary({
  totalEarnings = 0,
  lastMonthEarnings = 0,
  previousMonthEarnings = 0,
  gigsGeneratingIncome = 0,
}: EarningsSummaryProps) {
  const values = [
    [totalEarnings, lastMonthEarnings, previousMonthEarnings],
    [gigsGeneratingIncome],
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      {EARNINGS_CONFIG.map((item, index) => (
        <div key={index} className="flex-1">
          <StatCard key={index} {...item(...values[index])} />
        </div>
      ))}
    </div>
  );
}
