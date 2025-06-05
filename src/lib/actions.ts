"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  KycFormSchema,
  UpdateGigFormSchema,
  UpdateProfileFormSchema,
} from "@/lib/schemas";
import { Prisma } from "@prisma/client";
import { me } from "./actions/auth";

export const updateGig = async (
  values: z.infer<typeof UpdateGigFormSchema>
) => {
  try {
    // Authenticate the user
    const user = await me();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const {
      id,
      title,
      description,
      categoryId,
      tags,
      packages,
      images,
      features,
    } = values;

    // Verify the gig exists and belongs to the current user
    const existingGig = await prisma.gig.findUnique({
      where: { id },
      include: {
        packages: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
        features: true,
        images: true,
        tags: true,
      },
    });

    if (!existingGig) {
      throw new Error("Gig not found");
    }

    if (existingGig.sellerId !== user.id) {
      throw new Error("You do not have permission to update this gig");
    }

    // Perform all updates in a transaction
    const updatedGig = await prisma.$transaction(async (tx) => {
      // 1. Update basic gig info
      await tx.gig.update({
        where: { id },
        data: {
          title,
          description,
          categoryId,
        },
      });

      // 2. Handle tags (replace all)
      await tx.gig.update({
        where: { id },
        data: {
          tags: {
            set: [], // First disconnect all existing tags
            connect: tags.map((tag) => ({ id: tag.id })), // Then connect new ones
          },
        },
      });

      // 3. Handle features
      const existingFeatureIds = new Set(
        existingGig.features.map((feature) => feature.id)
      );
      const newFeatureIds = new Set(
        features.filter((f) => f.id).map((f) => f.id as string)
      );

      // 3.1 Delete features that exist in DB but not in update data
      const featuresToDelete = [...existingFeatureIds].filter(
        (id) => !newFeatureIds.has(id)
      );
      if (featuresToDelete.length > 0) {
        // First delete the package features that reference these gig features
        await tx.packageFeature.deleteMany({
          where: {
            featureId: {
              in: featuresToDelete,
            },
          },
        });

        // Then delete the gig features themselves
        await tx.gigFeature.deleteMany({
          where: {
            id: {
              in: featuresToDelete,
            },
          },
        });
      }

      // 3.2 Update or create features
      const updatedFeatureMap = new Map(); // Map to track feature id mapping

      for (const feature of features) {
        if (feature.id) {
          // Update existing feature
          const updatedFeature = await tx.gigFeature.update({
            where: { id: feature.id },
            data: { label: feature.label },
          });
          updatedFeatureMap.set(feature.id, updatedFeature.id);
        } else {
          // Create new feature
          const newFeature = await tx.gigFeature.create({
            data: {
              label: feature.label,
              gigId: id,
            },
          });
          updatedFeatureMap.set(feature.tempId, newFeature.id); // Using tempId for mapping
        }
      }

      // 4. Handle packages
      // Get IDs of existing packages
      const existingPackageIds = new Set(
        existingGig.packages.map((pkg) => pkg.id)
      );
      const newPackageIds = new Set(
        packages.filter((pkg) => pkg.id).map((pkg) => pkg.id as string)
      );

      // 4.1 Delete packages that exist in DB but not in update data
      const packagesToDelete = [...existingPackageIds].filter(
        (id) => !newPackageIds.has(id)
      );

      for (const packageId of packagesToDelete) {
        // Delete package features first
        await tx.packageFeature.deleteMany({
          where: { gigPackageId: packageId },
        });

        // Then delete the package
        await tx.package.delete({
          where: { id: packageId },
        });
      }

      // 4.2 Update existing packages and create new ones
      for (const pkg of packages) {
        let packageId;

        if (pkg.id) {
          // Update existing package
          const updatedPackage = await tx.package.update({
            where: { id: pkg.id },
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              price: pkg.price,
              revisions: pkg.revisions,
            },
          });
          packageId = updatedPackage.id;

          // Delete all existing package features for this package
          await tx.packageFeature.deleteMany({
            where: { gigPackageId: packageId },
          });
        } else {
          // Create new package
          const newPackage = await tx.package.create({
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              price: pkg.price,
              revisions: pkg.revisions,
              gigId: id,
            },
          });
          packageId = newPackage.id;
        }

        // Create all package features
        await Promise.all(
          features.map(async (feature, index) => {
            const featureId = feature.id
              ? updatedFeatureMap.get(feature.id)
              : updatedFeatureMap.get(feature.tempId);

            await tx.packageFeature.create({
              data: {
                isIncluded: pkg.featureInclusions[index],
                gigPackageId: packageId,
                featureId: featureId,
              },
            });
          })
        );
      }

      // 5. Handle images
      const existingImageIds = new Set(existingGig.images.map((img) => img.id));
      const newImageIds = new Set(
        images.filter((img) => img.id).map((img) => img.id as string)
      );

      // 5.1 Delete images that exist in DB but not in update data
      const imagesToDelete = [...existingImageIds].filter(
        (id) => !newImageIds.has(id)
      );
      if (imagesToDelete.length > 0) {
        await tx.image.deleteMany({
          where: {
            id: {
              in: imagesToDelete,
            },
          },
        });
      }

      // 5.2 Update existing images and create new ones
      for (const image of images) {
        if (image.id) {
          // Update existing image
          await tx.image.update({
            where: { id: image.id },
            data: { url: image.url },
          });
        } else {
          // Create new image
          await tx.image.create({
            data: {
              url: image.url,
              gigId: id,
            },
          });
        }
      }

      // 6. Return the updated gig with all related data
      return await tx.gig.findUnique({
        where: { id },
        include: {
          category: true,
          tags: true,
          features: true,
          packages: {
            include: {
              features: {
                include: {
                  feature: true,
                },
              },
            },
          },
          images: true,
          seller: true,
        },
      });
    });

    return { success: true, data: updatedGig };
  } catch (error) {
    console.error("Error updating gig:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update gig",
    };
  }
};

export const deleteGig = async (gigId: string) => {
  const user = await me();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const existingGig = await prisma.gig.findUnique({
    where: { id: gigId },
  });

  if (!existingGig) {
    throw new Error("Gig not found");
  }

  if (existingGig.sellerId !== user.id) {
    throw new Error("You do not have permission to delete this gig");
  }

  await prisma.gig.delete({
    where: { id: gigId },
  });
};

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

export const orderPackage = async (packageId: string) => {
  const user = await me();
  if (!user?.isVerified) throw new Error("User not authenticated");

  const gigPackage = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      gig: {
        select: {
          id: true,
          title: true,
          sellerId: true,
        },
      },
    },
  });

  if (!gigPackage) throw new Error("Package not found");

  await prisma.order.create({
    data: {
      status: "WAITING_FOR_PAYMENT",
      buyerId: user.id,
      sellerId: gigPackage.gig.sellerId,
      packageId: gigPackage.id,
      deadline: new Date(
        Date.now() + gigPackage.deliveryTime * 24 * 60 * 60 * 1000 // Convert delivery time to milliseconds
      ),
      gigId: gigPackage.gig.id,
      chat: {
        create: {
          buyerId: user.id,
          sellerId: gigPackage.gig.sellerId,
        },
      },
    },
  });
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
