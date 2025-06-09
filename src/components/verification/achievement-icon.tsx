import { Tier } from "@prisma/client";
import * as LucideIcons from "lucide-react";

import { cn } from "@/lib/utils";

import { Color } from "@/lib/types";
import { getTierConfig } from "@/lib/utils";
import { LucideIconName } from "@/lib/types";

interface AchievementIconProps {
  tier: Tier;
  icon: LucideIconName;
  color: Color;
}

const AchievementIcon = ({ icon, tier, color }: AchievementIconProps) => {
  const IconComponent = (LucideIcons[icon] ||
    LucideIcons.Award) as LucideIcons.LucideIcon;
  const tierConfig = getTierConfig(tier);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center border-2 transition-all mx-auto group-hover:scale-110 size-16",
        tierConfig.borderColor,
        tierConfig.bgColor
      )}
      style={{ color: color }}
    >
      <IconComponent size={28} />
    </div>
  );
};
export default AchievementIcon;
