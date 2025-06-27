"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { MediaType, Prisma } from "@prisma/client";
import { Color, DetailedGig, GigSearchParams, LucideIconName } from "../types";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { uploadFileToCloudinary } from "./cloudinary";
import { GigFormSchema, MediaItem } from "../types/forms";
import { FilterType } from "@/components/filters";
import { buildGigFilters } from "../utils";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const getGigForEdit = async (
  gigId: string
): Promise<ActionResult<z.infer<typeof GigFormSchema>>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to edit gigs.",
      };
    }

    const gig = await prisma.gig.findUnique({
      where: { id: gigId, sellerId: session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        categoryId: true,
        tags: {
          select: { id: true },
        },
        features: {
          select: { id: true, title: true },
          orderBy: { createdAt: "asc" },
        },
        packages: {
          select: {
            id: true,
            title: true,
            deliveryTime: true,
            price: true,
            revisions: true,
            features: {
              select: {
                isIncluded: true,
                featureId: true,
              },
              orderBy: {
                feature: {
                  createdAt: "asc",
                },
              },
            },
          },
          orderBy: { price: "asc" },
        },
        media: {
          select: {
            id: true,
            url: true,
            type: true,
            order: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!gig) {
      return {
        success: false,
        error: "Gig not found or you don't have permission to edit it.",
      };
    }

    // Transform to form format
    const formData = {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      categoryId: gig.categoryId,
      tags: gig.tags.map((tag) => tag.id),
      features: gig.features.map((feature) => ({
        id: feature.id,
        title: feature.title,
      })),
      packages: gig.packages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        deliveryTime: pkg.deliveryTime,
        price: pkg.price,
        revisions: pkg.revisions,
        featureInclusions: gig.features.map((feature) => {
          const packageFeature = pkg.features.find(
            (f) => f.featureId === feature.id
          );
          return packageFeature?.isIncluded || false;
        }),
      })),
      media: gig.media.map((mediaFile) => ({
        type: "existing" as const,
        id: mediaFile.id,
        url: mediaFile.url,
        mediaType: mediaFile.type,
        order: mediaFile.order,
      })),
    };

    return {
      success: true,
      data: formData,
    };
  } catch (error) {
    console.error("Get gig for edit error:", error);
    return {
      success: false,
      error: "Failed to load gig data. Please try again.",
    };
  }
};

export const updateGig = async (
  values: z.infer<typeof GigFormSchema>
): Promise<ActionResult<{ gigId: string }>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to update gigs.",
      };
    }

    if (!values.id) {
      return {
        success: false,
        error: "Gig ID is required for updates.",
      };
    }

    // Verify ownership
    const existingGig = await prisma.gig.findUnique({
      where: { id: values.id },
      include: {
        packages: true,
        features: true,
        media: true,
      },
    });

    if (!existingGig || existingGig.sellerId !== session.user.id) {
      return {
        success: false,
        error: "Gig not found or you don't have permission to edit it.",
      };
    }

    // Upload new media files
    const newMediaItems = values.media.filter(
      (item): item is Extract<MediaItem, { type: "new" }> => item.type === "new"
    );

    const uploadedMedia: Array<{
      url: string;
      tempId: string;
      mediaType: MediaType;
      order: number;
    }> = [];

    for (const mediaItem of newMediaItems) {
      try {
        const uploadedUrl = await uploadFileToCloudinary(
          mediaItem.file,
          "chat_media"
        );
        uploadedMedia.push({
          url: uploadedUrl,
          tempId: mediaItem.tempId,
          mediaType: mediaItem.mediaType,
          order: mediaItem.order || 0,
        });
      } catch {
        return {
          success: false,
          error: "Failed to upload media files. Please try again.",
        };
      }
    }

    // Perform database updates in transaction
    const updatedGig = await prisma.$transaction(async (tx) => {
      // Update basic gig info
      await tx.gig.update({
        where: { id: values.id },
        data: {
          title: values.title,
          description: values.description,
          categoryId: values.categoryId,
          tags: {
            set: values.tags.map((tagId) => ({ id: tagId })),
          },
        },
      });

      // Handle features
      const existingFeatureIds = existingGig.features.map((f) => f.id);
      const incomingFeatures = values.features;

      // Delete removed features
      const featuresToDelete = existingFeatureIds.filter(
        (id) => !incomingFeatures.some((f) => f.id === id)
      );

      if (featuresToDelete.length > 0) {
        await tx.packageFeature.deleteMany({
          where: { featureId: { in: featuresToDelete } },
        });
        await tx.gigFeature.deleteMany({
          where: { id: { in: featuresToDelete } },
        });
      }

      // Update existing and create new features
      const featureIdMap = new Map<number, string>();

      for (let i = 0; i < incomingFeatures.length; i++) {
        const feature = incomingFeatures[i];

        if (feature.id) {
          // Update existing
          await tx.gigFeature.update({
            where: { id: feature.id },
            data: { title: feature.title },
          });
          featureIdMap.set(i, feature.id);
        } else {
          // Create new
          const newFeature = await tx.gigFeature.create({
            data: {
              title: feature.title,
              gigId: values.id!,
            },
          });
          featureIdMap.set(i, newFeature.id);
        }
      }

      // Handle packages
      const existingPackageIds = existingGig.packages.map((p) => p.id);
      const incomingPackages = values.packages;

      // Delete removed packages
      const packagesToDelete = existingPackageIds.filter(
        (id) => !incomingPackages.some((p) => p.id === id)
      );

      for (const packageId of packagesToDelete) {
        await tx.packageFeature.deleteMany({
          where: { gigPackageId: packageId },
        });
        await tx.package.delete({
          where: { id: packageId },
        });
      }

      // Update existing and create new packages
      for (const pkg of incomingPackages) {
        let packageId: string;

        if (pkg.id) {
          // Update existing
          await tx.package.update({
            where: { id: pkg.id },
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              price: pkg.price,
              revisions: pkg.revisions,
            },
          });
          packageId = pkg.id;

          // Delete existing package features
          await tx.packageFeature.deleteMany({
            where: { gigPackageId: packageId },
          });
        } else {
          // Create new
          const newPackage = await tx.package.create({
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              price: pkg.price,
              revisions: pkg.revisions,
              gigId: values.id!,
            },
          });
          packageId = newPackage.id;
        }

        // Create package features
        for (let i = 0; i < pkg.featureInclusions.length; i++) {
          const featureId = featureIdMap.get(i);
          if (featureId) {
            await tx.packageFeature.create({
              data: {
                isIncluded: pkg.featureInclusions[i],
                gigPackageId: packageId,
                featureId,
              },
            });
          }
        }
      }

      // Handle media
      const existingMediaIds = existingGig.media.map((m) => m.id);
      const keepMediaIds = values.media
        .filter(
          (m): m is Extract<MediaItem, { type: "existing" }> =>
            m.type === "existing"
        )
        .map((m) => m.id);

      // Disconnect removed media
      const mediaToDisconnect = existingMediaIds.filter(
        (id) => !keepMediaIds.includes(id)
      );

      if (mediaToDisconnect.length > 0) {
        await tx.gig.update({
          where: { id: values.id },
          data: {
            media: {
              disconnect: mediaToDisconnect.map((id) => ({ id })),
            },
          },
        });

        // Delete orphaned media
        const orphanedMedia = await tx.mediaFile.findMany({
          where: {
            id: { in: mediaToDisconnect },
            AND: [{ gigs: { none: {} } }, { portfolioItems: { none: {} } }],
          },
        });

        if (orphanedMedia.length > 0) {
          await tx.mediaFile.deleteMany({
            where: { id: { in: orphanedMedia.map((m) => m.id) } },
          });
        }
      }

      // Create and connect new media
      const newMediaIds: string[] = [];
      for (const uploadedItem of uploadedMedia) {
        const mediaFile = await tx.mediaFile.create({
          data: {
            url: uploadedItem.url,
            type: uploadedItem.mediaType,
            order: uploadedItem.order,
          },
        });
        newMediaIds.push(mediaFile.id);
      }

      if (newMediaIds.length > 0) {
        await tx.gig.update({
          where: { id: values.id },
          data: {
            media: {
              connect: newMediaIds.map((id) => ({ id })),
            },
          },
        });
      }

      return await tx.gig.findUnique({
        where: { id: values.id },
      });
    });

    revalidatePath("/dashboard/gigs");
    revalidatePath(`/gigs/${values.id}`);

    return {
      success: true,
      data: { gigId: updatedGig!.id },
    };
  } catch (error) {
    console.error("Update gig error:", error);
    return {
      success: false,
      error: "Failed to update gig. Please try again.",
    };
  }
};

export const createGig = async (
  values: Omit<z.infer<typeof GigFormSchema>, "id">
): Promise<ActionResult<{ gigId: string }>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to create a gig.",
      };
    }

    // Validate input
    if (values.packages.length === 0) {
      return {
        success: false,
        error: "At least one package is required.",
      };
    }

    if (values.features.length === 0) {
      return {
        success: false,
        error: "At least one feature is required.",
      };
    }

    // Upload media files
    const uploadedMedia: Array<{
      url: string;
      mediaType: MediaType;
      order: number;
    }> = [];

    const newMediaItems = values.media.filter(
      (item): item is Extract<MediaItem, { type: "new" }> => item.type === "new"
    );

    for (const [index, mediaItem] of newMediaItems.entries()) {
      try {
        const uploadedUrl = await uploadFileToCloudinary(
          mediaItem.file,
          "chat_media"
        );
        uploadedMedia.push({
          url: uploadedUrl,
          mediaType: mediaItem.mediaType,
          order: index,
        });
      } catch {
        return {
          success: false,
          error: "Failed to upload media files. Please try again.",
        };
      }
    }

    // Create gig in transaction
    const gig = await prisma.$transaction(async (tx) => {
      // Create gig
      const newGig = await tx.gig.create({
        data: {
          title: values.title,
          description: values.description,
          sellerId: session.user.id,
          categoryId: values.categoryId,
          tags: {
            connect: values.tags.map((tagId) => ({ id: tagId })),
          },
        },
      });

      // Create media files
      const mediaFiles = await Promise.all(
        uploadedMedia.map((item) =>
          tx.mediaFile.create({
            data: {
              url: item.url,
              type: item.mediaType,
              order: item.order,
            },
          })
        )
      );

      // Connect media to gig
      await tx.gig.update({
        where: { id: newGig.id },
        data: {
          media: {
            connect: mediaFiles.map((file) => ({ id: file.id })),
          },
        },
      });

      // Create features
      const createdFeatures = await Promise.all(
        values.features.map((feature) =>
          tx.gigFeature.create({
            data: {
              title: feature.title,
              gigId: newGig.id,
            },
          })
        )
      );

      // Create packages
      await Promise.all(
        values.packages.map(async (pkg) => {
          const newPackage = await tx.package.create({
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              revisions: pkg.revisions,
              price: pkg.price,
              gigId: newGig.id,
            },
          });

          // Create package features
          await Promise.all(
            pkg.featureInclusions.map((isIncluded, index) =>
              tx.packageFeature.create({
                data: {
                  isIncluded,
                  gigPackageId: newPackage.id,
                  featureId: createdFeatures[index].id,
                },
              })
            )
          );
        })
      );

      return newGig;
    });

    revalidatePath("/dashboard/gigs");

    return {
      success: true,
      data: { gigId: gig.id },
    };
  } catch (error) {
    console.error("Create gig error:", error);
    return {
      success: false,
      error: "Failed to create gig. Please try again.",
    };
  }
};

export const deleteGig = async (gigId: string): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to delete a gig.",
      };
    }

    const existingGig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: {
        sellerId: true,
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!existingGig) {
      return {
        success: false,
        error: "Gig not found.",
      };
    }

    if (existingGig.sellerId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to delete this gig.",
      };
    }

    if (existingGig._count.orders > 0) {
      return {
        success: false,
        error: "Cannot delete a gig with existing orders.",
      };
    }

    await prisma.packageFeature.deleteMany({
      where: {
        gigPackage: { gigId },
      },
    });

    await prisma.package.deleteMany({
      where: { gigId },
    });

    await prisma.gigFeature.deleteMany({
      where: { gigId },
    });

    await prisma.gig.delete({
      where: { id: gigId },
    });

    revalidatePath("/dashboard/gigs");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete gig error:", error);
    return {
      success: false,
      error: "Failed to delete gig. Please try again.",
    };
  }
};

// 3. Single function to fetch gigs with all necessary data
export const fetchGigsWithFilters = async (
  searchParams: GigSearchParams,
  itemsPerPage: number = 20,
  options?: {
    additionalWhere?: Prisma.GigWhereInput;
  }
) => {
  const page = parseInt(searchParams.page || "1") || 1;
  const skip = (page - 1) * itemsPerPage;
  const baseWhere = buildGigFilters(searchParams);

  // Merge base filters with any additional filters
  const where = options?.additionalWhere
    ? { ...baseWhere, ...options.additionalWhere }
    : baseWhere;

  const minRating = searchParams.min_rating
    ? parseFloat(searchParams.min_rating)
    : undefined;

  // Parse price range for application-level filtering
  const priceRange = searchParams.price
    ? (() => {
        const [min, max] = searchParams.price.split("-").map(Number);
        return {
          min: min || 0,
          max: max || Number.MAX_SAFE_INTEGER,
        };
      })()
    : undefined;

  // Get session for bookmark check
  const session = await auth();

  // Fetch gigs with a cleaner select
  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      skip,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
      include: {
        packages: {
          select: {
            price: true,
            orders: {
              include: {
                review: {
                  select: { rating: true },
                },
              },
            },
          },
        },
        media: {
          where: { type: "IMAGE" },
          orderBy: { order: "asc" },
          take: 1,
        },
        seller: {
          include: {
            badgeProgress: {
              where: { isFeatured: true },
              include: { badge: true },
            },
          },
        },
        category: true,
        tags: true,
        bookmarks: {
          where: { id: session?.user?.id || "" },
        },
      },
    }),
    prisma.gig.count({ where }),
  ]);

  // Transform and filter by rating in one pass
  const transformedGigs = gigs
    .map((gig) => {
      // Calculate ratings
      const reviews = gig.packages
        .flatMap((pkg) => pkg.orders.map((order) => order.review?.rating))
        .filter((r) => r !== undefined);
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((a, b) => a + b, 0) / reviews.length
          : 0;

      // Early return if doesn't meet rating requirement
      if (minRating && (reviews.length === 0 || averageRating < minRating)) {
        return null;
      }

      // Find lowest price
      const lowestPrice = Math.min(...gig.packages.map((pkg) => pkg.price));

      // Early return if doesn't meet price requirement
      if (
        priceRange &&
        (lowestPrice < priceRange.min || lowestPrice > priceRange.max)
      ) {
        return null;
      }

      return {
        id: gig.id,
        title: gig.title,
        description: gig.description,
        primaryImage: gig.media[0]?.url || "/gig-fallback.jpg",
        startsAtPrice: lowestPrice,
        averageRating,
        ratingCount: reviews.length,
        isBookmarked: gig.bookmarks.length > 0,
        category: {
          id: gig.category.id,
          label: gig.category.title,
          icon: gig.category.icon as LucideIconName,
          color: gig.category.color as Color,
        },
        tags: gig.tags.map((tag) => ({
          id: tag.id,
          label: tag.title,
        })),
        seller: {
          id: gig.seller.id,
          username: gig.seller.username,
          firstName: gig.seller.firstName,
          lastName: gig.seller.lastName,
          avatar: gig.seller.avatar || undefined,
          badge: gig.seller.badgeProgress[0]
            ? {
                icon: gig.seller.badgeProgress[0].badge.icon as LucideIconName,
                color: gig.seller.badgeProgress[0].badge.color as Color,
                title: gig.seller.badgeProgress[0].badge.title,
                tier: gig.seller.badgeProgress[0].highestTier,
              }
            : undefined,
        },
      };
    })
    .filter((g) => g !== null);

  // Adjust count for filtered gigs
  // When filtering by rating or price at application level, use actual filtered count
  const filteredCount =
    minRating || priceRange ? transformedGigs.length : totalCount;

  return {
    gigs: transformedGigs,
    totalPages: Math.ceil(filteredCount / itemsPerPage),
    currentPage: page,
    totalCount: filteredCount,
  };
};

export const toggleGigBookmark = async (
  gigId: string
): Promise<ActionResult<{ isBookmarked: boolean }>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to bookmark gigs.",
      };
    }

    const isBookmarked = await prisma.gig.count({
      where: {
        id: gigId,
        bookmarks: {
          some: {
            id: session.user.id,
          },
        },
      },
    });

    if (isBookmarked > 0) {
      await prisma.gig.update({
        where: { id: gigId },
        data: {
          bookmarks: {
            disconnect: { id: session.user.id },
          },
        },
      });
    } else {
      await prisma.gig.update({
        where: { id: gigId },
        data: {
          bookmarks: {
            connect: { id: session.user.id },
          },
        },
      });
    }

    revalidatePath("/bookmarks");

    return {
      success: true,
      data: { isBookmarked: isBookmarked === 0 },
    };
  } catch (error) {
    console.error("Toggle bookmark error:", error);
    return {
      success: false,
      error: "Failed to update bookmark. Please try again.",
    };
  }
};

export const getDetailedGig = async (
  gigId: string
): Promise<ActionResult<DetailedGig>> => {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: {
        id: true,
        title: true,
        description: true,
        media: {
          select: {
            id: true,
            url: true,
            type: true,
          },
          orderBy: {
            id: "asc",
          },
          take: 10,
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
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
        faqs: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
        packages: {
          select: {
            orders: {
              select: {
                review: {
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
              },
            },
            id: true,
            price: true,
            title: true,
            deliveryTime: true,
            revisions: true,
            features: {
              select: {
                id: true,
                isIncluded: true,
                feature: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!gig) {
      return {
        success: false,
        error: "Gig not found.",
      };
    }

    const reviews = gig.packages
      .flatMap((pkg) => pkg.orders.flatMap((order) => order.review))
      .filter((review) => review !== null);

    const detailedGig: DetailedGig = {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      media: gig.media.map((mediaFile) => ({
        id: mediaFile.id,
        url: mediaFile.url,
        type: mediaFile.type,
      })),
      seller: {
        id: gig.seller.id,
        firstName: gig.seller.firstName,
        lastName: gig.seller.lastName,
        username: gig.seller.username,
        avatar: gig.seller.avatar || undefined,
        badge:
          gig.seller.badgeProgress.length > 0
            ? {
                tier: gig.seller.badgeProgress[0].highestTier,
                title: gig.seller.badgeProgress[0].badge.title,
                icon: gig.seller.badgeProgress[0].badge.icon as LucideIconName,
                color: gig.seller.badgeProgress[0].badge.color as Color,
              }
            : undefined,
      },
      avgRating:
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        (reviews.length || 1),
      reviewCount: reviews.length,
      packages: gig.packages.map((pkg) => ({
        id: pkg.id,
        price: pkg.price,
        title: pkg.title,
        deliveryTime: pkg.deliveryTime,
        revisions: pkg.revisions,
        features: pkg.features.map((feature) => ({
          id: feature.feature.id,
          label: feature.feature.title,
          isIncluded: feature.isIncluded,
        })),
      })),
      faqs: gig.faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      })),
    };

    return {
      success: true,
      data: detailedGig,
    };
  } catch (error) {
    console.error("Get detailed gig error:", error);
    return {
      success: false,
      error: "Failed to load gig details. Please try again.",
    };
  }
};

export const fetchDashboardGigs = async (
  searchParams: GigSearchParams,
  itemsPerPage: number = 20,
  options: { sellerId: string }
) => {
  const page = parseInt(searchParams.page || "1") || 1;
  const skip = (page - 1) * itemsPerPage;
  const baseWhere = buildGigFilters(searchParams);

  const where = {
    ...baseWhere,
    sellerId: options.sellerId,
  };

  const minRating = searchParams.min_rating
    ? parseFloat(searchParams.min_rating)
    : undefined;

  // Parse price range for application-level filtering
  const priceRange = searchParams.price
    ? (() => {
        const [min, max] = searchParams.price.split("-").map(Number);
        return {
          min: min || 0,
          max: max || Number.MAX_SAFE_INTEGER,
        };
      })()
    : undefined;

  const [gigs, totalCount] = await Promise.all([
    prisma.gig.findMany({
      where,
      skip,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        media: {
          where: { type: "IMAGE" },
          orderBy: { order: "asc" },
          take: 1,
        },
        _count: {
          select: { orders: true },
        },
        packages: {
          select: {
            price: true,
            title: true,
            id: true,
            _count: {
              select: { orders: true },
            },
          },
        },
        reviews: {
          select: { rating: true },
        },
        category: {
          select: {
            title: true,
            id: true,
            color: true,
            icon: true,
          },
        },
      },
    }),
    prisma.gig.count({ where }),
  ]);

  // Transform for dashboard view
  const transformedGigs = gigs
    .map((gig) => {
      const averageRating =
        gig.reviews.length > 0
          ? gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
            gig.reviews.length
          : 0;

      // Filter by rating if needed
      if (
        minRating &&
        (gig.reviews.length === 0 || averageRating < minRating)
      ) {
        return null;
      }

      const startsAtPrice = Math.min(...gig.packages.map((pkg) => pkg.price));

      // Filter by price if needed
      if (
        priceRange &&
        (startsAtPrice < priceRange.min || startsAtPrice > priceRange.max)
      ) {
        return null;
      }

      return {
        id: gig.id,
        primaryImage: gig.media[0]?.url || "/gig-fallback.jpg",
        startsAtPrice,
        title: gig.title,
        description: gig.description,
        ratingCount: gig.reviews.length,
        averageRating,
        category: {
          id: gig.category.id,
          label: gig.category.title,
          icon: gig.category.icon as LucideIconName,
          color: gig.category.color as Color,
        },
        packages: gig.packages.map((pkg) => ({
          id: pkg.id,
          title: pkg.title,
          price: pkg.price,
          orderCnt: pkg._count.orders,
        })),
        totalOrders: gig._count.orders,
        createdAt: gig.createdAt,
      };
    })
    .filter((g) => g !== null);

  // Adjust count if filtering by rating or price
  const filteredCount =
    minRating || priceRange
      ? transformedGigs.length // Already filtered above
      : totalCount;

  return {
    gigs: transformedGigs,
    totalPages: Math.ceil(filteredCount / itemsPerPage),
    currentPage: page,
    totalCount: filteredCount,
  };
};

interface GetGigFiltersOptions {
  // Optional where clause to scope the filters
  where?: Prisma.GigWhereInput;
  // Optional user ID for bookmark filtering
  userId?: string;
}

interface GetGigFiltersOptions {
  searchParams: GigSearchParams;
  additionalWhere?: Prisma.GigWhereInput;
  userId?: string;
}

export const getGigFilters = async (options: GetGigFiltersOptions) => {
  // Build the current query based on search params
  const baseWhere = buildGigFilters(options.searchParams);

  // Merge with any additional filters (like bookmarks)
  const where: Prisma.GigWhereInput = options.userId
    ? {
        ...baseWhere,
        ...options.additionalWhere,
        bookmarks: {
          some: { id: options.userId },
        },
      }
    : { ...baseWhere, ...options.additionalWhere };

  // Get all gigs that match current filters to calculate dynamic ranges
  const gigsForFilters = await prisma.gig.findMany({
    where,
    select: {
      categoryId: true,
      packages: {
        select: {
          price: true,
        },
      },
      seller: {
        select: {
          isProfileVerified: true,
        },
      },
    },
  });

  // Get unique categories from current results
  const categoryIds = [...new Set(gigsForFilters.map((g) => g.categoryId))];

  // Fetch category details only for categories in current results
  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  // Calculate category counts from current results
  const categoryCounts = categoryIds.reduce(
    (acc, catId) => {
      acc[catId] = gigsForFilters.filter((g) => g.categoryId === catId).length;
      return acc;
    },
    {} as Record<string, number>
  );

  // Handle empty state
  if (gigsForFilters.length === 0) {
    // Return minimal filters when no gigs match
    return [
      {
        id: "rating",
        type: "rating",
        label: "Seller Rating",
        paramKey: "min_rating",
        maxRating: 5,
        minSelectable: 1,
        showLabel: true,
        description: "Show only sellers with this rating or higher",
        defaultValue: options.searchParams.min_rating,
      },
      {
        id: "date_added",
        type: "date",
        label: "Date Added",
        paramKey: "added_after",
        mode: "single",
        maxDate: new Date().toISOString(),
        presets: [
          { label: "Last 24 hours", value: "1d" },
          { label: "Last 7 days", value: "7d" },
          { label: "Last 30 days", value: "30d" },
        ],
        defaultValue: options.searchParams.added_after,
      },
    ] as const satisfies FilterType[];
  }

  // Calculate price range from current results
  const allPrices = gigsForFilters.flatMap((gig) =>
    gig.packages.map((pkg) => pkg.price)
  );

  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  // Count verified sellers in current results
  const verifiedCount = gigsForFilters.filter(
    (g) => g.seller.isProfileVerified
  ).length;

  return [
    {
      id: "price",
      type: "range",
      label: "Price Range",
      paramKey: "price",
      min: minPrice,
      max: maxPrice,
      step: 0.01,
      suffix: "SOL",
      formatDisplay: "currency",
      // Show current selected range if any
      defaultValue: options.searchParams.price,
    },
    {
      id: "rating",
      type: "rating",
      label: "Seller Rating",
      paramKey: "min_rating",
      maxRating: 5,
      minSelectable: 1,
      showLabel: true,
      description: "Show only sellers with this rating or higher",
      defaultValue: options.searchParams.min_rating,
    },
    {
      id: "date_added",
      type: "date",
      label: "Date Added",
      paramKey: "added_after",
      mode: "single",
      maxDate: new Date().toISOString(),
      presets: [
        { label: "Last 24 hours", value: "1d" },
        { label: "Last 7 days", value: "7d" },
        { label: "Last 30 days", value: "30d" },
      ],
      defaultValue: options.searchParams.added_after,
    },
    {
      id: "verified",
      type: "toggle",
      label: `Verified Sellers Only (${verifiedCount})`,
      paramKey: "verified",
      onLabel: "Yes",
      offLabel: "No",
      defaultChecked: options.searchParams.verified === "true",
      icon: "shield-check",
    },
    {
      id: "category",
      type: "select",
      label: "Category",
      paramKey: "category",
      options: categories
        .map((cat) => ({
          value: cat.id,
          label: `${cat.title} (${categoryCounts[cat.id] || 0})`,
        }))
        .sort((a, b) => {
          // Sort by count descending
          const countA = parseInt(a.label.match(/\((\d+)\)/)?.[1] || "0");
          const countB = parseInt(b.label.match(/\((\d+)\)/)?.[1] || "0");
          return countB - countA;
        }),
      multiple: true,
      placeholder: "Select categories",
      icon: "folder",
      defaultValue: options.searchParams.category,
    },
  ] as const satisfies FilterType[];
};
