"use server";

import { z } from "zod";

import { Resend } from "resend";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  CreateGigFormSchema,
  ForgotPasswordFormSchema,
  KycFormSchema,
  PasswordResetCodeSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UpdateGigFormSchema,
  UpdateProfileFormSchema,
  VerifyEmailFormSchema,
} from "@/lib/schemas";
import VerificationEmailTemplate from "@/components/email-templates/verification-email";
import WelcomeEmailTemplate from "@/components/email-templates/welcome-email";
import { Chat, CLODUINARY_CONFIG, JWTToken, UploadPreset } from "./types";
import { Prisma } from "@prisma/client";
import PasswordResetEmailTemplate from "@/components/email-templates/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY!);

const DEFAULT_FROM_EMAIL = "Acme <onboarding@resend.dev>";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function signUp(values: z.infer<typeof SignUpFormSchema>) {
  const { username, email, password, firstName, lastName } = values;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      isVerified: true,
    },
  });

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error("Email is already registered and verified");
    } else {
      throw new Error("Email is already registered but not verified");
    }
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await prisma.$transaction(async () => {
    await prisma.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: await argon2.hash(password),
        verificationToken: {
          create: {
            code: verificationCode,
            expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
          },
        },
      },
    });

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Verify your email address",
      react: await VerificationEmailTemplate({ code: verificationCode }),
    });

    if (error) {
      throw new Error(
        "Failed to send verification email. Please try again later."
      );
    }
  });
}

export async function verifyEmail(
  values: z.infer<typeof VerifyEmailFormSchema>
) {
  const { code, email } = values;

  const token = await prisma.verificationToken.findFirst({
    where: {
      code,
      user: { email },
    },
    include: {
      user: true,
    },
  });

  if (!token) {
    throw new Error("Invalid verification code");
  }

  if (token.expiresAt < new Date()) {
    throw new Error("Verification code has expired");
  }

  await prisma.$transaction(async () => {
    await prisma.user.update({
      where: { id: token.user.id },
      data: { isVerified: true },
    });

    await prisma.verificationToken.delete({
      where: { id: token.id },
    });

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Welcome to our platform!",
      react: await WelcomeEmailTemplate({ username: token.user.username }),
    });

    if (error) {
      throw new Error("Failed to send welcome email. Please try again later.");
    }
  });
}

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
      verificationToken: {
        select: {
          code: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  // Generate new verification code
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await prisma.$transaction(async () => {
    if (
      user.verificationToken &&
      user.verificationToken.expiresAt > new Date()
    ) {
      // Update existing token if it hasn't expired
      await prisma.verificationToken.update({
        where: { userId: user.id },
        data: {
          code: verificationCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    } else {
      // Create new token if it doesn't exist or has expired
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          code: verificationCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    }

    // Send verification email
    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Verify your email address",
      react: await VerificationEmailTemplate({ code: verificationCode }),
    });

    if (error) {
      throw new Error(
        "Failed to send verification email. Please try again later."
      );
    }
  });
}

export async function signIn(values: z.infer<typeof SignInFormSchema>) {
  const { email, password } = values;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before signing in");
  }

  const isValidPassword = await argon2.verify(user.password, password);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const tokenPayload: JWTToken = {
    id: user.id,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60, // 1 day in seconds
    path: "/",
  });
}

export async function resendPasswordResetCode(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
      verificationToken: {
        select: {
          code: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Email is not verified");
  }

  // Generate new reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.$transaction(async () => {
    if (
      user.verificationToken &&
      user.verificationToken.expiresAt > new Date()
    ) {
      // Update existing token if it hasn't expired
      await prisma.verificationToken.update({
        where: { userId: user.id },
        data: {
          code: resetCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    } else {
      // Create new token if it doesn't exist or has expired
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          code: resetCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    }

    // Send reset code email
    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Reset your password",
      react: await PasswordResetEmailTemplate({ code: resetCode, email }),
    });

    if (error) {
      throw new Error(
        "Failed to send password reset email. Please try again later."
      );
    }
  });
}

export async function resetPassword({
  email,
  code,
  newPassword,
}: z.infer<typeof ResetPasswordFormSchema>) {
  const user = await me();

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await argon2.hash(newPassword),
      },
    });
    return;
  }

  const token = await prisma.verificationToken.findFirst({
    where: {
      code,
      user: { email },
    },
    include: { user: true },
  });

  if (!token || token.expiresAt.getTime() < Date.now()) {
    throw new Error("Invalid or expired code");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.user.id },
      data: { password: await argon2.hash(newPassword) },
    }),
    prisma.verificationToken.delete({
      where: { id: token.id },
    }),
  ]);
}

export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("token");
}

export async function me() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        isVerified: true,
        publicKey: true,
        avatar: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });

    return user;
  } catch {
    return null;
  }
}

export const createGig = async (
  values: z.infer<typeof CreateGigFormSchema>
) => {
  const user = await me();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { title, description, categoryId, tags, packages, images, features } =
    values;

  await prisma.$transaction(async (tx) => {
    const cloudinaryImages = await Promise.all(
      images.map(async ({ file }) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "gig_images");
          formData.append("folder", "gigs/images");

          // Log the cloud name to verify it's correct
          console.log("Uploading to cloud:", process.env.CLOUDINARY_CLOUD_NAME);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();

          // Log the full response for debugging
          console.log("Cloudinary response:", result);

          if (!response.ok) {
            throw new Error(
              `Cloudinary upload failed: ${JSON.stringify(result)}`
            );
          }

          return result;
        } catch (error) {
          console.error("Upload error:", error);
          return { error: { message: error.message } };
        }
      })
    );

    const newGig = await tx.gig.create({
      data: {
        title,
        description,
        category: {
          connect: {
            id: categoryId,
          },
        },
        tags: {
          connect: tags.map((tag) => ({
            id: tag.id,
          })),
        },
        seller: {
          connect: {
            id: user.id,
          },
        },
        images: {
          create: images.map((image, index) => ({
            url:
              cloudinaryImages[index].secure_url || cloudinaryImages[index].url,
            isPrimary: image.isPrimary,
          })),
        },
      },
    });

    const createdFeatures = await Promise.all(
      features.map(async (feature) => {
        return await tx.gigFeature.create({
          data: {
            label: feature.label,
            gigId: newGig.id,
          },
        });
      })
    );

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

        await Promise.all(
          features.map(async (feature, featureIndex) => {
            await tx.packageFeature.create({
              data: {
                isIncluded: pkg.featureInclusions[featureIndex],
                gigPackageId: newPackage.id,
                featureId: createdFeatures[featureIndex].id,
              },
            });
          })
        );
      })
    );
  });
};

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

export const createWallet = async (values: {
  publicKey: string;
  name: string;
}) => {
  const user = await me();

  if (!user?.isVerified) throw new Error("User not authenticated");

  const { publicKey, name } = values;

  await prisma.wallet.create({
    data: {
      publicKey,
      name,
      userId: user.id,
    },
  });
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

export const getChatById = async (chatId: string): Promise<Chat | null> => {
  const currentUser = await me();

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    select: {
      id: true,
      buyer: {
        select: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          avatar: true,
          firstName: true,
          lastName: true,
        },
      },
      messages: {
        select: {
          id: true,
          type: true,
          readBy: {
            select: {
              id: true,
            },
          },
          systemContent: {
            select: {
              type: true,
              content: true,
            },
          },
          textContent: {
            select: {
              text: true,
              userMessage: {
                select: {
                  userId: true,
                },
              },
            },
          },
          mediaContent: {
            select: {
              files: {
                select: {
                  url: true,
                },
              },
              userMessage: {
                select: {
                  userId: true,
                },
              },
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!chat) {
    return null;
  }

  return {
    ...chat,
    messages: chat.messages.map((ms) => ({
      id: ms.id,
      createdAt: ms.createdAt,
      isRead: ms.readBy.some((user) => user.id === currentUser.id),
      type: ms.type,
      content:
        ms.type === "TEXT"
          ? {
              text: ms.textContent?.text || "",
            }
          : ms.type === "MEDIA"
            ? {
                urls: ms.mediaContent?.files.map((url) => url.url) || [],
              }
            : {
                type: ms.systemContent?.type,
                content: ms.systemContent?.content || "",
              },
      senderId:
        ms.textContent?.userMessage.userId ||
        ms.mediaContent?.userMessage.userId ||
        null,
    })),
  } as Chat;
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

export const uploadFileToCloudinary = async (
  file: File,
  preset: UploadPreset
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", CLODUINARY_CONFIG[preset]);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${JSON.stringify(result)}`);
  }

  return result.secure_url as string;
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

export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordFormSchema>
) {
  const { email } = values;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
      verificationToken: {
        select: {
          code: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.$transaction(async () => {
    if (user.verificationToken) {
      await prisma.verificationToken.delete({
        where: { userId: user.id },
      });
    }

    await prisma.verificationToken.create({
      data: {
        userId: user.id,
        code: resetCode,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
      },
    });

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Reset your password",
      react: await PasswordResetEmailTemplate({ code: resetCode, email }),
    });

    if (error) {
      throw new Error("Failed to send password reset email");
    }
  });
}
