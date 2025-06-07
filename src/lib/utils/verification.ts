// src/lib/utils/verification.ts

import { Tier } from "@prisma/client";
import * as LucideIcons from "lucide-react";
import { UserProfileFields } from "../types/verification";

// Tier configuration with colors and labels
export const TIER_CONFIG = {
  NONE: {
    label: "Not Started",
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    icon: "Circle",
  },
  BRONZE: {
    label: "Bronze",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/20",
    icon: "Medal",
  },
  SILVER: {
    label: "Silver",
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/20",
    icon: "Medal",
  },
  GOLD: {
    label: "Gold",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: "Medal",
  },
  PLATINUM: {
    label: "Platinum",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    icon: "Crown",
  },
  DIAMOND: {
    label: "Diamond",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
    icon: "Gem",
  },
} as const;

// Get tier configuration
export function getTierConfig(tier: Tier) {
  return TIER_CONFIG[tier];
}

// Get icon component from string
export function getIconComponent(iconName: string): React.ElementType {
  // Handle the case where the icon might not exist
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Award;
}

// Calculate progress percentage for a specific tier
export function calculateTierProgress(
  currentProgress: number,
  currentMilestone: { threshold: number; tier: Tier },
  nextMilestone?: { threshold: number; tier: Tier }
): number {
  if (!nextMilestone) {
    // This is the highest tier, show as complete if threshold is met
    return currentProgress >= currentMilestone.threshold ? 100 : 0;
  }

  const progressInTier = currentProgress - currentMilestone.threshold;
  const tierRange = nextMilestone.threshold - currentMilestone.threshold;

  if (progressInTier <= 0) return 0;
  if (progressInTier >= tierRange) return 100;

  return Math.round((progressInTier / tierRange) * 100);
}

// Get the next milestone for a badge
export function getNextMilestone(
  milestones: { threshold: number; tier: Tier }[],
  currentProgress: number
): { threshold: number; tier: Tier } | null {
  // Sort milestones by threshold ascending
  const sortedMilestones = [...milestones].sort(
    (a, b) => a.threshold - b.threshold
  );

  for (const milestone of sortedMilestones) {
    if (currentProgress < milestone.threshold) {
      return milestone;
    }
  }

  return null; // All milestones achieved
}

// Get current milestone for a badge
export function getCurrentMilestone(
  milestones: { threshold: number; tier: Tier }[],
  currentProgress: number
): { threshold: number; tier: Tier } | null {
  // Sort milestones by threshold descending
  const sortedMilestones = [...milestones].sort(
    (a, b) => b.threshold - a.threshold
  );

  for (const milestone of sortedMilestones) {
    if (currentProgress >= milestone.threshold) {
      return milestone;
    }
  }

  return null; // No milestone achieved yet
}

// Format progress display text
export function formatProgressText(current: number, total: number): string {
  if (total === -1) {
    // Special case for unbounded progress
    return `${current} completed`;
  }
  return `${current} / ${total}`;
}

// Get verification level configuration
export function getVerificationLevelConfig(
  level: "none" | "partial" | "complete"
) {
  const configs = {
    none: {
      label: "Not Verified",
      color: "text-gray-500",
      bgColor: "bg-gray-500/10",
      icon: "ShieldOff",
      description: "Complete the requirements to become a verified seller",
    },
    partial: {
      label: "Partially Verified",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      icon: "ShieldAlert",
      description:
        "You're on your way! Complete all requirements for full verification",
    },
    complete: {
      label: "Fully Verified",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      icon: "ShieldCheck",
      description: "Congratulations! You're a fully verified seller",
    },
  };

  return configs[level];
}

// Get color class based on percentage
export function getProgressColor(percentage: number): string {
  if (percentage === 100) return "text-green-500";
  if (percentage >= 75) return "text-blue-500";
  if (percentage >= 50) return "text-yellow-500";
  if (percentage >= 25) return "text-orange-500";
  return "text-gray-500";
}

// Format verification requirement text
export function formatRequirementText(
  type: "profile" | "kyc" | "orders",
  status: { isComplete: boolean; current?: number; required?: number }
): string {
  switch (type) {
    case "profile":
      return status.isComplete
        ? "Profile completed"
        : "Complete your profile information";

    case "kyc":
      return status.isComplete
        ? "KYC verification completed"
        : "Complete KYC verification";

    case "orders":
      if (status.isComplete) {
        return "Order requirement completed";
      }
      return `Complete ${status.current || 0} of ${status.required || 5} orders with positive ratings`;

    default:
      return "";
  }
}

// Sort badges by relevance (in-progress first, then by progress)
export function sortBadgesByRelevance(
  badges: Array<{ userProgress?: { currentProgress: number } }>
) {
  return badges.sort((a, b) => {
    const aProgress = a.userProgress?.currentProgress || 0;
    const bProgress = b.userProgress?.currentProgress || 0;

    // In-progress badges first (between 0 and 100)
    const aInProgress = aProgress > 0 && aProgress < 100;
    const bInProgress = bProgress > 0 && bProgress < 100;

    if (aInProgress && !bInProgress) return -1;
    if (!aInProgress && bInProgress) return 1;

    // Then sort by progress descending
    return bProgress - aProgress;
  });
}

// Check if a badge milestone is close to being achieved
export function isNearMilestone(
  currentProgress: number,
  nextMilestone: { threshold: number } | null,
  proximityPercentage: number = 0.9
): boolean {
  if (!nextMilestone) return false;
  return currentProgress >= nextMilestone.threshold * proximityPercentage;
}

// Calculate profile completion percentage
export function calculateProfileCompletion(user: UserProfileFields): Promise<{
  percentage: number;
  missingFields: string[];
}> {
  const fieldChecks = [
    { field: "firstName", label: "First name", value: user.firstName },
    { field: "lastName", label: "Last name", value: user.lastName },
    { field: "username", label: "Username", value: user.username },
    { field: "avatar", label: "Profile picture", value: user.avatar },
    { field: "banner", label: "Banner image", value: user.banner },
    { field: "headline", label: "Professional headline", value: user.headline },
    { field: "bio", label: "Bio description", value: user.bio },
    {
      field: "skills",
      label: "Skills",
      value: user.skills && user.skills.length > 0,
    },
    {
      field: "socialLinks",
      label: "Social links",
      value: user.socialLinks && user.socialLinks.length > 0,
    },
    {
      field: "portfolioItems",
      label: "Portfolio items",
      value: user.portfolioItems && user.portfolioItems.length > 0,
    },
  ];

  const filledFields = fieldChecks.filter((check) => Boolean(check.value));
  const missingFields = fieldChecks
    .filter((check) => !Boolean(check.value))
    .map((check) => check.label);

  const percentage = Math.round(
    (filledFields.length / fieldChecks.length) * 100
  );

  return { percentage, missingFields };
}
