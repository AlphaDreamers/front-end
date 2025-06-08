"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { KycFormSchema, UpdateProfileFormSchema } from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import { me } from "./actions/auth";

export const getSimilarSellers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      gigs: {
        select: {
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
    take: 5,
  });
};

export const loadMoreReviews = async (
  userId: string,
  skip: number = 0,
  take: number = 3
) => {
  return await prisma.review.findMany({
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
          avatar: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take,
  });
};

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
            data: { url: image.url, isPrimary: image.isPrimary },
          });
        } else {
          await prisma.image.create({
            data: {
              url: image.url,
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
            url: image.url,
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

export const confirmPayment = async (orderId: string) => {
  const user = await me();
  if (!user?.isVerified) throw new Error("User not authenticated");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("Order not found");
  if (order.buyerId !== user.id)
    throw new Error("You are not the buyer of this order");

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "IN_PROGRESS",
    },
  });

  return order;
};

export const verifyKyc = async (values: z.infer<typeof KycFormSchema>) => {
  const user = await me();
  if (!user) {
    throw new Error("User not authenticated");
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isKycVerified: true,
    },
  });
};

export const getFilteredGigsList = async ({ query }: { query: string }) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();

  const where: Prisma.GigWhereInput = {
    OR: [
      {
        title: {
          contains: lowerQuery,
        },
      },
      {
        seller: {
          username: {
            contains: lowerQuery,
          },
        },
      },
      {
        seller: {
          firstName: {
            contains: lowerQuery,
          },
        },
      },
      {
        seller: {
          lastName: {
            contains: lowerQuery,
          },
        },
      },
    ],
  };

  return prisma.gig.findMany({
    where,
    select: {
      id: true,
      title: true,
    },
  });
};

type CategoryWithChildren = {
  id: string;
  label: string;
  children?: CategoryWithChildren[];
};

const constructSelectQuery = (depth: number): Prisma.CategorySelect => {
  const baseSelect: Prisma.CategorySelect = {
    id: true,
    title: true,
  };

  if (depth <= 0) {
    return baseSelect;
  }

  return {
    ...baseSelect,
    children: {
      select: constructSelectQuery(depth - 1),
    },
  };
};

export const getCategoryTree = async (): Promise<CategoryWithChildren[]> => {
  const {
    _max: { depth = 0 },
  } = await prisma.category.aggregate({
    _max: {
      depth: true,
    },
  });

  const selectQuery = constructSelectQuery(depth);

  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    select: selectQuery,
  });

  return categories as CategoryWithChildren[];
};

export const getTestimolnials = async () => {
  return prisma.testimonialContent.findMany({
    select: {
      id: true,
      rating: true,
      content: true,
      contactMessage: {
        select: {
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
};
