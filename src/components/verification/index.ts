// src/components/verification/index.ts

// Export all verification components
export {
  VerificationStatusCard,
  VerificationStatusCardSkeleton,
} from "./verification-status-card";

export { BadgesCard, BadgesCardSkeleton } from "./badges-card";

export {
  AchievementsCard,
  AchievementsCardSkeleton,
} from "./achievements-card";

// Re-export types for convenience
export type {
  UserProfileFields,
  BadgeWithProgress,
  Achievement,
  VerificationStatus,
  DashboardStats,
  BadgeMilestone,
} from "@/lib/types/verification";
