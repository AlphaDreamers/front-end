"use server";

import { prisma } from "../prisma";
import { Color, DetailedUser, LucideIconName } from "../types";
import { uploadFileToCloudinary } from "./cloudinary";
import { auth } from "../auth";
import { SocialLinkType } from "@prisma/client";

export async function getDetailedUser(
  username: string
): Promise<DetailedUser | null> {
  const session = await auth();
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
          reviews: {
            select: {
              order: {
                select: {
                  transaction: {
                    select: {
                      txId: true,
                    },
                  },
                },
              },
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
          id: true,
          packages: {
            select: {
              price: true,
            },
          },
          title: true,
          description: true,
          // Updated to use the new media relation
          media: {
            select: {
              id: true,
              url: true,
              type: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
            take: 1, // Only get the first media item for listing display
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
                      icon: true,
                      color: true,
                    },
                  },
                },
              },
            },
          },
          bookmarks: {
            where: {
              id: session?.user?.id,
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
          // Updated to use the new files relation
          files: {
            select: {
              id: true,
              url: true,
              type: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          description: true,
          title: true,
          url: true,
          order: true,
        },
        orderBy: {
          order: "asc",
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
      isProfileVerified: true,
    },
  });

  if (!user) {
    return null;
  }

  const allReviews = user.gigs.flatMap((gig) => gig.reviews);

  return {
    isVerified: user.isProfileVerified,
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
    reviews: allReviews.map((review) => ({
      id: review.id ?? "",
      rating: review.rating ?? 0,
      title: review.title ?? "",
      description: review.description ?? undefined,
      createdAt: review.createdAt ?? new Date(0),
      author: {
        id: review.author.id,
        username: review.author.username,
        firstName: review.author.firstName,
        lastName: review.author.lastName,
        avatar: review.author.avatar ?? undefined,
      },
      txId: review.order.transaction?.txId ?? undefined,
    })),
    portfolioItemsCnt: user.portfolioItems.length,
    portfolioItems: user.portfolioItems.map((item) => ({
      id: item.id,
      // Use the first image as primary image for backwards compatibility
      primaryImage: item.files[0]?.url || "/",
      media: item.files.map((file) => ({
        id: file.id,
        url: file.url,
        type: file.type,
      })),
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
      // Use the first media item that's an image, or fallback
      primaryImage:
        gig.media.find((m) => m.type === "IMAGE")?.url ||
        gig.media[0]?.url ||
        "/gig-fallback.jpg",
      media: gig.media.map((media) => ({
        id: media.id,
        url: media.url,
        type: media.type,
        order: media.order,
      })),
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
                icon: gig.seller.badgeProgress[0].badge.icon as LucideIconName,
                color: gig.seller.badgeProgress[0].badge.color as Color,
                title: gig.seller.badgeProgress[0].badge.title,
                tier: gig.seller.badgeProgress[0].highestTier,
              }
            : undefined,
        avatar: gig.seller.avatar || undefined,
      },
    })),
  };
}

import { UpdateProfileFormData } from "@/lib/schemas";
import { MediaItem } from "@/lib/types/forms";
import { MediaType } from "@prisma/client";

export async function updateProfile(values: UpdateProfileFormData) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // Process avatar upload if new
    let avatarUrl: string | null = null;
    if (values.avatar) {
      if (values.avatar.type === "existing") {
        avatarUrl = values.avatar.url;
      } else {
        avatarUrl = await uploadFileToCloudinary(
          values.avatar.file,
          "user_avatars"
        );
      }
    }

    // Process banner upload if new
    let bannerUrl: string | null = null;
    if (values.banner) {
      if (values.banner.type === "existing") {
        bannerUrl = values.banner.url;
      } else {
        bannerUrl = await uploadFileToCloudinary(
          values.banner.file,
          "user_banners"
        );
      }
    }

    // Process portfolio items and upload media
    const processedPortfolioItems = await Promise.all(
      values.portfolioItems.map(async (item, index) => {
        // Filter new media
        const newMediaItems = item.media.filter(
          (media): media is Extract<MediaItem, { type: "new" }> =>
            media.type === "new"
        );

        // Upload new media files
        const uploadedMedia: Array<{
          url: string;
          mediaType: MediaType;
          order: number;
        }> = [];

        for (const mediaItem of newMediaItems) {
          const url = await uploadFileToCloudinary(
            mediaItem.file,
            "chat_media"
          );
          uploadedMedia.push({
            url,
            mediaType: mediaItem.mediaType,
            order: mediaItem.order || 0,
          });
        }

        return {
          ...item,
          order: index, // Set order based on array position
          uploadedMedia,
          existingMedia: item.media.filter(
            (media): media is Extract<MediaItem, { type: "existing" }> =>
              media.type === "existing"
          ),
        };
      })
    );

    // Perform database updates in a transaction
    await prisma.$transaction(async (tx) => {
      // Update basic user info
      await tx.user.update({
        where: { id: session.user.id },
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
      const existingSkills = await tx.userSkill.findMany({
        where: { userId: session.user.id },
      });

      const existingSkillIds = existingSkills.map((s) => s.id);
      const incomingSkillIds = values.skills
        .filter((s) => s.id)
        .map((s) => s.id!);

      // Delete removed skills
      const skillsToDelete = existingSkillIds.filter(
        (id) => !incomingSkillIds.includes(id)
      );

      if (skillsToDelete.length > 0) {
        await tx.userSkill.deleteMany({
          where: { id: { in: skillsToDelete } },
        });
      }

      // Update existing and create new skills
      for (const skill of values.skills) {
        if (skill.id) {
          console.log("Updating existing skill:", skill.id);
          // Update existing skill
          await tx.userSkill.update({
            where: { id: skill.id },
            data: { level: skill.level },
          });
        } else {
          // Create new skill
          await tx.userSkill.create({
            data: {
              userId: session.user.id,
              skillId: skill.skillId,
              level: skill.level,
            },
          });
        }
      }

      // Handle social links
      const existingLinks = await tx.socialLink.findMany({
        where: { userId: session.user.id },
      });

      const existingLinkIds = existingLinks.map((l) => l.id);
      const incomingLinkIds = values.socialLinks
        .filter((l) => l.id)
        .map((l) => l.id!);

      // Delete removed links
      const linksToDelete = existingLinkIds.filter(
        (id) => !incomingLinkIds.includes(id)
      );

      if (linksToDelete.length > 0) {
        await tx.socialLink.deleteMany({
          where: { id: { in: linksToDelete } },
        });
      }

      // Update existing and create new links
      for (const link of values.socialLinks) {
        if (link.id) {
          // Update existing link
          await tx.socialLink.update({
            where: { id: link.id },
            data: {
              type: link.type as SocialLinkType,
              url: link.url,
            },
          });
        } else {
          // Create new link
          await tx.socialLink.create({
            data: {
              userId: session.user.id,
              type: link.type as SocialLinkType,
              url: link.url,
            },
          });
        }
      }

      // Handle portfolio items
      const existingPortfolioItems = await tx.portfolioItem.findMany({
        where: { userId: session.user.id },
        include: {
          files: true,
        },
      });

      const existingPortfolioIds = existingPortfolioItems.map((p) => p.id);
      const incomingPortfolioIds = processedPortfolioItems
        .filter((p) => p.id)
        .map((p) => p.id!);

      // Delete removed portfolio items
      const portfolioItemsToDelete = existingPortfolioIds.filter(
        (id) => !incomingPortfolioIds.includes(id)
      );

      if (portfolioItemsToDelete.length > 0) {
        // First, disconnect media files from portfolio items to be deleted
        for (const portfolioId of portfolioItemsToDelete) {
          await tx.portfolioItem.update({
            where: { id: portfolioId },
            data: {
              files: {
                set: [], // Disconnect all files
              },
            },
          });
        }

        // Delete portfolio items
        await tx.portfolioItem.deleteMany({
          where: { id: { in: portfolioItemsToDelete } },
        });

        // Clean up orphaned media files
        const orphanedFiles = await tx.mediaFile.findMany({
          where: {
            AND: [{ portfolioItems: { none: {} } }, { gigs: { none: {} } }],
          },
        });

        if (orphanedFiles.length > 0) {
          await tx.mediaFile.deleteMany({
            where: {
              id: { in: orphanedFiles.map((f) => f.id) },
            },
          });
        }
      }

      // Update existing and create new portfolio items
      for (const item of processedPortfolioItems) {
        let portfolioItemId: string;

        if (item.id) {
          // Update existing portfolio item
          await tx.portfolioItem.update({
            where: { id: item.id },
            data: {
              title: item.title,
              description: item.description || null,
              url: item.url || null,
              isFeatured: item.isFeatured || false,
              order: item.order,
            },
          });
          portfolioItemId = item.id;

          // Handle media files for existing item
          const existingItem = existingPortfolioItems.find(
            (p) => p.id === item.id
          );
          const existingFileIds = existingItem?.files.map((f) => f.id) || [];
          const keepFileIds = item.existingMedia.map((media) => media.id);

          // Disconnect removed files
          const filesToDisconnect = existingFileIds.filter(
            (id) => !keepFileIds.includes(id)
          );

          if (filesToDisconnect.length > 0) {
            await tx.portfolioItem.update({
              where: { id: portfolioItemId },
              data: {
                files: {
                  disconnect: filesToDisconnect.map((id) => ({ id })),
                },
              },
            });

            // Delete orphaned files
            const orphanedFiles = await tx.mediaFile.findMany({
              where: {
                id: { in: filesToDisconnect },
                AND: [{ portfolioItems: { none: {} } }, { gigs: { none: {} } }],
              },
            });

            if (orphanedFiles.length > 0) {
              await tx.mediaFile.deleteMany({
                where: {
                  id: { in: orphanedFiles.map((f) => f.id) },
                },
              });
            }
          }
        } else {
          // Create new portfolio item
          const newItem = await tx.portfolioItem.create({
            data: {
              userId: session.user.id,
              title: item.title,
              description: item.description || null,
              url: item.url || null,
              isFeatured: item.isFeatured || false,
              order: item.order,
            },
          });
          portfolioItemId = newItem.id;
        }

        // Create new media files and connect them
        const newMediaIds: string[] = [];
        for (const uploadedItem of item.uploadedMedia) {
          const mediaFile = await tx.mediaFile.create({
            data: {
              url: uploadedItem.url,
              type: uploadedItem.mediaType,
              order: uploadedItem.order,
            },
          });
          newMediaIds.push(mediaFile.id);
        }

        // Update existing media order
        for (const existingMedia of item.existingMedia) {
          await tx.mediaFile.update({
            where: { id: existingMedia.id },
            data: { order: existingMedia.order || 0 },
          });
        }

        // Connect new media files to the portfolio item
        if (newMediaIds.length > 0) {
          await tx.portfolioItem.update({
            where: { id: portfolioItemId },
            data: {
              files: {
                connect: newMediaIds.map((id) => ({ id })),
              },
            },
          });
        }
      }
    });

    return {
      success: true,
      user: {
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        headline: values.headline,
        bio: values.bio,
        avatar: avatarUrl,
        banner: bannerUrl,
      },
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
