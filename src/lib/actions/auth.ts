"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { cookies, headers } from "next/headers";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { KycFormSchema, VerifyEmailFormSchema } from "../schemas";
import { Resend } from "resend";
import { JWTToken } from "../types";
import VerificationEmailTemplate from "@/components/email-templates/verification-email";
import WelcomeEmailTemplate from "@/components/email-templates/welcome-email";
import PasswordResetEmailTemplate from "@/components/email-templates/password-reset-email";
import { auth } from "../auth";
import { User } from "next-auth";
import PasswordChangedEmailTemplate from "@/components/email-templates/password-changed-email";

const resend = new Resend(process.env.RESEND_API_KEY!);

const DEFAULT_FROM_EMAIL = "Acme <onboarding@resend.dev>";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function me() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { user: null, error: null };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTToken;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        //emailVerified: new Date()
        avatar: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isKycVerified: true,
        isProfileVerified: true,
        _count: {
          select: {
            notifications: {
              where: { isRead: false },
            },
          },
        },
      },
    });

    return { user, error: null };
  } catch (error) {
    // Check if it's a token expiration error
    if (error instanceof jwt.TokenExpiredError) {
      // Clear the expired token
      const cookieStore = await cookies();
      cookieStore.delete("token");

      return { user: null, error: "TOKEN_EXPIRED" as const };
    }

    // Other JWT errors (invalid signature, malformed token, etc.)
    return { user: null, error: "INVALID_TOKEN" as const };
  }
}

export async function signUp({
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
}) {
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
      throw new Error(
        existingUser.emailVerified
          ? "This email is already registered"
          : "This email is registered but not verified. Please check your inbox."
      );
    }
    if (existingUser.username === username) {
      throw new Error("This username is already taken");
    }
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const hashedPassword = await argon2.hash(password);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        country,
      },
    });

    await tx.verificationToken.create({
      data: {
        identifier: email,
        token: verificationCode,
        expires: new Date(Date.now() + TOKEN_EXPIRY),
      },
    });

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Verify your email address",
      react: await VerificationEmailTemplate({
        code: verificationCode,
        firstName: firstName,
      }),
    });

    if (error) {
      throw new Error(
        "We couldn't send a verification email at this time. Please try again later"
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
      identifier: email,
      token: code,
    },
  });

  if (!token) {
    throw new Error("Invalid verification code");
  }

  if (token.expires < new Date()) {
    throw new Error("Verification code has expired");
  }

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: email, token: code } },
    }),
  ]);

  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Welcome to Blue Frog!",
      react: await WelcomeEmailTemplate({
        username: user!.username,
        firstName: user!.firstName,
      }),
    })
    .catch(console.error);
}

export async function forgotPassword(values: { email: string }) {
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
    return; // Silent success
  }

  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: resetCode,
      expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    },
  });

  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Reset your password",
      react: await PasswordResetEmailTemplate({
        code: resetCode,
        email,
        firstName: user.firstName,
      }),
    })
    .catch((error) => {
      console.error("Failed to send password reset email:", error);
    });
}

export async function resetPassword({
  newPassword,
  email,
  code,
}: {
  newPassword: string;
  email?: string; // From URL search params for unauthenticated users
  code?: string; // From URL search params for unauthenticated users
}) {
  const session = await auth();

  if (session) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: await argon2.hash(newPassword),
      },
    });
    return; // No need to handle verification token for authenticated users
  } else {
    if (!email || !code) {
      throw new Error("Authentication required or missing reset credentials");
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
      throw new Error("Invalid or expired reset code");
    }

    // Update password and clean up verification token
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: {
          password: await argon2.hash(newPassword),
        },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token: code } },
      }),
    ]);
  }

  //send email confirmation
  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email!],
      subject: "Your password has been reset",
      react: await PasswordChangedEmailTemplate({
        email: email!,
        firstName: email,
        changeTime: new Date().toLocaleString(),
        ipAddress: (await headers()).get("x-forwarded-for") || "Unknown",
        device: (await headers()).get("user-agent") || "Unknown",
      }),
    })
    .catch((error) => {
      console.error("Failed to send password changed email:", error);
    });
}

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new Error("No account found with this email address");
  }

  if (user.emailVerified) {
    throw new Error("This email is already verified");
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token: verificationCode } },
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

  const { error } = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: [email],
    subject: "Verify your email address - New code",
    react: await VerificationEmailTemplate({
      code: verificationCode,
      firstName: user.firstName,
    }),
  });

  if (error) {
    throw new Error("Failed to send verification email");
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const verifyKyc = async (values: z.infer<typeof KycFormSchema>) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }

  await new Promise((resolve) => setTimeout(resolve, 15000));

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isKycVerified: true,
    },
  });
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
    },
  });

  try {
    if (!user) {
      throw new Error("No user found");
    }

    if (!user.emailVerified) {
      throw new Error("Please verify your email before signing in");
    }

    const valid = await argon2.verify(user.password, password);

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
  };
};
