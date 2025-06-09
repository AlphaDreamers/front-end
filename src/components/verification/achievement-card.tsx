"use client";

import { formatDistanceToNow } from "date-fns";
import { Medal } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { Achievement } from "@/lib/types";
import { Color, LucideIconName } from "@/lib/types";
import AchievementIcon from "./achievement-icon";

interface AchievementCardProps {
  achievement: Achievement;
  isFeatured?: boolean;
}

const AchievementCard = ({
  achievement,
  isFeatured = false,
}: AchievementCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "cursor-pointer aspect-square flex items-center justify-center group transition-all hover:scale-[101%]",
              isFeatured
                ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                : "bg-accent hover:bg-accent/80"
            )}
          >
            <CardContent className="text-center p-4">
              <AchievementIcon
                icon={achievement.icon as LucideIconName}
                tier={achievement.tier}
                color={achievement.color as Color}
              />
              <h4 className="font-medium text-sm mt-2 line-clamp-2">
                {achievement.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <p className="text-xs">{achievement.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default AchievementCard;

export const AchievementsCardSkeleton = () => {
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
};
