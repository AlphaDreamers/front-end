"use client";

import { Prisma } from "@prisma/client";
import { Medal } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Icon, { LucideIconString } from "@/components/Icon";

const formatDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
}).format;

const AchievementsCard = ({
  badges = [],
}: {
  badges?: Prisma.BadgeGetPayload<{
    include: {
      userBadges: true;
    };
  }>[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="h-fit md:max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Medal className="text-primary mr-2" />
          Your Achievements
        </CardTitle>
        <CardDescription>
          Showcase your performance milestones to build credibility with
          potential buyers.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
          {badges.slice(0, isExpanded ? badges.length : 4).map((badge) => (
            <TooltipProvider key={badge.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="aspect-square flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors">
                    <CardContent className="text-center">
                      <div
                        className={cn(
                          "rounded-full bg-card size-16 flex items-center justify-center mx-auto mb-2 border-2"
                        )}
                        style={{
                          color: badge.color,
                        }}
                      >
                        <Icon icon={badge.icon as LucideIconString} size={28} />
                      </div>
                      <h4 className="font-semibold">{badge.label}</h4>
                      <p className="text-xs text-muted-foreground">
                        Earned {formatDate(badge.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>

                <TooltipContent side="top" className="max-w-[200px]">
                  {badge.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? "Show Less" : `Show More (${badges.length - 4})`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AchievementsCard;
