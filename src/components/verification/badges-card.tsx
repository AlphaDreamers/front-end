// src/components/verification/badges-card.tsx

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, Info, MoreVertical, Star, Eye, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeWithProgress } from "@/lib/types/verification";
import {
  getIconComponent,
  getTierConfig,
  getCurrentMilestone,
  getNextMilestone,
  calculateTierProgress,
  formatProgressText,
  sortBadgesByRelevance,
  isNearMilestone,
} from "@/lib/utils/verification";

interface BadgesCardProps {
  badges: BadgeWithProgress[];
}

type FilterType = "all" | "in-progress" | "completed" | "not-started";

export function BadgesCard({ badges }: BadgesCardProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showConditions, setShowConditions] = useState<Record<string, boolean>>(
    {}
  );

  // Filter badges based on selected filter
  const filteredBadges = badges.filter((badge) => {
    const progress = badge.userProgress?.currentProgress || 0;

    switch (filter) {
      case "in-progress":
        return progress > 0 && progress < 100;
      case "completed":
        return (
          badge.userProgress?.highestTier !== "NONE" &&
          badge.userProgress?.highestTier !== undefined
        );
      case "not-started":
        return progress === 0;
      default:
        return true;
    }
  });

  // Sort badges by relevance
  const sortedBadges = sortBadgesByRelevance(filteredBadges);

  // Toggle condition visibility for a badge
  const toggleCondition = (badgeId: string) => {
    setShowConditions((prev) => ({
      ...prev,
      [badgeId]: !prev[badgeId],
    }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Award className="text-primary mr-2" />
              Your Badges
            </CardTitle>
            <CardDescription>
              Earn badges by completing tasks and achieving milestones. Badges
              showcase your skills and accomplishments to potential buyers.
            </CardDescription>
          </div>

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="size-4" />
                {filter === "all"
                  ? "All Badges"
                  : filter === "in-progress"
                    ? "In Progress"
                    : filter === "completed"
                      ? "Completed"
                      : "Not Started"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All Badges ({badges.length})
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("in-progress")}>
                In Progress (
                {
                  badges.filter((b) => {
                    const p = b.userProgress?.currentProgress || 0;
                    return p > 0 && p < 100;
                  }).length
                }
                )
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Completed (
                {
                  badges.filter(
                    (b) =>
                      b.userProgress?.highestTier !== "NONE" &&
                      b.userProgress?.highestTier !== undefined
                  ).length
                }
                )
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("not-started")}>
                Not Started (
                {badges.filter((b) => !b.userProgress?.currentProgress).length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <Table>
          <TableCaption className="pb-4">
            {sortedBadges.length === 0 ? (
              <span>No badges found for the selected filter.</span>
            ) : (
              <span>
                Your badges and progress towards earning new ones. Complete
                tasks to unlock higher tiers.
              </span>
            )}
          </TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Badge</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-center">Current Tier</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedBadges.map((badge) => {
              const IconComponent = getIconComponent(badge.icon);
              const progress = badge.userProgress?.currentProgress || 0;
              const currentTier = badge.userProgress?.highestTier || "NONE";
              const tierConfig = getTierConfig(currentTier);

              const currentMilestone = getCurrentMilestone(
                badge.milestones,
                progress
              );
              const nextMilestone = getNextMilestone(
                badge.milestones,
                progress
              );
              const tierProgress =
                currentMilestone && nextMilestone
                  ? calculateTierProgress(
                      progress,
                      currentMilestone,
                      nextMilestone
                    )
                  : currentMilestone
                    ? 100
                    : 0;

              const isNearNextMilestone = isNearMilestone(
                progress,
                nextMilestone
              );
              const showCondition = showConditions[badge.id];

              return (
                <TableRow key={badge.id} className="group">
                  {/* Badge Icon */}
                  <TableCell>
                    <div
                      className={cn(
                        "rounded-full size-12 flex items-center justify-center mx-auto border-2 transition-all",
                        tierConfig.borderColor,
                        tierConfig.bgColor
                      )}
                      style={{ color: badge.color }}
                    >
                      <IconComponent size={24} />
                    </div>
                  </TableCell>

                  {/* Badge Details */}
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{badge.title}</h4>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <h5 className="font-medium mb-1">
                                {badge.title}
                              </h5>
                              <p className="text-xs">{badge.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {isNearNextMilestone && (
                          <Badge variant="secondary" className="text-xs">
                            Almost there!
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {badge.description}
                      </p>

                      {/* Expandable condition */}
                      {showCondition && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <strong>How to earn:</strong> {badge.condition}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Current Tier */}
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          tierConfig.color,
                          tierConfig.borderColor
                        )}
                      >
                        {tierConfig.label}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    <div className="space-y-2">
                      {nextMilestone ? (
                        <>
                          <div className="text-right text-xs text-muted-foreground">
                            Next: {getTierConfig(nextMilestone.tier).label}(
                            {formatProgressText(
                              progress,
                              nextMilestone.threshold
                            )}
                            )
                          </div>
                          <Progress value={tierProgress} className="h-2" />
                        </>
                      ) : currentMilestone ? (
                        <div className="text-right">
                          <Badge variant="default" className="bg-green-600">
                            <Star className="size-3 mr-1" />
                            Max tier achieved!
                          </Badge>
                        </div>
                      ) : (
                        <>
                          <div className="text-right text-xs text-muted-foreground">
                            Start earning this badge
                          </div>
                          <Progress value={0} className="h-2" />
                        </>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toggleCondition(badge.id)}
                        >
                          <Eye className="size-4 mr-2" />
                          {showCondition ? "Hide" : "Show"} Requirements
                        </DropdownMenuItem>
                        {badge.userProgress && currentTier !== "NONE" && (
                          <DropdownMenuItem>
                            <Star className="size-4 mr-2" />
                            Feature on Profile
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
export function BadgesCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Award className="text-primary mr-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        <div className="p-8 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-2 w-32" />
              <Skeleton className="size-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
