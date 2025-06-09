"use server";

import { prisma } from "@/lib/prisma";
import { ProfileReview, DetailedUser } from "@/lib/types";
import { UpdateProfileFormSchema } from "../schemas";
import { z } from "zod";
import { me } from "./auth";
import { MediaType } from "@prisma/client";

export async function getDetailedUser(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  username: string
): Promise<DetailedUser | null> {
  return null;
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

export const updateProfile = async (
  values: z.infer<typeof UpdateProfileFormSchema>
) => {
  const {
    username,
    avatar,
    banner,
    headline,
    bio,
    firstName,
    lastName,
    skills,
    socialLinks,
    portfolioItems,
    featuredBadge,
  } = values;
  const user = await me();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const prev = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      skills: {
        select: {
          id: true,
        },
      },
      socialLinks: {
        select: {
          id: true,
        },
      },
      portfolioItems: {
        select: {
          id: true,
          images: {
            select: {
              id: true,
            },
          },
        },
      },
      badgeProgress: {
        select: {
          id: true,
          isFeatured: true,
        },
      },
    },
  });

  if (!prev) {
    throw new Error("User not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      username,
      avatar,
      banner,
      headline,
      bio,
      firstName,
      lastName,
    },
  });

  if (skills) {
    for (const skill of skills) {
      if (skill.id) {
        await prisma.userSkill.update({
          where: { id: skill.id },
          data: {
            level: skill.level,
          },
        });
      } else {
        await prisma.userSkill.create({
          data: {
            level: skill.level,
            userId: user.id,
            skillId: skill.skillId,
          },
        });
      }
    }
  }

  for (const skill of prev.skills.filter(
    (s) => !skills.some((newSkill) => newSkill.id === s.id)
  )) {
    await prisma.userSkill.delete({
      where: { id: skill.id },
    });
  }

  for (const socialLink of socialLinks) {
    if (socialLink.id) {
      await prisma.socialLink.update({
        where: { id: socialLink.id },
        data: {
          url: socialLink.url,
        },
      });
    } else {
      await prisma.socialLink.create({
        data: {
          type: socialLink.type,
          url: socialLink.url,
          userId: user.id,
        },
      });
    }
  }

  for (const socialLink of prev.socialLinks.filter(
    (link) => !socialLinks.some((newLink) => newLink.id === link.id)
  )) {
    await prisma.socialLink.delete({
      where: { id: socialLink.id },
    });
  }

  for (const portfolioItem of portfolioItems) {
    if (portfolioItem.id) {
      await prisma.portfolioItem.update({
        where: { id: portfolioItem.id },
        data: {
          title: portfolioItem.title,
          description: portfolioItem.description,
          url: portfolioItem.url,
        },
      });

      for (const image of portfolioItem.images) {
        if (image.id) {
          await prisma.image.update({
            where: { id: image.id },
            data: {
              file: {
                create: {
                  url: image.url,
                  type: "IMAGE",
                },
              },
              isPrimary: image.isPrimary,
            },
          });
        } else {
          await prisma.image.create({
            data: {
              file: {
                create: {
                  url: image.url,
                  type: "IMAGE" as MediaType,
                },
              },
              isPrimary: image.isPrimary,
              portfolioItemId: portfolioItem.id,
            },
          });
        }
      }
      for (const image of prev.portfolioItems
        .find((item) => item.id === portfolioItem.id)
        ?.images.filter(
          (img) => !portfolioItem.images.some((newImg) => newImg.id === img.id)
        ) || []) {
        await prisma.image.delete({
          where: { id: image.id },
        });
      }
    } else {
      const newPortfolioItem = await prisma.portfolioItem.create({
        data: {
          title: portfolioItem.title,
          description: portfolioItem.description,
          url: portfolioItem.url,
          userId: user.id,
        },
      });

      for (const image of portfolioItem.images) {
        await prisma.image.create({
          data: {
            file: {
              create: {
                url: image.url,
                type: "IMAGE" as MediaType,
              },
            },
            isPrimary: image.isPrimary,
            portfolioItemId: newPortfolioItem.id,
          },
        });
      }
    }
  }

  for (const portfolioItem of prev.portfolioItems.filter(
    (item) => !portfolioItems.some((newItem) => newItem.id === item.id)
  )) {
    await prisma.portfolioItem.delete({
      where: { id: portfolioItem.id },
    });
  }

  for (const progress of prev.badgeProgress) {
    if (progress.id === featuredBadge) {
      await prisma.userBadgeProgress.update({
        where: { id: progress.id },
        data: {
          isFeatured: true,
        },
      });
    } else {
      await prisma.userBadgeProgress.update({
        where: { id: progress.id },
        data: {
          isFeatured: false,
        },
      });
    }
  }
};
