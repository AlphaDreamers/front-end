// src/app/(dashboard)/dashboard/verification-center/page.tsx

import { redirect } from "next/navigation";
import { Suspense } from "react";
import Async from "@/components/async";
import { me } from "@/lib/actions/auth";
import {
  getVerificationStatus,
  getBadgesWithProgress,
  getUserAchievements,
  getDashboardStats,
} from "@/lib/actions/verification";
import {
  VerificationStatusCard,
  VerificationStatusCardSkeleton,
} from "@/components/verification/verification-status-card";
import {
  BadgesCard,
  BadgesCardSkeleton,
} from "@/components/verification/badges-card";
import {
  AchievementsCard,
  AchievementsCardSkeleton,
} from "@/components/verification/achievements-card";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Dashboard stats component
function DashboardStatsCards({
  stats,
}: {
  stats: Awaited<ReturnType<typeof getDashboardStats>>;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Verification Progress"
        value={`${stats.verificationProgress}%`}
        icon={Shield}
        color="text-blue-500"
        bgColor="bg-blue-500/10"
      />
      <StatsCard
        title="Badges Earned"
        value={`${stats.earnedBadges}/${stats.totalBadges}`}
        icon={Award}
        color="text-purple-500"
        bgColor="bg-purple-500/10"
      />
      <StatsCard
        title="Achievements"
        value={stats.totalAchievements}
        icon={Trophy}
        color="text-yellow-500"
        bgColor="bg-yellow-500/10"
      />
      <StatsCard
        title="Featured"
        value={stats.featuredAchievements}
        icon={Star}
        color="text-green-500"
        bgColor="bg-green-500/10"
      />
    </div>
  );
}

// Individual stats card
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={cn("p-3 rounded-full", bgColor)}>
            <Icon className={cn("size-5", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats cards skeleton
function DashboardStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-7 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="size-11 bg-muted animate-pulse rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main page component
export default async function VerificationCenterPage() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/verification-center");
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl text-primary font-bold mb-2">
          Verification Center
        </h2>
        <p className="text-muted-foreground">
          Complete verification steps to increase visibility and trust with
          buyers. Earn badges and showcase your achievements to stand out in the
          marketplace.
        </p>
      </div>

      {/* Dashboard Statistics */}
      <Suspense fallback={<DashboardStatsCardsSkeleton />}>
        <Async fetch={() => getDashboardStats()}>
          {(stats) => <DashboardStatsCards stats={stats} />}
        </Async>
      </Suspense>

      {/* Main Content Grid */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Verification Status and Badges */}
        <div className="flex-1 space-y-6">
          {/* Verification Status Card */}
          <Suspense fallback={<VerificationStatusCardSkeleton />}>
            <Async fetch={() => getVerificationStatus(user.id)}>
              {(status) => <VerificationStatusCard status={status} />}
            </Async>
          </Suspense>

          {/* Badges Card */}
          <Suspense fallback={<BadgesCardSkeleton />}>
            <Async fetch={getBadgesWithProgress}>
              {(badges) => <BadgesCard badges={badges} />}
            </Async>
          </Suspense>
        </div>

        {/* Right Column - Achievements */}
        <div className="w-full md:max-w-md">
          <Suspense fallback={<AchievementsCardSkeleton />}>
            <Async fetch={getUserAchievements}>
              {(achievements) => (
                <AchievementsCard achievements={achievements} />
              )}
            </Async>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Page loading skeleton
export function VerificationCenterPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-primary font-bold mb-2">
          Verification Center
        </h2>
        <p className="text-muted-foreground">
          Complete verification steps to increase visibility and trust with
          buyers.
        </p>
      </div>

      <DashboardStatsCardsSkeleton />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <VerificationStatusCardSkeleton />
          <BadgesCardSkeleton />
        </div>
        <div className="w-full md:max-w-md">
          <AchievementsCardSkeleton />
        </div>
      </div>
    </div>
  );
}
