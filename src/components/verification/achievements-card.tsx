"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Medal,
  Star,
  ChevronDown,
  ChevronUp,
  Calendar,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Achievement } from "@/lib/types";
import { getTierConfig } from "@/lib/utils";
import { Tier } from "@prisma/client";
import AchievementIcon from "./achievement-icon";
import AchievementCard, { AchievementsCardSkeleton } from "./achievement-card";
import { toast } from "sonner";
import { setFeaturedBadge } from "@/lib/actions/verification";

interface AchievementsCardProps {
  achievements: Achievement[];
  showLimit?: number;
}

export function AchievementsCard({
  achievements,
  showLimit = 6,
}: AchievementsCardProps) {
  const [featuredBadgeId, setFeaturedBadgeId] = useState<string | null>(
    achievements.find((a) => a.isFeatured)?.id || null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const stats = achievements.reduce(
    (acc, achievement) => {
      const tier = achievement.tier;
      if (acc[tier]) {
        acc[tier]++;
      } else {
        acc[tier] = 1;
      }
      return acc;
    },
    {} as Record<Tier, number>
  );

  const displayedAchievements = isExpanded
    ? achievements
    : achievements.slice(0, showLimit);

  const hasMoreToShow = achievements.length > showLimit;

  const handleMakeFeatured = async (achievementId: string) =>
    toast.promise(async () => setFeaturedBadge(achievementId), {
      loading: "Setting as featured...",
      success: () => {
        setFeaturedBadgeId(achievementId);

        return "Achievement set as featured!";
      },
      error: "Failed to set achievement as featured.",
    });

  return (
    <Card className="h-fit md:max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Medal className="text-primary mr-2" />
            Your Achievements
          </div>
          {achievements.length > 0 && (
            <Badge variant="secondary">{achievements.length} Earned</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Showcase your performance milestones to build credibility with
          potential buyers. Featured achievements appear on your profile.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award className="size-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No achievements earned yet.</p>
            <p className="text-xs mt-1">
              Start completing badges to earn achievements!
            </p>
          </div>
        ) : (
          <>
            {/* All achievements grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
              {displayedAchievements.map((achievement) => (
                <Dialog key={achievement.id}>
                  <DialogTrigger>
                    <AchievementCard
                      achievement={achievement}
                      isFeatured={achievement.id === featuredBadgeId}
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <AchievementIcon
                          icon={achievement.icon}
                          tier={achievement.tier}
                          color={achievement.color}
                        />
                        {achievement.title}
                      </DialogTitle>
                      <DialogDescription className="mt-3 space-y-3">
                        <p>{achievement.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-3.5" />
                            Earned{" "}
                            {formatDistanceToNow(achievement.earnedAt, {
                              addSuffix: true,
                            })}
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              getTierConfig(achievement.tier).color,
                              getTierConfig(achievement.tier).borderColor
                            )}
                          >
                            {getTierConfig(achievement.tier).label}
                          </Badge>
                        </div>
                        {achievement.isFeatured ? (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Star className="size-3.5 fill-current" />
                            Featured on your profile
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMakeFeatured(achievement.id)}
                          >
                            <Star />
                            Make Featured
                          </Button>
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            {/* Show achievement tiers summary */}
            {!isExpanded && achievements.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-4 text-xs">
                {Object.entries(stats).map(([tier, tierAchievements]) => {
                  const tierConfig = getTierConfig(tier as Tier);
                  return (
                    <div key={tier} className="flex items-center gap-1">
                      <div className={cn("font-medium", tierConfig.color)}>
                        {tierAchievements}
                      </div>
                      <span className="text-muted-foreground">
                        {tierConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>

      {hasMoreToShow && (
        <>
          <Separator />
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown />
                  Show {achievements.length - showLimit} More
                </>
              )}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
export const AchievementsCardsSkeleton = () => {
  return (
    <Card className="h-fit md:max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Medal className="text-primary" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-full mt-2 bg-gray-200 rounded" />
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <AchievementsCardSkeleton key={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
