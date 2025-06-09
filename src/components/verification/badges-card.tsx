"use client";

import * as LucideIcons from "lucide-react";
import { Award, Info } from "lucide-react";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";

import { BadgeWithProgress } from "@/lib/types";
import { getTierConfig, getNextTier } from "@/lib/utils";
import AchievementIcon from "./achievement-icon";

interface BadgesCardProps {
  badges: BadgeWithProgress[];
}

export function BadgesCard({ badges }: BadgesCardProps) {
  return (
    <Card className="overflow-hidden pb-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="text-primary mr-2" />
            Your Badges
          </div>
        </CardTitle>
        <CardDescription>
          Earn badges by completing tasks and achieving milestones. Badges
          showcase your skills and accomplishments to potential buyers.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Badge</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-center">Current Tier</TableHead>
              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {badges.map((badge) => {
              const IconComponent =
                LucideIcons[badge.icon] || LucideIcons.Award;
              const tierConfig = getTierConfig(badge.tier);

              return (
                <TableRow key={badge.id}>
                  {/* Badge Icon */}
                  <TableCell>
                    <AchievementIcon
                      icon={badge.icon}
                      color={badge.color}
                      tier={badge.tier}
                    />
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
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {badge.description}
                      </p>
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
                      <div className="text-right text-xs text-muted-foreground">
                        Next: {getNextTier(badge.tier).toLocaleLowerCase()}(
                        {`${badge.progress}/${badge.progressCap}`})
                      </div>
                      <Progress value={badge.progress} className="h-2" />
                    </div>
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
