"use client";

import { Award, Zap, Link, TrendingUp, Bitcoin } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Prisma } from "@prisma/client";

interface BadgeSelectorProps {
  badges: Prisma.UserBadgeProgressGetPayload<{
    select: {
      isFeatured: true;

      badge: {
        select: {
          title: true;
        };
      };
    };
  }>;
  selectedBadge: string;
  onChange: (badgeId: string) => void;
}

export function BadgeSelector({
  badges,
  selectedBadge,
  onChange,
}: BadgeSelectorProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Select one badge to display next to your name on your profile. This
        badge will be visible to all users.
      </p>

      <RadioGroup
        value={selectedBadge}
        onValueChange={onChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {badges.map((badge) => (
          <div key={badge.id} className="relative">
            <RadioGroupItem
              value={badge.id}
              id={badge.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={badge.id}
              className="flex items-center gap-3 p-4 rounded-lg border-2 border-muted/30 bg-muted/10 cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
            >
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center border-2 bg-gradient-to-br shadow-lg`}
              >
                <Award />
              </div>

              <div className="flex-1">
                <div className="font-medium">{badge.name}</div>
                <div className="text-xs text-muted-foreground">
                  {badge.description}
                </div>
                <div className="text-xs capitalize mt-1 inline-block px-2 py-0.5 rounded-full bg-muted/20">
                  {badge.rarity}
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {badges.length === 0 && (
        <p className="text-muted-foreground text-sm italic">
          You haven't earned any badges yet. Complete projects and receive
          positive reviews to earn badges!
        </p>
      )}
    </div>
  );
}
