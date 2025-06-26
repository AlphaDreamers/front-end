"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { VerifyEmailFormSchema } from "../schemas";
import { auth } from "../auth";
import { sendEmail } from "./email";
import bcrypt from "bcryptjs";
import { User } from "next-auth";
import { headers } from "next/headers";

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const signUp = async ({
  username,
  country,
  email,
  password,
  firstName,
  lastName,
}: {
  username: string;
  country: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<ActionResult<{ email: string }>> => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      select: {
        email: true,
        username: true,
        emailVerified: true,
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          error: existingUser.emailVerified
            ? "This email address is already registered. Please sign in instead."
            : "This email is registered but not verified. Please check your inbox for the verification code.",
        };
      }
      if (existingUser.username === username) {
        return {
          success: false,
          error:
            "This username is already taken. Please choose a different one.",
        };
      }
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          username,
          email,
          firstName,
          lastName,
          password: hashedPassword,
          country,
          preferences: {
            create: {}, // Create default preferences
          },
        },
      });

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: verificationCode,
          expires: new Date(Date.now() + TOKEN_EXPIRY),
        },
      });

      await sendEmail(email, "verify", {
        code: verificationCode,
        firstName: firstName,
        email: email,
      });
    });

    return {
      success: true,
      data: { email },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: "Failed to create account. Please try again later.",
    };
  }
};

export const verifyEmail = async (
  values: z.infer<typeof VerifyEmailFormSchema>
): Promise<ActionResult<void>> => {
  try {
    const { code, email } = values;

    const token = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
      },
    });

    if (!token) {
      return {
        success: false,
        error: "Invalid verification code. Please check and try again.",
      };
    }

    if (token.expires < new Date()) {
      return {
        success: false,
        error: "Verification code has expired. Please request a new one.",
      };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: code } },
      }),
    ]);

    await sendEmail(email, "welcome", {});

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      success: false,
      error: "Failed to verify email. Please try again.",
    };
  }
};

export const forgotPassword = async (values: {
  email: string;
}): Promise<ActionResult<void>> => {
  try {
    const { email } = values;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        emailVerified: true,
        email: true,
      },
    });

    // Always appear successful to prevent email enumeration
    if (!user) {
      return { success: true, data: undefined };
    }

    if (!user.emailVerified) {
      return {
        success: false,
        error:
          "Please verify your email address before resetting your password.",
      };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.$transaction(async (tx) => {
      await tx.verificationToken.deleteMany({
        where: { identifier: email },
      });

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: resetCode,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });
    });

    await sendEmail(email, "passwordReset", {
      code: resetCode,
      email: user.email,
      firstName: user.firstName,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "Failed to process password reset request. Please try again.",
    };
  }
};

export const resetPassword = async ({
  newPassword,
  email,
  code,
  previousPassword,
}: {
  newPassword: string;
  previousPassword?: string;
  email?: string;
  code?: string;
}): Promise<ActionResult<void>> => {
  try {
    const session = await auth();

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          password: true,
        },
      });

      if (!user) {
        return {
          success: false,
          error: "User account not found.",
        };
      }

      if (previousPassword) {
        const valid = await bcrypt.compare(previousPassword, user.password);
        if (!valid) {
          return {
            success: false,
            error: "Current password is incorrect.",
          };
        }
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          password: await bcrypt.hash(newPassword, 10),
        },
      });

      return { success: true, data: undefined };
    } else {
      if (!email || !code) {
        return {
          success: false,
          error: "Missing required information for password reset.",
        };
      }

      // Verify the reset code
      const token = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          token: code,
          expires: { gt: new Date() },
        },
      });

      if (!token) {
        return {
          success: false,
          error: "Invalid or expired reset code. Please request a new one.",
        };
      }

      // Update password and clean up verification token
      await prisma.$transaction([
        prisma.user.update({
          where: { email },
          data: {
            password: await bcrypt.hash(newPassword, 10),
          },
        }),
        prisma.verificationToken.delete({
          where: { identifier_token: { identifier: email, token: code } },
        }),
      ]);

      await sendEmail(email!, "passwordChanged", {
        email: email!,
      });

      return { success: true, data: undefined };
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "Failed to reset password. Please try again.",
    };
  }
};

export const resendVerificationEmail = async (
  email: string
): Promise<ActionResult<void>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email address.",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "This email address has already been verified.",
      };
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await prisma.verificationToken.upsert({
      where: {
        identifier_token: { identifier: email, token: verificationCode },
      },
      update: {
        token: verificationCode,
        expires: new Date(Date.now() + TOKEN_EXPIRY),
      },
      create: {
        identifier: email,
        token: verificationCode,
        expires: new Date(Date.now() + TOKEN_EXPIRY),
      },
    });

    await sendEmail(email, "verify", {
      email: email,
      code: verificationCode,
      firstName: user.firstName,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Resend verification error:", error);
    return {
      success: false,
      error: "Failed to resend verification email. Please try again.",
    };
  }
};

export const verifyKyc = async (): Promise<ActionResult<void>> => {
  try {
    const session = await auth();

    if (!session) {
      return {
        success: false,
        error: "You must be logged in to complete KYC verification.",
      };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isKycVerified: true,
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("KYC verification error:", error);
    return {
      success: false,
      error: "Failed to complete KYC verification. Please try again.",
    };
  }
};

export const validateCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      _count: {
        select: {
          notifications: {
            where: { isRead: false },
          },
        },
      },
      emailVerified: true,
      password: true,
      avatar: true,
      isProfileVerified: true,
    },
  });

  try {
    if (!user) {
      throw new Error("No account found with this email address");
    }

    if (!user.emailVerified) {
      throw new Error("Please verify your email before signing in");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Incorrect password");
    }
  } catch (error) {
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || "unknown";

    await prisma.failedLoginAttempt.create({
      data: {
        email: email,
        ipAddress: ipAddress,
        reason: error instanceof Error ? error.message : "Unknown error",
      },
    });

    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    unreadNotifications: user._count.notifications,
    avatar: user.avatar ?? undefined,
    isVerified: user.isProfileVerified,
    name: `${user.firstName} ${user.lastName}`,
    image: user.avatar ?? undefined,
  };
};
