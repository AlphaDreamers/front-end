"use server";

import { z } from "zod";
import { CreateGigFormSchema } from "../schemas";
import { me } from "./auth";
import { prisma } from "../prisma";
import { EditGigFormSchema } from "@/lib/schemas";

export const createGig = async (
  values: z.infer<typeof CreateGigFormSchema>
) => {
  const user = await me();

  if (!user) {
    throw new Error("You must be logged in to create a gig");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before creating gigs");
  }

  const { title, description, categoryId, tags, packages, images, features } =
    values;

  // First, upload images to Cloudinary OUTSIDE of the transaction
  // This prevents long-running uploads from blocking the database
  const uploadedImages = await Promise.all(
    images.map(async ({ file, isPrimary }, index) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "gig_images");
        formData.append("folder", "gigs/images");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            `Upload failed: ${error.error?.message || "Unknown error"}`
          );
        }

        const result = await response.json();

        return {
          url: result.secure_url,
          publicId: result.public_id,
          isPrimary,
        };
      } catch (error) {
        console.error(`Failed to upload image ${index + 1}:`, error);
        throw new Error(`Failed to upload image ${index + 1}`);
      }
    })
  );

  // Now create the gig in a transaction with the uploaded image URLs
  try {
    const gig = await prisma.$transaction(async (tx) => {
      // Create the gig
      const newGig = await tx.gig.create({
        data: {
          title,
          description,
          sellerId: user.id,
          categoryId,
          tags: {
            connect: tags.map((tag) => ({ id: tag.id })),
          },
        },
      });

      // Create media files and images
      const mediaFiles = await Promise.all(
        uploadedImages.map(async (img) => {
          const mediaFile = await tx.mediaFile.create({
            data: {
              url: img.url,
              type: "IMAGE",
            },
          });

          return { mediaFile, isPrimary: img.isPrimary };
        })
      );

      // Create images linked to the gig
      await Promise.all(
        mediaFiles.map(({ mediaFile, isPrimary }) =>
          tx.image.create({
            data: {
              fileId: mediaFile.id,
              gigId: newGig.id,
              isPrimary,
            },
          })
        )
      );

      // Create features
      const createdFeatures = await Promise.all(
        features.map((feature) =>
          tx.gigFeature.create({
            data: {
              title: feature.label,
              gigId: newGig.id,
            },
          })
        )
      );

      // Create packages with their feature inclusions
      await Promise.all(
        packages.map(async (pkg) => {
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

    return gig;
  } catch (error) {
    // If the database transaction fails, we should ideally delete the uploaded images
    // from Cloudinary to avoid orphaned files, but for now we'll just throw
    console.error("Failed to create gig:", error);
    throw new Error("Failed to create gig. Please try again.");
  }
};

export const updateGig = async (values: z.infer<typeof EditGigFormSchema>) => {
  try {
    // 1. Authenticate the user
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

    // 2. Verify the gig exists and belongs to the current user
    const existingGig = await prisma.gig.findUnique({
      where: { id },
      include: {
        packages: {
          include: {
            features: true, // Include package-feature relationships
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

    // 3. Process new image uploads OUTSIDE the transaction
    // This prevents long-running uploads from blocking the database
    const processedImages = await Promise.all(
      images.map(async (image) => {
        if (image.type === "existing") {
          // Existing images are already processed
          return {
            type: "existing" as const,
            id: image.id,
            url: image.url,
            isPrimary: image.isPrimary,
          };
        } else {
          // Upload new images to Cloudinary
          try {
            const formData = new FormData();
            formData.append("file", image.file);
            formData.append("upload_preset", "gig_images");
            formData.append("folder", "gigs/images");

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                method: "POST",
                body: formData,
              }
            );

            if (!response.ok) {
              const error = await response.json();
              throw new Error(
                `Upload failed: ${error.error?.message || "Unknown error"}`
              );
            }

            const result = await response.json();

            return {
              type: "new" as const,
              url: result.secure_url,
              publicId: result.public_id,
              isPrimary: image.isPrimary,
              tempId: image.tempId,
            };
          } catch (error) {
            console.error("Failed to upload image:", error);
            throw new Error("Failed to upload image");
          }
        }
      })
    );

    // 4. Perform all database updates in a transaction
    const updatedGig = await prisma.$transaction(async (tx) => {
      // 4.1 Update basic gig information
      await tx.gig.update({
        where: { id },
        data: {
          title,
          description,
          categoryId,
        },
      });

      // 4.2 Handle tags (replace all existing tags with new selection)
      await tx.gig.update({
        where: { id },
        data: {
          tags: {
            set: [], // First disconnect all existing tags
            connect: tags.map((tagId) => ({ id: tagId })), // Then connect new ones
          },
        },
      });

      // 4.3 Handle features
      const existingFeatureIds = new Set(existingGig.features.map((f) => f.id));
      const incomingFeatureIds = new Set(
        features.filter((f) => f.id).map((f) => f.id as string)
      );

      // Delete features that exist in DB but not in the update
      const featuresToDelete = [...existingFeatureIds].filter(
        (id) => !incomingFeatureIds.has(id)
      );

      if (featuresToDelete.length > 0) {
        // First delete package features that reference these gig features
        await tx.packageFeature.deleteMany({
          where: { featureId: { in: featuresToDelete } },
        });

        // Then delete the gig features themselves
        await tx.gigFeature.deleteMany({
          where: { id: { in: featuresToDelete } },
        });
      }

      // Create a mapping of old feature IDs to new feature IDs
      // This handles both updates to existing features and creation of new ones
      const featureIdMapping = new Map<string, string>();

      for (const feature of features) {
        if (feature.id) {
          // Update existing feature
          const updatedFeature = await tx.gigFeature.update({
            where: { id: feature.id },
            data: { title: feature.label },
          });
          featureIdMapping.set(feature.id, updatedFeature.id);
        } else if (feature.tempId) {
          // Create new feature
          const newFeature = await tx.gigFeature.create({
            data: {
              title: feature.label,
              gigId: id,
            },
          });
          featureIdMapping.set(feature.tempId, newFeature.id);
        }
      }

      // 4.4 Handle packages
      const existingPackageIds = new Set(existingGig.packages.map((p) => p.id));
      const incomingPackageIds = new Set(
        packages.filter((p) => p.id).map((p) => p.id as string)
      );

      // Delete packages that exist in DB but not in the update
      const packagesToDelete = [...existingPackageIds].filter(
        (id) => !incomingPackageIds.has(id)
      );

      for (const packageId of packagesToDelete) {
        // Delete package features first (foreign key constraint)
        await tx.packageFeature.deleteMany({
          where: { gigPackageId: packageId },
        });

        // Then delete the package
        await tx.package.delete({
          where: { id: packageId },
        });
      }

      // Update existing packages and create new ones
      for (const pkg of packages) {
        let packageId: string;

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
          // We'll recreate them below with the current state
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

        // Create package features based on the current feature inclusions
        // This recreates the many-to-many relationship for this package
        for (let index = 0; index < features.length; index++) {
          const feature = features[index];
          const isIncluded = pkg.featureInclusions[index];

          // Get the actual feature ID (could be existing or newly created)
          const featureId = feature.id
            ? featureIdMapping.get(feature.id)
            : featureIdMapping.get(feature.tempId!);

          if (featureId) {
            await tx.packageFeature.create({
              data: {
                isIncluded,
                gigPackageId: packageId,
                featureId,
              },
            });
          }
        }
      }

      // 4.5 Handle images
      const existingImageIds = new Set(existingGig.images.map((img) => img.id));
      const incomingImageIds = new Set(
        processedImages
          .filter((img) => img.type === "existing")
          .map((img) => img.id)
      );

      // Delete images that exist in DB but not in the update
      const imagesToDelete = [...existingImageIds].filter(
        (id) => !incomingImageIds.has(id)
      );

      if (imagesToDelete.length > 0) {
        await tx.image.deleteMany({
          where: { id: { in: imagesToDelete } },
        });
      }

      // Update existing images and create new ones
      for (const image of processedImages) {
        if (image.type === "existing") {
          // Update existing image (mainly the isPrimary flag)
          await tx.image.update({
            where: { id: image.id },
            data: { isPrimary: image.isPrimary },
          });
        } else {
          // Create new image with media file
          const mediaFile = await tx.mediaFile.create({
            data: {
              url: image.url,
              type: "IMAGE",
            },
          });

          await tx.image.create({
            data: {
              fileId: mediaFile.id,
              gigId: id,
              isPrimary: image.isPrimary,
            },
          });
        }
      }

      // 4.6 Return the updated gig with all related data
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
          images: {
            include: {
              file: true,
            },
          },
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
