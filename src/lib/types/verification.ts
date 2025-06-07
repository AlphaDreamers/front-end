// src/lib/types/verification.ts

import { Tier } from "@prisma/client";

// User profile fields for calculating completion
export interface UserProfileFields {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string | null;
  banner: string | null;
  headline: string | null;
  bio: string | null;
  isKycVerified: boolean;
  skills?: { id: string }[];
  socialLinks?: { id: string }[];
  portfolioItems?: { id: string }[];
}

// Badge with user progress
export interface BadgeWithProgress {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  condition: string;
  milestones: BadgeMilestone[];
  userProgress?: {
    currentProgress: number;
    highestTier: Tier;
    isFeatured: boolean;
  };
}

// Badge milestone
export interface BadgeMilestone {
  id: string;
  threshold: number;
  tier: Tier;
}

// Achievement display data
export interface Achievement {
  id: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  tier: Tier;
  isFeatured: boolean;
  earnedAt: Date;
  milestone: BadgeMilestone;
}

// Verification status summary
export interface VerificationStatus {
  profileCompletion: {
    percentage: number;
    missingFields: string[];
    isComplete: boolean;
  };
  kycVerification: {
    isVerified: boolean;
    verifiedAt?: Date;
  };
  orderRequirement: {
    completed: number;
    required: number;
    percentage: number;
    isComplete: boolean;
  };
  overallStatus: {
    isFullyVerified: boolean;
    verificationLevel: "none" | "partial" | "complete";
  };
}

// Dashboard statistics
export interface DashboardStats {
  totalBadges: number;
  earnedBadges: number;
  totalAchievements: number;
  featuredAchievements: number;
  verificationProgress: number;
}
