"use server";

// src/lib/actions/verification.ts

import { prisma } from "@/lib/prisma";
import { me } from "./auth";
import {
  UserProfileFields,
  BadgeWithProgress,
  Achievement,
  VerificationStatus,
  DashboardStats,
} from "@/lib/types/verification";
import { Tier } from "@prisma/client";
import { calculateProfileCompletion } from "../utils/verification";

// Get detailed user information for profile completion calculation
export async function getDetailedUserProfile(
  userId: string
): Promise<UserProfileFields> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      avatar: true,
      banner: true,
      headline: true,
      bio: true,
      isKycVerified: true,
      skills: {
        select: { id: true },
      },
      socialLinks: {
        select: { id: true },
      },
      portfolioItems: {
        select: { id: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

// Get the count of completed orders with positive ratings
export async function getCompletedOrdersWithPositiveRating(
  userId: string
): Promise<number> {
  return await prisma.order.count({
    where: {
      sellerId: userId,
      status: "COMPLETED",
      review: {
        rating: {
          gt: 2.5, // Positive rating threshold
        },
      },
    },
  });
}

// Get comprehensive verification status
export async function getVerificationStatus(
  userId: string
): Promise<VerificationStatus> {
  const [userProfile, completedOrders] = await Promise.all([
    getDetailedUserProfile(userId),
    getCompletedOrdersWithPositiveRating(userId),
  ]);

  const profileCompletion = calculateProfileCompletion(userProfile);
  const requiredOrders = 5; // Business rule: 5 orders required for verification

  const orderPercentage = Math.min(
    100,
    Math.round((completedOrders / requiredOrders) * 100)
  );

  const isFullyVerified =
    profileCompletion.percentage === 100 &&
    userProfile.isKycVerified &&
    completedOrders >= requiredOrders;

  let verificationLevel: "none" | "partial" | "complete" = "none";
  if (isFullyVerified) {
    verificationLevel = "complete";
  } else if (
    profileCompletion.percentage > 0 ||
    userProfile.isKycVerified ||
    completedOrders > 0
  ) {
    verificationLevel = "partial";
  }

  return {
    profileCompletion: {
      percentage: profileCompletion.percentage,
      missingFields: profileCompletion.missingFields,
      isComplete: profileCompletion.percentage === 100,
    },
    kycVerification: {
      isVerified: userProfile.isKycVerified,
      // verifiedAt could be added if you track this in the database
    },
    orderRequirement: {
      completed: completedOrders,
      required: requiredOrders,
      percentage: orderPercentage,
      isComplete: completedOrders >= requiredOrders,
    },
    overallStatus: {
      isFullyVerified,
      verificationLevel,
    },
  };
}

// Get all badges with user progress
export async function getBadgesWithProgress(): Promise<BadgeWithProgress[]> {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const badges = await prisma.badge.findMany({
    include: {
      milestones: {
        orderBy: {
          threshold: "asc",
        },
      },
      userBadges: {
        where: {
          userId: user.id,
        },
        select: {
          currentProgress: true,
          highestTier: true,
          isFeatured: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });

  return badges.map((badge) => ({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon: badge.icon,
    color: badge.color,
    condition: badge.condition,
    milestones: badge.milestones,
    userProgress: badge.userBadges[0] || undefined,
  }));
}

// Get user achievements (badges with completed tiers)
export async function getUserAchievements(): Promise<Achievement[]> {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const userBadges = await prisma.userBadgeProgress.findMany({
    include: {
      badge: {
        include: {
          milestones: true,
        },
      },
    },
    orderBy: {
      badge: {
        title: "asc",
      },
    },
  });

  return userBadges.map((userBadge) => {
    // Find the milestone matching the highest tier
    const milestone = userBadge.badge.milestones.find(
      (m) => m.tier === userBadge.highestTier
    );

    return {
      id: `${userBadge.badgeId}-${userBadge.highestTier}`,
      badgeId: userBadge.badgeId,
      title: userBadge.badge.title,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon,
      color: userBadge.badge.color,
      tier: userBadge.highestTier,
      isFeatured: userBadge.isFeatured,
      earnedAt: new Date(), // You might want to add a earnedAt field to track this
      milestone: milestone!,
    };
  });
}

// Get featured achievements only
export async function getFeaturedAchievements(): Promise<Achievement[]> {
  const achievements = await getUserAchievements();
  return achievements.filter((achievement) => achievement.isFeatured);
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const [totalBadges, userBadgeProgress, verificationStatus] =
    await Promise.all([
      prisma.badge.count(),
      prisma.userBadgeProgress.findMany({
        where: { userId: user.id },
        select: {
          highestTier: true,
          isFeatured: true,
        },
      }),
      getVerificationStatus(user.id),
    ]);

  const earnedBadges = userBadgeProgress.filter(
    (progress) => progress.highestTier !== "NONE"
  ).length;

  const featuredAchievements = userBadgeProgress.filter(
    (progress) => progress.isFeatured && progress.highestTier !== "NONE"
  ).length;

  const verificationProgress = Math.round(
    (verificationStatus.profileCompletion.percentage +
      (verificationStatus.kycVerification.isVerified ? 100 : 0) +
      verificationStatus.orderRequirement.percentage) /
      3
  );

  return {
    totalBadges,
    earnedBadges,
    totalAchievements: earnedBadges,
    featuredAchievements,
    verificationProgress,
  };
}

// Update badge progress (for when users complete tasks)
export async function updateBadgeProgress(
  badgeId: string,
  newProgress: number
): Promise<void> {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  // Get badge with milestones to determine tier
  const badge = await prisma.badge.findUnique({
    where: { id: badgeId },
    include: {
      milestones: {
        orderBy: {
          threshold: "desc",
        },
      },
    },
  });

  if (!badge) {
    throw new Error("Badge not found");
  }

  // Determine the highest tier achieved based on progress
  let highestTier: Tier = "NONE";
  for (const milestone of badge.milestones) {
    if (newProgress >= milestone.threshold) {
      highestTier = milestone.tier;
      break;
    }
  }

  // Update or create user badge progress
  await prisma.userBadgeProgress.upsert({
    where: {
      userId_badgeId: {
        userId: user.id,
        badgeId: badgeId,
      },
    },
    update: {
      currentProgress: newProgress,
      highestTier: highestTier,
    },
    create: {
      userId: user.id,
      badgeId: badgeId,
      currentProgress: newProgress,
      highestTier: highestTier,
      isFeatured: false,
    },
  });
}

// Toggle featured status for an achievement
export async function toggleAchievementFeatured(
  badgeId: string,
  isFeatured: boolean
): Promise<void> {
  const user = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.userBadgeProgress.update({
    where: {
      userId_badgeId: {
        userId: user.id,
        badgeId: badgeId,
      },
    },
    data: {
      isFeatured: isFeatured,
    },
  });
}
