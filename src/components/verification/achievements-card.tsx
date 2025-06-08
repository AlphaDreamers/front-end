// src/components/verification/achievements-card.tsx

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
import * as LucideIcons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Achievement } from "@/lib/types/verification";
import { getTierConfig } from "@/lib/utils/verification";
import { Tier } from "@prisma/client";

interface AchievementsCardProps {
  achievements: Achievement[];
  showLimit?: number;
}

export function AchievementsCard({
  achievements,
  showLimit = 6,
}: AchievementsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group achievements by tier for better organization
  const groupedAchievements = achievements.reduce(
    (acc, achievement) => {
      const tier = achievement.tier;
      if (!acc[tier]) {
        acc[tier] = [];
      }
      acc[tier].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  // Determine which achievements to show
  const displayedAchievements = isExpanded
    ? achievements
    : achievements.slice(0, showLimit);

  const hasMoreToShow = achievements.length > showLimit;

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

      <CardContent className="pt-6">
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
                    <AchievementCard achievement={achievement} />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <AchievementIcon achievement={achievement} size="lg" />
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
                          <div className="text-sm text-muted-foreground">
                            Not featured on your profile
                          </div>
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
                {Object.entries(groupedAchievements).map(
                  ([tier, tierAchievements]) => {
                    const tierConfig = getTierConfig(tier as Tier);
                    return (
                      <div key={tier} className="flex items-center gap-1">
                        <div className={cn("font-medium", tierConfig.color)}>
                          {tierAchievements.length}
                        </div>
                        <span className="text-muted-foreground">
                          {tierConfig.label}
                        </span>
                      </div>
                    );
                  }
                )}
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

// Individual achievement card component
interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "cursor-pointer aspect-square flex items-center justify-center group transition-all hover:scale-[101%]",
              Math.random() < 0.25 // 10% chance to be featured
                ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                : "bg-accent hover:bg-accent/80"
            )}
          >
            <CardContent className="text-center p-4">
              <AchievementIcon achievement={achievement} />
              <h4 className="font-medium text-sm mt-2 line-clamp-2">
                {achievement.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-xs">{achievement.description}</p>
          <p className="text-xs mt-1 font-medium">
            {getTierConfig(achievement.tier).label} Tier
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Loading skeleton
export function AchievementsCardSkeleton() {
  return (
    <Card className="h-fit md:max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Medal className="text-primary" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square">
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center p-4">
                  <Skeleton className="size-16 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto mt-2" />
                  <Skeleton className="h-3 w-16 mx-auto mt-1" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Achievement icon component
interface AchievementIconProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
}

function AchievementIcon({ achievement }: AchievementIconProps) {
  const IconComponent = (LucideIcons[
    achievement.icon as keyof typeof LucideIcons
  ] || LucideIcons.Award) as LucideIcons.LucideIcon;
  const tierConfig = getTierConfig(achievement.tier);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all mx-auto group-hover:scale-110 size-16",
        tierConfig.borderColor,
        tierConfig.bgColor
      )}
      style={{ color: achievement.color }}
    >
      <IconComponent size={28} />
    </div>
  );
}
