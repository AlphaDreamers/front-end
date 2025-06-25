"use server";

import { prisma } from "@/lib/prisma";
import {
  BadgeWithProgress,
  Achievement,
  LucideIconName,
  Color,
  KeyValuePair,
} from "@/lib/types";
import { auth } from "../auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface VerificationStatus {
  orderCompletion: number;
  profileCompletion: number;
  isKycVerified: boolean;
}

export const getVerificationStatus = async (
  userId: string
): Promise<ActionResult<VerificationStatus>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to view verification status.",
      };
    }

    // Check order completion progress
    const orderCompletionPromise = prisma.order
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
      .then((orders) => {
        const positiveReviews = orders.filter(
          (order) => (order.review?.rating || 0) > 2.5
        ).length;
        return Math.min(positiveReviews * 20, 100);
      });

    // Check profile completion progress
    const profileCompletionPromise = prisma.user
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

        const fieldChecks = [
          { field: "firstName", value: user.firstName },
          { field: "lastName", value: user.lastName },
          { field: "username", value: user.username },
          { field: "avatar", value: user.avatar },
          { field: "banner", value: user.banner },
          { field: "headline", value: user.headline },
          { field: "bio", value: user.bio },
          { field: "skills", value: user.skills && user.skills.length > 0 },
          {
            field: "socialLinks",
            value: user.socialLinks && user.socialLinks.length > 0,
          },
          {
            field: "portfolioItems",
            value: user.portfolioItems && user.portfolioItems.length > 0,
          },
        ];

        const filledFields = fieldChecks.filter((check) =>
          Boolean(check.value)
        );
        return Math.round((filledFields.length / fieldChecks.length) * 100);
      });

    const [orderCompletion, profileCompletion] = await Promise.all([
      orderCompletionPromise,
      profileCompletionPromise,
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isKycVerified: true },
    });

    return {
      success: true,
      data: {
        orderCompletion,
        profileCompletion,
        isKycVerified: user?.isKycVerified || false,
      },
    };
  } catch (error) {
    console.error("Get verification status error:", error);
    return {
      success: false,
      error: "Failed to load verification status. Please try again.",
    };
  }
};

export const getUserBadgesWithProgress = async (): Promise<
  ActionResult<BadgeWithProgress[]>
> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to view badges.",
      };
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
            userId: session.user.id,
          },
          select: {
            highestTier: true,
            currentProgress: true,
          },
        },
      },
    });

    const badgesWithProgress = badges.map((badge) => {
      const currentProgress = badge.userBadges.length > 0 ? badge.userBadges[0].currentProgress : 0;
      const currentTier = badge.userBadges.length > 0 ? badge.userBadges[0].highestTier : "NONE";
      
      // Find the next tier milestone to work towards
      const sortedMilestones = badge.milestones.sort((a, b) => a.threshold - b.threshold);
      const nextMilestone = sortedMilestones.find(m => currentProgress < m.threshold);
      const progressCap = nextMilestone?.threshold || (sortedMilestones[sortedMilestones.length - 1]?.threshold || 100);
      
      return {
        id: badge.id,
        title: badge.title,
        description: badge.description,
        icon: badge.icon as LucideIconName,
        color: badge.color as Color,
        progress: currentProgress,
        tier: currentTier,
        progressCap,
      };
    });

    return {
      success: true,
      data: badgesWithProgress,
    };
  } catch (error) {
    console.error("Get badges error:", error);
    return {
      success: false,
      error: "Failed to load badges. Please try again.",
    };
  }
};

export const getUserAchievements = async (): Promise<
  ActionResult<Achievement[]>
> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to view achievements.",
      };
    }

    const userBadges = await prisma.userBadgeProgress.findMany({
      where: {
        userId: session.user.id,
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

    const achievements = userBadges.map((userBadge) => ({
      id: userBadge.badge.id,
      title: userBadge.badge.title,
      description: userBadge.badge.description,
      icon: userBadge.badge.icon as LucideIconName,
      color: userBadge.badge.color as Color,
      tier: userBadge.highestTier,
      isFeatured: userBadge.isFeatured,
      earnedAt: new Date(), // This should ideally come from the database
    }));

    return {
      success: true,
      data: achievements,
    };
  } catch (error) {
    console.error("Get achievements error:", error);
    return {
      success: false,
      error: "Failed to load achievements. Please try again.",
    };
  }
};

export const setFeaturedBadge = async (
  badgeId: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to set a featured badge.",
      };
    }

    // Check if user has this badge
    const userBadge = await prisma.userBadgeProgress.findUnique({
      where: {
        userId_badgeId: {
          userId: session.user.id,
          badgeId: badgeId,
        },
      },
    });

    if (!userBadge) {
      return {
        success: false,
        error: "You haven't earned this badge yet.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Unset any existing featured badge
      await tx.userBadgeProgress.updateMany({
        where: {
          userId: session.user.id,
          isFeatured: true,
        },
        data: {
          isFeatured: false,
        },
      });

      // Set the new featured badge
      await tx.userBadgeProgress.update({
        where: {
          userId_badgeId: {
            userId: session.user.id,
            badgeId: badgeId,
          },
        },
        data: {
          isFeatured: true,
        },
      });
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Set featured badge error:", error);
    return {
      success: false,
      error: "Failed to set featured badge. Please try again.",
    };
  }
};

export const getKeyValueBadges = async (): Promise<
  ActionResult<KeyValuePair[]>
> => {
  try {
    const badges = await prisma.userBadgeProgress.findMany({
      select: {
        badge: {
          select: {
            id: true,
            title: true,
          },
        },
        highestTier: true,
      },
    });

    const keyValueBadges = badges.map((badge) => ({
      value: badge.badge.id,
      label: `${badge.badge.title} (${badge.highestTier})`,
    }));

    return {
      success: true,
      data: keyValueBadges,
    };
  } catch (error) {
    console.error("Get key value badges error:", error);
    return {
      success: false,
      error: "Failed to load badge options. Please try again.",
    };
  }
};

export const confirmFullProfileVerification = async (): Promise<
  ActionResult<void>
> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to verify your profile.",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Create or ensure profile verified badge exists
      let badge = await tx.badge.findUnique({
        where: { id: "profile_verified_badge_id" },
      });

      if (!badge) {
        badge = await tx.badge.create({
          data: {
            id: "profile_verified_badge_id",
            title: "Profile Verified",
            description: "Your profile has been fully verified.",
            icon: "CheckCircle",
            color: "green",
            condition:
              "Complete your profile with all required fields and KYC verification",
          },
        });
      }

      // Update user verification status
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          isProfileVerified: true,
        },
      });
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Confirm profile verification error:", error);
    return {
      success: false,
      error: "Failed to verify profile. Please try again.",
    };
  }
};

// badge-helpers.ts
// Create this file in your lib/actions folder to share badge functions

import { Prisma, Tier } from "@prisma/client";

// Helper function to update badge progress
export async function updateBadgeProgress(
  userId: string,
  badgeId: string,
  currentProgress: number,
  tx: Prisma.TransactionClient
) {
  const badge = await tx.badge.findUnique({
    where: { id: badgeId },
    include: {
      milestones: {
        orderBy: { threshold: "desc" },
      },
    },
  });

  if (!badge) return;

  // Determine the appropriate tier
  let newTier: Tier = "NONE";
  for (const milestone of badge.milestones) {
    if (currentProgress >= milestone.threshold) {
      newTier = milestone.tier;
      break;
    }
  }

  // Update or create badge progress
  await tx.userBadgeProgress.upsert({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
    update: {
      currentProgress,
      highestTier: newTier,
    },
    create: {
      userId,
      badgeId,
      currentProgress,
      highestTier: newTier,
    },
  });
}

// Check Top Rated Seller badge
export async function checkTopRatedSellerBadge(
  sellerId: string,
  tx: Prisma.TransactionClient
) {
  // Get all completed orders with positive reviews
  const orders = await tx.order.findMany({
    where: {
      sellerId,
      status: "COMPLETED",
      completedAt: { not: null },
      review: {
        rating: { gte: 4 },
      },
    },
    select: {
      completedAt: true,
      deadline: true,
    },
  });

  // Count only those that were delivered on time
  const positiveOnTimeDeliveries = orders.filter(
    (order) => order.completedAt && order.completedAt <= order.deadline
  ).length;

  await updateBadgeProgress(
    sellerId,
    "top_rated_seller",
    positiveOnTimeDeliveries,
    tx
  );
}

// Check Power Buyer badge
export async function checkPowerBuyerBadge(
  buyerId: string,
  tx: Prisma.TransactionClient
) {
  const completedOrders = await tx.order.count({
    where: {
      buyerId,
      status: "COMPLETED",
    },
  });

  await updateBadgeProgress(buyerId, "power_buyer", completedOrders, tx);
}

// Check Community Star badge
export async function checkCommunityStarBadge(
  userId: string,
  tx: Prisma.TransactionClient
) {
  const reviews = await tx.review.findMany({
    where: {
      authorId: userId,
    },
    select: {
      description: true,
    },
  });

  const detailedReviewsCount = reviews.filter(
    (review) => review.description.trim().split(/\s+/).length >= 50
  ).length;

  await updateBadgeProgress(userId, "community_star", detailedReviewsCount, tx);
}
