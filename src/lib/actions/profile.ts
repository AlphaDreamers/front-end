"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { Color, DetailedUser, KeyValuePair, LucideIconName } from "../types";
import { me } from "./auth";
import { UpdateProfileFormSchema } from "../schemas";
import { uploadFileToCloudinary } from "./cloudinary";
import { z } from "zod";

export async function getDetailedUser(
  username: string
): Promise<DetailedUser | null> {
  const { user: currentUser } = await me();
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      email: true,
      ordersAsSeller: {
        where: {
          status: "COMPLETED",
        },
      },
      badgeProgress: {
        where: {
          isFeatured: true,
        },
        select: {
          id: true,
          highestTier: true,
          badge: {
            select: {
              color: true,
              title: true,
              icon: true,
            },
          },
        },
      },
      banner: true,
      avatar: true,
      firstName: true,
      lastName: true,
      username: true,
      gigs: {
        select: {
          id: true,
          packages: {
            select: {
              price: true,
            },
          },
          title: true,
          description: true,
          images: {
            select: {
              isPrimary: true,
              file: {
                select: {
                  url: true,
                },
              },
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              orderId: true,
              author: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  avatar: true,
                },
              },
              title: true,
              description: true,
              createdAt: true,
              sellerResponse: true,
            },
          },
          tags: {
            select: {
              title: true,
              id: true,
            },
          },
          seller: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
              badgeProgress: {
                where: {
                  isFeatured: true,
                },
                select: {
                  highestTier: true,
                  badge: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
          bookmarks: {
            where: {
              id: currentUser?.id,
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
        },
      },
      portfolioItems: {
        select: {
          id: true,
          images: {
            select: {
              isPrimary: true,
              file: {
                select: {
                  url: true,
                },
              },
            },
          },
          description: true,
          title: true,
          url: true,
        },
      },
      socialLinks: {
        select: {
          id: true,
          url: true,
          type: true,
        },
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
      },
      bio: true,
      isKycVerified: true,
      id: true,
      createdAt: true,
      headline: true,
    },
  });

  if (!user) {
    return null;
  }

  const allReviews = user.gigs.flatMap((gig) => gig.reviews);

  return {
    email: user.email,
    ordersCnt: user.ordersAsSeller.length,
    headline: user.headline ?? undefined,
    joinedAt: user.createdAt,
    badge:
      user.badgeProgress.length > 0
        ? {
            id: user.badgeProgress[0].id,
            tier: user.badgeProgress[0].highestTier,
            color: user.badgeProgress[0].badge.color as Color,
            icon: user.badgeProgress[0].badge.icon as LucideIconName,
            title: user.badgeProgress[0].badge.title,
          }
        : undefined,
    banner: user.banner ?? undefined,
    avatar: user.avatar ?? undefined,
    id: user.id,
    socialLinks: user.socialLinks.map((socialLink) => ({
      id: socialLink.id,
      url: socialLink.url,
      type: socialLink.type,
    })),
    skills: user.skills.map((skill) => ({
      id: skill.id,
      title: skill.skill.title,
      level: skill.level,
    })),
    isKycVerified: user.isKycVerified,
    firstName: user.firstName,
    username: user.username,
    lastName: user.lastName,
    gigCnt: user.gigs.length,
    ratingCnt: allReviews.length,
    avgRating:
      allReviews.reduce((sum, review) => sum + review.rating, 0) /
      (allReviews.length || 1),
    reviews: allReviews,
    portfolioItemsCnt: user.portfolioItems.length,
    portfolioItems: user.portfolioItems.map((item) => ({
      id: item.id,
      primaryImage: item.images.find((img) => img.isPrimary)?.file.url || "/",
      images: item.images.map((img) => img.file.url),
      title: item.title,
      description: item.description ?? undefined,
      url: item.url ?? undefined,
    })),
    gigs: user.gigs.map((gig) => ({
      isBookmarked: gig.bookmarks.length > 0,
      id: gig.id,
      category: {
        id: gig.category.id,
        label: gig.category.title,
        icon: gig.category.icon as LucideIconName,
        color: gig.category.color as Color,
      },
      image:
        gig.images.find((img) => img.isPrimary)?.file.url ||
        "/gig-fallback.png",
      startsAtPrice: gig.packages.reduce(
        (min, pkg) => Math.min(min, pkg.price),
        Infinity
      ),
      title: gig.title,
      description: gig.description,
      ratingCount: gig.reviews.length,
      averageRating:
        gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
        (gig.reviews.length || 1),
      tags: gig.tags.map((tag) => ({
        id: tag.id,
        label: tag.title,
      })),
      seller: {
        id: gig.seller.id,
        username: gig.seller.username,
        firstName: gig.seller.firstName,
        lastName: gig.seller.lastName,
        badge:
          gig.seller.badgeProgress.length > 0
            ? {
                title: gig.seller.badgeProgress[0].badge.title,
                tier: gig.seller.badgeProgress[0].highestTier,
              }
            : null,
        avatar: gig.seller.avatar,
      },
    })),
  };
}

export type ProfileForEdit = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    firstName: true;
    lastName: true;
    headline: true;
    bio: true;
    avatar: true;
    banner: true;
    skills: {
      select: {
        id: true;
        level: true;
        skill: {
          select: {
            id: true;
            title: true;
          };
        };
      };
    };
    socialLinks: {
      select: {
        id: true;
        type: true;
        url: true;
      };
    };
    portfolioItems: {
      select: {
        id: true;
        title: true;
        description: true;
        url: true;
        images: {
          select: {
            id: true;
            isPrimary: true;
            file: {
              select: {
                id: true;
                url: true;
              };
            };
          };
        };
      };
    };
    badgeProgress: {
      select: {
        id: true;
        isFeatured: true;
        highestTier: true;
        badge: {
          select: {
            id: true;
            title: true;
            description: true;
          };
        };
      };
    };
  };
}>;

export async function getProfileForEdit(
  userId: string
): Promise<ProfileForEdit | null> {
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      headline: true,
      bio: true,
      avatar: true,
      banner: true,
      skills: {
        select: {
          id: true,
          level: true,
          skill: {
            select: {
              id: true,
              title: true,
            },
          },
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
              isPrimary: true,
              file: {
                select: {
                  id: true,
                  url: true,
                },
              },
            },
            orderBy: {
              isPrimary: "desc",
            },
          },
        },
      },
      badgeProgress: {
        select: {
          id: true,
          isFeatured: true,
          highestTier: true,
          badge: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  return profile;
}

export async function updateProfile(
  values: z.infer<typeof UpdateProfileFormSchema>
) {
  try {
    const { user } = await me();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Process avatar upload if new
    let avatarUrl =
      values.avatar?.type === "existing" ? values.avatar.url : null;
    if (values.avatar?.type === "new") {
      avatarUrl = await uploadFileToCloudinary(
        values.avatar.file,
        "user_avatars"
      );
    }

    // Process banner upload if new
    let bannerUrl =
      values.banner?.type === "existing" ? values.banner.url : null;
    if (values.banner?.type === "new") {
      bannerUrl = await uploadFileToCloudinary(
        values.banner.file,
        "user_banners"
      );
    }

    // Process portfolio images
    const portfolioItemsWithUploadedImages = await Promise.all(
      values.portfolioItems.map(async (item) => {
        const uploadedImages = await Promise.all(
          item.images.map(async (img) => {
            if (img.type === "new") {
              const url = await uploadFileToCloudinary(img.file, "gig_images");
              return {
                url,
                isPrimary: img.isPrimary,
                isNew: true,
              };
            }
            return {
              id: img.id,
              url: img.url,
              isPrimary: img.isPrimary,
              isNew: false,
            };
          })
        );

        return {
          ...item,
          uploadedImages,
        };
      })
    );

    // Perform database updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Update basic user info
      await tx.user.update({
        where: { id: user.id },
        data: {
          username: values.username,
          firstName: values.firstName,
          lastName: values.lastName,
          headline: values.headline || null,
          bio: values.bio || null,
          avatar: avatarUrl,
          banner: bannerUrl,
        },
      });

      // Handle skills
      // First, get existing skills
      const existingSkills = await tx.userSkill.findMany({
        where: { userId: user.id },
      });

      // Delete removed skills
      const skillsToDelete = existingSkills.filter(
        (es) => !values.skills.some((s) => s.id === es.id)
      );

      if (skillsToDelete.length > 0) {
        await tx.userSkill.deleteMany({
          where: {
            id: { in: skillsToDelete.map((s) => s.id) },
          },
        });
      }

      // Update existing and create new skills
      for (const skill of values.skills) {
        if (skill.id) {
          // Update existing skill
          await tx.userSkill.update({
            where: { id: skill.id },
            data: { level: skill.level },
          });
        } else {
          // Create new skill
          await tx.userSkill.create({
            data: {
              userId: user.id,
              skillId: skill.skillId,
              level: skill.level,
            },
          });
        }
      }

      // Handle social links
      const existingLinks = await tx.socialLink.findMany({
        where: { userId: user.id },
      });

      // Delete removed links
      const linksToDelete = existingLinks.filter(
        (el) => !values.socialLinks.some((l) => l.id === el.id)
      );

      if (linksToDelete.length > 0) {
        await tx.socialLink.deleteMany({
          where: {
            id: { in: linksToDelete.map((l) => l.id) },
          },
        });
      }

      // Update existing and create new links
      for (const link of values.socialLinks) {
        if (link.id) {
          // Update existing link
          await tx.socialLink.update({
            where: { id: link.id },
            data: {
              type: link.type,
              url: link.url,
            },
          });
        } else {
          // Create new link
          await tx.socialLink.create({
            data: {
              userId: user.id,
              type: link.type,
              url: link.url,
            },
          });
        }
      }

      // Handle portfolio items
      const existingPortfolioItems = await tx.portfolioItem.findMany({
        where: { userId: user.id },
        include: { images: true },
      });

      // Delete removed portfolio items
      const portfolioItemsToDelete = existingPortfolioItems.filter(
        (ep) => !portfolioItemsWithUploadedImages.some((p) => p.id === ep.id)
      );

      if (portfolioItemsToDelete.length > 0) {
        // Delete associated images first
        await tx.image.deleteMany({
          where: {
            portfolioItemId: { in: portfolioItemsToDelete.map((p) => p.id) },
          },
        });

        // Then delete portfolio items
        await tx.portfolioItem.deleteMany({
          where: {
            id: { in: portfolioItemsToDelete.map((p) => p.id) },
          },
        });
      }

      // Update existing and create new portfolio items
      for (const item of portfolioItemsWithUploadedImages) {
        let portfolioItemId: string;

        if (item.id) {
          // Update existing portfolio item
          await tx.portfolioItem.update({
            where: { id: item.id },
            data: {
              title: item.title,
              description: item.description || null,
              url: item.url || null,
            },
          });
          portfolioItemId = item.id;

          // Handle images for existing item
          const existingImages =
            existingPortfolioItems.find((p) => p.id === item.id)?.images || [];

          // Delete removed images
          const imagesToDelete = existingImages.filter(
            (ei) =>
              !item.uploadedImages.some((ui) => !ui.isNew && ui.id === ei.id)
          );

          if (imagesToDelete.length > 0) {
            await tx.image.deleteMany({
              where: {
                id: { in: imagesToDelete.map((i) => i.id) },
              },
            });
          }

          // Update existing images
          for (const img of item.uploadedImages.filter((i) => !i.isNew)) {
            await tx.image.update({
              where: { id: img.id },
              data: { isPrimary: img.isPrimary },
            });
          }
        } else {
          // Create new portfolio item
          const newItem = await tx.portfolioItem.create({
            data: {
              userId: user.id,
              title: item.title,
              description: item.description || null,
              url: item.url || null,
            },
          });
          portfolioItemId = newItem.id;
        }

        // Create new images
        for (const img of item.uploadedImages.filter((i) => i.isNew)) {
          const mediaFile = await tx.mediaFile.create({
            data: {
              url: img.url,
              type: "IMAGE",
            },
          });

          await tx.image.create({
            data: {
              fileId: mediaFile.id,
              portfolioItemId,
              isPrimary: img.isPrimary,
            },
          });
        }
      }

      // Update featured badge
      if (values.featuredBadgeId !== undefined) {
        // First unset all featured badges
        await tx.userBadgeProgress.updateMany({
          where: {
            userId: user.id,
            isFeatured: true,
          },
          data: { isFeatured: false },
        });

        // Then set the new featured badge if one is selected
        if (values.featuredBadgeId) {
          await tx.userBadgeProgress.update({
            where: {
              id: values.featuredBadgeId,
              userId: user.id,
            },
            data: { isFeatured: true },
          });
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function getKeyValueSkills(): Promise<KeyValuePair[]> {
  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return skills.map((skill) => ({
    label: skill.title,
    value: skill.id,
  }));
}

export const confirmFullVerification = async () => {
  const { user: currentUser } = await me();
  if (!currentUser) {
    return { success: false, error: "User not authenticated" };
  }
  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      isProfileVerified: true,
    },
  });
};
