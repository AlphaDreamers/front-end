// src/components/profile/verification-status.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Award, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadge {
  badge: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  highestTier: string;
  currentProgress: number;
  isFeatured: boolean;
}

interface VerificationStatusProps {
  badges: VerificationBadge[];
  className?: string;
}

const tierColors = {
  BRONZE: "text-orange-600 bg-orange-600/10 border-orange-600/20",
  SILVER: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  GOLD: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  PLATINUM: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  DIAMOND: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const tierIcons = {
  BRONZE: Trophy,
  SILVER: Trophy,
  GOLD: Trophy,
  PLATINUM: Award,
  DIAMOND: Award,
};

export function VerificationStatus({
  badges,
  className,
}: VerificationStatusProps) {
  // Sort badges by tier priority (featured first, then by tier level)
  const sortedBadges = [...badges].sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }
    // Compare tier levels
    const tierOrder = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE"];
    return tierOrder.indexOf(a.highestTier) - tierOrder.indexOf(b.highestTier);
  });

  const featuredBadge = sortedBadges.find((b) => b.isFeatured);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="size-5 text-primary" />
          Achievements & Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Badge */}
        {featuredBadge && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-12 rounded-full flex items-center justify-center",
                  tierColors[
                    featuredBadge.highestTier as keyof typeof tierColors
                  ]
                )}
              >
                <Award className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{featuredBadge.badge.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    Featured
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {featuredBadge.badge.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress
                    value={featuredBadge.currentProgress}
                    className="h-1.5 flex-1"
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      tierColors[
                        featuredBadge.highestTier as keyof typeof tierColors
                      ].split(" ")[0]
                    )}
                  >
                    {featuredBadge.highestTier}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Badges */}
        {sortedBadges.filter((b) => !b.isFeatured).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Other Achievements
            </h4>
            <div className="space-y-2">
              {sortedBadges
                .filter((b) => !b.isFeatured)
                .map((badge) => {
                  const Icon =
                    tierIcons[badge.highestTier as keyof typeof tierIcons] ||
                    Trophy;
                  return (
                    <div
                      key={badge.badge.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center",
                          tierColors[
                            badge.highestTier as keyof typeof tierColors
                          ]
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {badge.badge.title}
                        </p>
                        <p
                          className={cn(
                            "text-xs",
                            tierColors[
                              badge.highestTier as keyof typeof tierColors
                            ].split(" ")[0]
                          )}
                        >
                          {badge.highestTier}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="pt-3 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {badges.length} Achievement{badges.length !== 1 ? "s" : ""} Earned
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
