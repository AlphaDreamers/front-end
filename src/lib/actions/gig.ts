import { z } from "zod";
import { CreateGigFormSchema } from "../schemas";
import { me } from "./auth";
import { prisma } from "../prisma";

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
