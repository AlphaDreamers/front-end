// src/lib/actions/profile.ts
"use server";

import { prisma } from "@/lib/prisma";
import {
  ProfileUser,
  ProfilePortfolioItem,
  ProfileReview,
  Gig,
} from "@/lib/types";

export async function getProfileData(username: string) {
  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      banner: true,
      headline: true,
      bio: true,
      isKycVerified: true,
      createdAt: true,
      badgeProgress: {
        where: { isFeatured: true },
        select: {
          badge: {
            select: {
              title: true,
            },
          },
          highestTier: true,
        },
        take: 1,
      },
      skills: {
        select: {
          id: true,
          level: true,
          skill: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          level: "desc",
        },
      },
      socialLinks: {
        select: {
          id: true,
          type: true,
          url: true,
        },
      },
      portfolioItems: {
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          images: {
            select: {
              id: true,
              file: {
                select: {
                  url: true,
                },
              },
              isPrimary: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      gigs: {
        select: {
          id: true,
          title: true,
          description: true,
          images: {
            select: {
              file: {
                select: {
                  url: true,
                },
              },
              isPrimary: true,
            },
          },
          packages: {
            select: {
              price: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          tags: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
              icon: true,
              color: true,
            },
          },
          seller: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              publicKey: true,
              badgeProgress: {
                where: { isFeatured: true },
                select: {
                  badge: {
                    select: {
                      title: true,
                    },
                  },
                },
                take: 1,
              },
            },
          },
        },
      },
      _count: {
        select: {
          ordersAsSeller: {
            where: {
              status: "COMPLETED",
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  // Get review statistics
  const reviews = await prisma.review.findMany({
    where: {
      gig: {
        sellerId: user.id,
      },
    },
    select: {
      rating: true,
    },
  });

  const reviewStats = {
    total: reviews.length,
    average:
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0,
    distribution: reviews.reduce(
      (acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>
    ),
  };

  // Convert to UI types
  const profileUser: ProfileUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    banner: user.banner,
    headline: user.headline,
    bio: user.bio,
    isKycVerified: user.isKycVerified,
    joinedAt: user.createdAt,
    featuredBadge:
      user.badgeProgress.length > 0
        ? {
            title: user.badgeProgress[0].badge.title,
            tier: user.badgeProgress[0].highestTier,
          }
        : null,
    skills: user.skills.map((skill) => ({
      id: skill.id,
      title: skill.skill.title,
      level: skill.level,
    })),
    socialLinks: user.socialLinks.map((link) => ({
      id: link.id,
      type: link.type,
      url: link.url,
    })),
    stats: {
      totalGigs: user.gigs.length,
      averageRating: reviewStats.average,
      totalReviews: reviewStats.total,
      completedOrders: user._count.ordersAsSeller,
    },
  };

  const portfolioItems: ProfilePortfolioItem[] = user.portfolioItems.map(
    (item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      images: item.images.map((img) => ({
        id: img.id,
        url: img.file.url,
        isPrimary: img.isPrimary,
      })),
    })
  );

  const gigs: Gig[] = user.gigs.map((gig) => ({
    id: gig.id,
    title: gig.title,
    description: gig.description,
    image:
      gig.images.find((img) => img.isPrimary)?.file.url || "/gig-fallback.png",
    startsAtPrice: Math.min(...gig.packages.map((pkg) => pkg.price)),
    averageRating:
      gig.reviews.length > 0
        ? gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
          gig.reviews.length
        : 0,
    ratingCount: gig.reviews.length,
    tags: gig.tags.map((tag) => ({
      id: tag.id,
      label: tag.title,
    })),
    seller: {
      id: gig.seller.id,
      username: gig.seller.username,
      firstName: gig.seller.firstName,
      lastName: gig.seller.lastName,
      avatar: gig.seller.avatar,
      publicKey: gig.seller.publicKey,
      badge:
        gig.seller.badgeProgress.length > 0
          ? { title: gig.seller.badgeProgress[0].badge.title }
          : null,
    },
  }));

  return {
    user: profileUser,
    portfolioItems,
    gigs,
    reviewStats,
  };
}

export async function getProfileReviews(
  userId: string,
  skip: number = 0,
  take: number = 6
): Promise<ProfileReview[]> {
  const reviews = await prisma.review.findMany({
    where: {
      gig: {
        sellerId: userId,
      },
    },
    select: {
      id: true,
      rating: true,
      title: true,
      description: true,
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      createdAt: true,
      sellerResponse: true,
      sellerRespondedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });

  // Convert to UI type
  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    title: review.title,
    description: review.description,
    author: review.author,
    createdAt: review.createdAt,
    sellerResponse: review.sellerResponse,
    sellerRespondedAt: review.sellerRespondedAt,
  }));
}
