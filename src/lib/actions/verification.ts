"use server";

import { prisma } from "@/lib/prisma";
import { me } from "./auth";
import {
  UserProfileFields,
  BadgeWithProgress,
  Achievement,
  VerificationStatus,
  DashboardStats,
} from "@/lib/types";
import { Tier } from "@prisma/client";
import { calculateProfileCompletion } from "../utils";
import { Color, LucideIconName } from "../types";

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
export async function getVerificationStatus(userId: string) {
  const {user,} = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }
  const orderCompletionP = () =>
    prisma.order
      .findMany({
        where: {
          sellerId: userId,
          status: "COMPLETED",
        },
        select: {
          review: {
            select: {
              rating: true,
            },
          },
        },
      })
      .then((orders) =>
        Math.max(
          orders.filter((order) => order.review!.rating > 2.5).length * 20,
          100
        )
      );

  const profileCompletionP = async () =>
    prisma.user
      .findUnique({
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
      })
      .then((user) => {
        if (!user) {
          throw new Error("User not found");
        }
        return calculateProfileCompletion(user);
      });

  return await Promise.all([orderCompletionP(), profileCompletionP()]).then(
    ([orderCompletion, profileCompletion]) => {
      return {
        orderCompletion,
        profileCompletion,
        isKycVerified: user.isKycVerified,
      };
    }
  );
}

// Get all badges with user progress
export async function getBadgesProgress(): Promise<BadgeWithProgress[]> {
  const {user,} = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const badges = await prisma.badge.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      icon: true,
      color: true,
      milestones: {
        select: {
          threshold: true,
          tier: true,
        },
      },
      userBadges: {
        where: {
          userId: user.id,
        },
        select: {
          highestTier: true,
          currentProgress: true,
        },
      },
    },
  });

  return badges.map((badge) => ({
    id: badge.id,
    title: badge.title,
    description: badge.description,
    icon: badge.icon as LucideIconName,
    color: badge.color as Color,
    progress:
      badge.userBadges.length > 0 ? badge.userBadges[0].currentProgress : 0,
    tier:
      badge.userBadges.length > 0 ? badge.userBadges[0].highestTier : "NONE",
    progressCap:
      badge.milestones.find((m) => m.tier === badge.userBadges[0]?.highestTier)
        ?.threshold || 100,
  }));
}

export async function getAchievements(): Promise<Achievement[]> {
  const {user,} = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  const userBadges = await prisma.userBadgeProgress.findMany({
    where: {
      userId: user.id,
    },
    select: {
      highestTier: true,
      isFeatured: true,
      badge: {
        select: {
          id: true,
          title: true,
          description: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  return userBadges.map((userBadge) => {
    return {
      id: userBadge.badge.id,
      title: userBadge.badge.title,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon as LucideIconName,
      color: userBadge.badge.color as Color,
      tier: userBadge.highestTier,
      isFeatured: userBadge.isFeatured,
      earnedAt: new Date(), // Assuming achievements are earned at the time of retrieval
    };
  });
}

export async function setFeaturedBadge(badgeId: string): Promise<void> {
  const {user,} = await me();
  if (!user?.isVerified) {
    throw new Error("User is not authenticated");
  }

  await prisma.$transaction(async (tx) => {
    const existingFeaturedBadge = await tx.userBadgeProgress.findFirst({
      where: {
        userId: user.id,
        isFeatured: true,
      },
      select: { id: true, badgeId: true },
    });

    if (existingFeaturedBadge) {
      await tx.userBadgeProgress.update({
        where: {
          id: existingFeaturedBadge.id,
        },
        data: {
          isFeatured: false,
        },
      });
    }

    await tx.userBadgeProgress.update({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId: badgeId,
        },
      },
      data: {
        isFeatured: true,
      },
    });
  });
}
