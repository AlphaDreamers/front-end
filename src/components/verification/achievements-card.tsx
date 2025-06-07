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
import { getIconComponent, getTierConfig } from "@/lib/utils/verification";

interface AchievementsCardProps {
  achievements: Achievement[];
  showLimit?: number;
}

export function AchievementsCard({
  achievements,
  showLimit = 6,
}: AchievementsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

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

  // Get featured achievements
  const featuredAchievements = achievements.filter((a) => a.isFeatured);

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
            {/* Featured achievements section */}
            {featuredAchievements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Featured on Profile
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {featuredAchievements.slice(0, 2).map((achievement) => (
                    <FeaturedAchievementCard
                      key={achievement.id}
                      achievement={achievement}
                      onClick={() => setSelectedAchievement(achievement)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All achievements grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
              {displayedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => setSelectedAchievement(achievement)}
                />
              ))}
            </div>

            {/* Show achievement tiers summary */}
            {!isExpanded && achievements.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-4 text-xs">
                {Object.entries(groupedAchievements).map(
                  ([tier, tierAchievements]) => {
                    const tierConfig = getTierConfig(tier as any);
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
          <CardFooter className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-4 mr-2" />
                  Show {achievements.length - showLimit} More
                </>
              )}
            </Button>
          </CardFooter>
        </>
      )}

      {/* Achievement detail dialog */}
      <Dialog
        open={!!selectedAchievement}
        onOpenChange={() => setSelectedAchievement(null)}
      >
        <DialogContent>
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <AchievementIcon
                    achievement={selectedAchievement}
                    size="lg"
                  />
                  {selectedAchievement.title}
                </DialogTitle>
                <DialogDescription className="mt-3 space-y-3">
                  <p>{selectedAchievement.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      Earned{" "}
                      {formatDistanceToNow(selectedAchievement.earnedAt, {
                        addSuffix: true,
                      })}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        getTierConfig(selectedAchievement.tier).color,
                        getTierConfig(selectedAchievement.tier).borderColor
                      )}
                    >
                      {getTierConfig(selectedAchievement.tier).label}
                    </Badge>
                  </div>
                  {selectedAchievement.isFeatured && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Star className="size-3.5 fill-current" />
                      Featured on your profile
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Individual achievement card component
interface AchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

function AchievementCard({ achievement, onClick }: AchievementCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="aspect-square flex items-center justify-center bg-accent hover:bg-accent/80 transition-all cursor-pointer group"
            onClick={onClick}
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

// Featured achievement card with special styling
interface FeaturedAchievementCardProps {
  achievement: Achievement;
  onClick: () => void;
}

function FeaturedAchievementCard({
  achievement,
  onClick,
}: FeaturedAchievementCardProps) {
  const tierConfig = getTierConfig(achievement.tier);

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all hover:scale-105",
        "bg-gradient-to-br from-primary/5 to-primary/10",
        "border-primary/20"
      )}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2">
        <Star className="size-3.5 text-primary fill-primary" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <AchievementIcon achievement={achievement} size="sm" />
          <div className="flex-1 min-w-0">
            <h5 className="font-medium text-sm truncate">
              {achievement.title}
            </h5>
            <p className={cn("text-xs", tierConfig.color)}>
              {tierConfig.label}
            </p>
          </div>
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

function AchievementIcon({ achievement, size = "md" }: AchievementIconProps) {
  const IconComponent = getIconComponent(achievement.icon);
  const tierConfig = getTierConfig(achievement.tier);

  const sizeClasses = {
    sm: "size-10",
    md: "size-16",
    lg: "size-20",
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all",
        "group-hover:scale-110",
        sizeClasses[size],
        tierConfig.borderColor,
        tierConfig.bgColor
      )}
      style={{ color: achievement.color }}
    >
      <IconComponent size={iconSizes[size]} />
    </div>
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
