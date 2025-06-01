"use server";

import { z } from "zod";
import { prisma } from "../prisma";
import { cookies } from "next/headers";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignUpFormSchema,
  VerifyEmailFormSchema,
  VerifyResetPasswordCodeFormSchema,
} from "../schemas";
import { Resend } from "resend";
import { JWTToken } from "../types";
import VerificationEmailTemplate from "@/components/email-templates/verification-email";
import WelcomeEmailTemplate from "@/components/email-templates/welcome-email";
import PasswordResetEmailTemplate from "@/components/email-templates/password-reset-email";

const resend = new Resend(process.env.RESEND_API_KEY!);

const DEFAULT_FROM_EMAIL = "Acme <onboarding@resend.dev>";
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

export async function signUp(values: z.infer<typeof SignUpFormSchema>) {
  const { username, email, password, firstName, lastName } = values;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      email: true,
      username: true,
      isVerified: true,
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error(
        existingUser.isVerified
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

  // Transaction ensures atomicity - if email fails, user isn't created
  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
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
      react: await VerificationEmailTemplate({
        code: verificationCode,
        firstName: firstName,
      }),
    });

    if (error) {
      // Transaction will rollback, user won't be created
      throw new Error("Failed to send verification email. Please try again.");
    }
  });
}

export async function signIn(values: z.infer<typeof SignInFormSchema>) {
  const { email, password } = values;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      isVerified: true,
    },
  });

  // Generic error for security - don't reveal if email exists
  if (!user || !(await argon2.verify(user.password, password))) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email before signing in");
  }

  // Create JWT token
  const token = jwt.sign(
    { id: user.id } as JWTToken,
    process.env.JWT_SECRET!,
    { expiresIn: "7d" } // Extended from 1d for better UX
  );

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax", // Simplified - let production config handle this elsewhere
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
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
      expiresAt: { gt: new Date() }, // Check expiry in the query
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          firstName: true,
        },
      },
    },
  });

  if (!token) {
    throw new Error("Invalid or expired verification code");
  }

  // Clean transaction - update user and delete token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: token.user.id },
      data: { isVerified: true },
    }),
    prisma.verificationToken.delete({
      where: { id: token.id },
    }),
  ]);

  // Send welcome email - don't fail the verification if this fails
  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Welcome to Blue Frog!",
      react: await WelcomeEmailTemplate({
        username: token.user.username,
        firstName: token.user.firstName,
      }),
    })
    .catch(console.error); // Log but don't throw
}

export async function forgotPassword(
  values: z.infer<typeof ForgotPasswordFormSchema>
) {
  const { email } = values;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      isVerified: true,
    },
  });

  // Always appear successful to prevent email enumeration
  if (!user) {
    return; // Silent success
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email first");
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any existing token and create new one
  await prisma.verificationToken.upsert({
    where: { userId: user.id },
    update: {
      code: resetCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
    create: {
      userId: user.id,
      code: resetCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
  });

  // Send email asynchronously - don't block the response
  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Reset your password",
      react: await PasswordResetEmailTemplate({ code: resetCode, email }),
    })
    .catch(console.error);
}

export async function verifyPasswordResetCode(
  values: z.infer<typeof VerifyResetPasswordCodeFormSchema>
) {
  const { code, email } = values;

  const exists = await prisma.verificationToken.findFirst({
    where: {
      code,
      user: { email },
      expiresAt: { gt: new Date() },
    },
  });

  if (!exists) {
    throw new Error("Invalid or expired code");
  }
}

export async function resetPassword(
  values: z.infer<typeof ResetPasswordFormSchema>
) {
  const { email, code, newPassword } = values;

  // For authenticated users changing their password
  const currentUser = await me();
  if (currentUser) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        password: await argon2.hash(newPassword),
      },
    });
    return;
  }

  // For anonymous password reset
  if (!email || !code) {
    throw new Error("Missing reset credentials");
  }

  const token = await prisma.verificationToken.findFirst({
    where: {
      code,
      user: { email },
      expiresAt: { gt: new Date() },
    },
    include: {
      user: { select: { id: true } },
    },
  });

  if (!token) {
    throw new Error("Invalid or expired reset code");
  }

  // Update password and clean up token atomically
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

// src/lib/actions.ts - Resend actions

export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      isVerified: true,
    },
  });

  // Let the natural "not found" error bubble if user doesn't exist
  if (!user) {
    throw new Error("No account found with this email address");
  }

  if (user.isVerified) {
    throw new Error("This email is already verified");
  }

  // Check for existing token to prevent spam
  const existingToken = await prisma.verificationToken.findUnique({
    where: { userId: user.id },
    select: {
      createdAt: true,
      expiresAt: true,
    },
  });

  // Rate limiting - prevent resending too frequently
  if (existingToken) {
    const timeSinceCreation = Date.now() - existingToken.createdAt.getTime();
    const minResendInterval = 60 * 1000; // 1 minute

    if (timeSinceCreation < minResendInterval) {
      const waitTime = Math.ceil(
        (minResendInterval - timeSinceCreation) / 1000
      );
      throw new Error(
        `Please wait ${waitTime} seconds before requesting a new code`
      );
    }
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  // Upsert to handle both create and update cases
  await prisma.verificationToken.upsert({
    where: { userId: user.id },
    update: {
      code: verificationCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
    create: {
      userId: user.id,
      code: verificationCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
  });

  // Send email
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

export async function resendPasswordResetCode(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      isVerified: true,
    },
  });

  // Silent return for security - don't reveal if email exists
  if (!user) {
    return;
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email address first");
  }

  // Rate limiting check
  const existingToken = await prisma.verificationToken.findUnique({
    where: { userId: user.id },
    select: {
      createdAt: true,
    },
  });

  if (existingToken) {
    const timeSinceCreation = Date.now() - existingToken.createdAt.getTime();
    const minResendInterval = 2 * 60 * 1000; // 2 minutes for password reset

    if (timeSinceCreation < minResendInterval) {
      const waitTime = Math.ceil(
        (minResendInterval - timeSinceCreation) / 1000
      );
      throw new Error(
        `Please wait ${waitTime} seconds before requesting a new code`
      );
    }
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verificationToken.upsert({
    where: { userId: user.id },
    update: {
      code: resetCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
    create: {
      userId: user.id,
      code: resetCode,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY),
    },
  });

  // Fire and forget email - don't block the response
  resend.emails
    .send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: "Password reset code - New request",
      react: await PasswordResetEmailTemplate({
        code: resetCode,
        email,
        firstName: user.firstName,
      }),
    })
    .catch((error) => {
      // Log but don't throw - user experience shouldn't break if email fails
      console.error("Failed to send password reset email:", error);
    });
}
