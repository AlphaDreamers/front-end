import { z } from "zod";
import COMMON_PASSWORDS from "./data/common-passwords";
import { COUNTRIES } from "./data/countries";
// src/lib/schemas/profile.ts
import { MediaItemSchema } from "@/lib/types/forms";
import { SocialLinkType } from "@prisma/client";

// Avatar/Banner schema for single image fields
const ImageFieldSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("existing"),
    url: z.string(),
  }),
  z.object({
    type: z.literal("new"),
    file: z.instanceof(File),
    tempId: z.string(),
  }),
]);

// Portfolio item schema
const PortfolioItemSchema = z.object({
  id: z.string().optional(),
  tempId: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  url: z.string().url().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  media: z.array(MediaItemSchema).max(10, "Maximum 10 media files allowed"),
});

// Skill schema
const SkillSchema = z.object({
  id: z.string().optional(),
  skillId: z.string(),
  label: z.string(),
  level: z.number().min(1).max(5),
});

// Social link schema
const SocialLinkSchema = z.object({
  id: z.string().optional(),
  type: z.nativeEnum(SocialLinkType),
  url: z.string().url("Invalid URL"),
});

// Main profile form schema
export const UpdateProfileFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be at most 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be at most 50 characters"),
  headline: z
    .string()
    .max(100, "Headline must be at most 100 characters")
    .optional(),
  bio: z.string().max(1000, "Bio must be at most 1000 characters").optional(),

  avatar: ImageFieldSchema.nullable(),
  banner: ImageFieldSchema.nullable(),

  skills: z.array(SkillSchema),
  socialLinks: z.array(SocialLinkSchema),

  portfolioItems: z
    .array(PortfolioItemSchema)
    .max(15, "Maximum 15 portfolio items allowed")
    .refine(
      (items) => {
        const featuredCount = items.filter((item) => item.isFeatured).length;
        return featuredCount <= 5;
      },
      {
        message: "Maximum 5 items can be marked as featured",
      }
    ),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileFormSchema>;
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
export type ImageField = z.infer<typeof ImageFieldSchema>;

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be at most 32 characters")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  )
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .refine((val) => COMMON_PASSWORDS.every((password) => password !== val), {
    message: "Password is too common, please choose a different one",
  });

export const PASSWORD_SCHEMA_CONDITIONS_COUNT = 7;

export const SignUpFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be at most 50 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: PasswordSchema,
    confirmPassword: z.string(),
    country: z.enum(
      COUNTRIES.map((country) => country.value) as [string, ...string[]],
      {
        message: "Please select a valid country",
      }
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const VerifyEmailFormSchema = z.object({
  code: z.string(),
  email: z.string().email(),
});

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordFormSchema = z
  .object({
    previousPassword: z.string().optional(),
    newPassword: PasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
  });

export const CreateNewWalletFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Wallet name is required")
      .max(50, "Wallet name must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9\s-_]+$/,
        "Wallet name can only contain letters, numbers, spaces, hyphens, and underscores"
      ),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ImportWalletFormSchema = z
  .object({
    mnemonic: z
      .string()
      .trim()
      .min(1, "Recovery phrase is required")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.length >= 12 && words.length <= 24;
      }, "Recovery phrase must be between 12 and 24 words")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.every((word) => word.length > 0);
      }, "Invalid recovery phrase format"),
    name: z
      .string()
      .min(1, "Wallet name is required")
      .max(50, "Wallet name must be less than 50 characters")
      .regex(
        /^[a-zA-Z0-9\s-_]+$/,
        "Wallet name can only contain letters, numbers, spaces, hyphens, and underscores"
      ),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const MneumonicsVerificationFormSchema = z.object({
  mnemonic: z.array(z.string()),
});

export const KycFormSchema = z.object({
  id: z.instanceof(File),
  selfie: z.instanceof(File),
});
