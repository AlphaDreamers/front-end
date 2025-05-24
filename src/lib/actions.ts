"use server";

import { z } from "zod";

import { Resend } from "resend";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  ContactSellerFormSchema,
  CreateGigFormSchema,
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
  UpdateGigFormSchema,
  UpdateProfileFormSchema,
  VerifyEmailFormSchema,
} from "@/lib/schemas";
import VerificationEmailTemplate from "@/components/email-templates/verification-email";
import WelcomeEmailTemplate from "@/components/email-templates/welcome-email";
import PasswordResetEmailTemplate from "@/components/email-templates/password-reset-email";

// Email templates

// Initialize Resend email client
const resend = new Resend(process.env.RESEND_API_KEY!);

// Default email configuration
const DEFAULT_FROM_EMAIL = "Acme <onboarding@resend.dev>";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * User registration function
 * Creates a user account and sends verification email
 */
export async function signUp(values: z.infer<typeof SignUpFormSchema>) {
  const { username, email, password, firstName, lastName } = values;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();

  try {
    // Create user with verification token
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

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    throw new Error("Failed to create account. Please try again later.");
  }
}

/**
 * Email verification function
 * Verifies user's email using the provided code
 */
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

  try {
    // Update user as verified
    await prisma.user.update({
      where: { id: token.user.id },
      data: { isVerified: true },
    });

    // Delete the used verification token
    await prisma.verificationToken.delete({
      where: { id: token.id },
    });

    // Send welcome email
    await sendWelcomeEmail(email, token.user.username);

    return { success: true };
  } catch (error) {
    console.error("Email verification error:", error);
    throw new Error("Failed to verify email. Please try again later.");
  }
}

/**
 * Resend verification email
 * Generates new verification code and sends it to user
 */
export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      verificationToken: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  try {
    // Generate new verification code
    const verificationCode = generateVerificationCode();

    // Update or create verification token
    if (user.verificationToken) {
      await prisma.verificationToken.update({
        where: { userId: user.id },
        data: {
          code: verificationCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    } else {
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          code: verificationCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    }

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return { success: true };
  } catch (error) {
    console.error("Resend verification email error:", error);
    throw new Error(
      "Failed to send verification email. Please try again later."
    );
  }
}

/**
 * User sign in function
 * Authenticates user and sets JWT cookie
 */
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

  try {
    // Create authentication token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60, // 1 day in seconds
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    throw new Error("Authentication failed. Please try again later.");
  }
}

/**
 * Forgot password function
 * Sends password reset email with verification code
 */
export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordFormSchema>
) {
  const { email } = values;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      verificationToken: true,
    },
  });

  if (!user) {
    // Don't reveal if user exists for security
    return { success: true };
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  try {
    // Generate reset code
    const resetCode = generateVerificationCode();

    // Update or create verification token
    if (user.verificationToken) {
      await prisma.verificationToken.update({
        where: { userId: user.id },
        data: {
          code: resetCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    } else {
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          code: resetCode,
          expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });
    }

    // Send password reset email
    await sendPasswordResetEmail(email, resetCode);

    return { success: true };
  } catch (error) {
    console.error("Forgot password error:", error);
    throw new Error(
      "Failed to process password reset. Please try again later."
    );
  }
}

/**
 * Verify password reset code and set auth token
 */
export async function verifyPasswordResetCode(email: string, code: string) {
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
    throw new Error("Invalid reset code");
  }

  if (token.expiresAt < new Date()) {
    throw new Error("Reset code has expired");
  }

  try {
    // Create special reset token
    const resetToken = jwt.sign(
      { id: token.user.id, purpose: "password-reset" },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" } // Short expiry for security
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("reset_token", resetToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Verify reset code error:", error);
    throw new Error("Failed to verify reset code. Please try again later.");
  }
}

/**
 * Reset password function
 * Updates user password after verification
 */
export async function resetPassword(
  values: z.infer<typeof ResetPasswordFormSchema>
) {
  const { password } = values;

  const cookieStore = await cookies();
  const resetToken = cookieStore.get("reset_token")?.value;

  if (!resetToken) {
    throw new Error("Reset session expired");
  }

  try {
    // Verify token is valid and for password reset
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET!) as {
      id: string;
      purpose?: string;
    };

    if (decoded.purpose !== "password-reset") {
      throw new Error("Invalid reset session");
    }

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        password: await argon2.hash(password),
      },
    });

    // Clear reset token cookie
    cookieStore.set("reset_token", "", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: -1,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error("Failed to reset password. Please try again later.");
  }
}

/**
 * Sign out function
 * Clears authentication cookie
 */
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: -1,
    path: "/",
  });

  return { success: true };
}

/**
 * Current user function
 * Returns the currently authenticated user or null
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });

    return user;
  } catch {
    // Token invalid or expired
    return null;
  }
}

// Helper functions

/**
 * Generates a random 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends verification email
 */
async function sendVerificationEmail(email: string, code: string) {
  const { error } = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: [email],
    subject: "Verify your email address",
    react: await VerificationEmailTemplate({ code }),
  });

  if (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Sends welcome email after successful verification
 */
async function sendWelcomeEmail(email: string, username: string) {
  const { error } = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: [email],
    subject: "Welcome to our platform!",
    react: await WelcomeEmailTemplate({ username }),
  });

  if (error) {
    console.error("Welcome email error:", error);
    // Don't throw error as this is not critical
  }
}

/**
 * Sends password reset email
 */
async function sendPasswordResetEmail(email: string, code: string) {
  const { error } = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: [email],
    subject: "Reset your password",
    react: await PasswordResetEmailTemplate({ code }),
  });

  if (error) {
    console.error("Password reset email error:", error);
    throw new Error("Failed to send password reset email");
  }
}
export const createGig = async (
  values: z.infer<typeof CreateGigFormSchema>
) => {
  try {
    // Authenticate the user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { title, description, categoryId, tags, packages, images, features } =
      values;

    // Create the gig with all related data in a transaction
    const gig = await prisma.$transaction(async (tx) => {
      // 1. Create the base gig first
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
            create: images.map((image) => ({
              url:
                "https://picsum.photos/200/300/" +
                Math.floor(Math.random() * 1000),
              isPrimary: image.isPrimary,
            })),
          },
        },
      });

      // 2. Create all gig features
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

      // 3. Create packages with their feature connections
      await Promise.all(
        packages.map(async (pkg) => {
          // Create the package
          const newPackage = await tx.package.create({
            data: {
              title: pkg.title,
              deliveryTime: pkg.deliveryTime,
              revisions: pkg.revisions,
              price: pkg.price,
              gigId: newGig.id,
            },
          });

          // Create package features with connections to gig features
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

      // Return the completed gig with relationships
      return await tx.gig.findUnique({
        where: { id: newGig.id },
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
        },
      });
    });

    return { success: true, data: gig };
  } catch (error) {
    console.error("Error creating gig:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create gig",
    };
  }
};

export const updateGig = async (
  values: z.infer<typeof UpdateGigFormSchema>
) => {
  try {
    // Authenticate the user
    const user = await getCurrentUser();
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
  try {
    // Authenticate the user
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify the gig exists and belongs to the current user
    const existingGig = await prisma.gig.findUnique({
      where: { id: gigId },
      include: {
        packages: true,
        features: true,
        images: true,
      },
    });

    if (!existingGig) {
      throw new Error("Gig not found");
    }

    if (existingGig.sellerId !== user.id) {
      throw new Error("You do not have permission to delete this gig");
    }

    // Delete everything in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Delete all package features
      await tx.packageFeature.deleteMany({
        where: {
          gigPackageId: { in: existingGig.packages.map((pkg) => pkg.id) },
        },
      });

      // 2. Delete all packages
      await tx.package.deleteMany({
        where: { gigId: gigId },
      });

      // 3. Delete all images
      await tx.image.deleteMany({
        where: { gigId: gigId },
      });

      // 4. Delete all gig features
      await tx.gigFeature.deleteMany({
        where: { gigId: gigId },
      });

      // 5. Finally, delete the gig itself
      await tx.gig.delete({
        where: { id: gigId },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting gig:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete gig",
    };
  }
};

export const getCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      label: true,
    },
  });
};

export const getTags = async () => {
  return await prisma.tag.findMany({
    select: {
      id: true,
      label: true,
    },
  });
};

export const contactSeller = async (
  values: z.infer<typeof ContactSellerFormSchema>
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { message, recipientId } = values;

  try {
    await prisma.notification.create({
      data: {
        title: "New message from buyer",
        description: message,
        type: "CONTACT",
        senderId: user.id,
        recipientId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
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
  const user = await getCurrentUser();
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
