"use client";

import { Wallet, Star } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
}

export default function DashboardHeader({
  userName,
  totalEarnings,
  averageRating,
  totalReviews,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your performance and earnings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </p>
              <p className="text-2xl font-bold">
                {totalEarnings.toFixed(2)} SOL
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">
                  ({totalReviews} reviews)
                </p>
              </div>
            </div>
            <div className="rounded-full bg-yellow-500/10 p-3">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
