import { z } from "zod";
import COMMON_PASSWORDS from "./common-passwords";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

// Reusable Password Schema (used in multiple forms)
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

// Constant for password conditions (used in UI for password strength indicators)
export const PASSWORD_SCHEMA_CONDITIONS_COUNT = 7;

// --- Authentication Schemas ---

// Schema for user sign-up form
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
    email: z.string().email(),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Schema for verifying email with a code
export const VerifyEmailFormSchema = z.object({
  code: z.string(),
  email: z.string().email(),
});

// Schema for user sign-in form
export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Schema for requesting a password reset
export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

// Schema for verifying the password reset code
export const VerifyResetPasswordCodeFormSchema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .regex(/^\d{6}$/, { message: "Code must be a 6-digit number" }),
});

// Schema for resetting the password
export const ResetPasswordFormSchema = z
  .object({
    email: z.string().email().optional(),
    code: z
      .string()
      .regex(/^\d{6}$/, { message: "Code must be a 6-digit number" })
      .optional(),
    newPassword: PasswordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
  });

// --- Wallet Schemas ---

// Schema for creating a new wallet
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
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .transform(({ confirmPassword, ...rest }) => rest);

// Schema for importing an existing wallet using a mnemonic
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
        // Additional validation will happen in the component
        // This is just a basic check
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
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .transform(({ confirmPassword, ...rest }) => rest);

// Schema for verifying the mnemonic phrase
export const MneumonicsVerificationFormSchema = z.object({
  mnemonic: z.array(z.string()),
});

// --- Gig Schemas ---

// Reusable schema for gig features (used in CreateGigFormSchema)
const FeatureSchema = z.object({
  label: z
    .string()
    .min(1, "Feature label is required")
    .max(100, "Feature label must be at most 100 characters"),
});

// Reusable schema for gig packages (used in CreateGigFormSchema)
const PackageSchema = z.object({
  title: z
    .string()
    .min(3, "Package title is required")
    .max(50, "Package title must be at most 50 characters"),
  deliveryTime: z
    .number()
    .int()
    .positive("Delivery time must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
  revisions: z
    .number()
    .int()
    .min(0, "Revisions must be 0 or more")
    .max(100, "Revisions must be at most 100"),
  featureInclusions: z.array(z.boolean()),
});

// Schema for creating a new gig
export const CreateGigFormSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be at most 100 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description must be at most 5000 characters"),
    categoryId: z.string().uuid(),
    tags: z
      .array(z.object({ id: z.string().uuid() }))
      .min(1, "Please select at least one tag")
      .max(10, "Maximum 10 tags allowed"),
    features: z
      .array(FeatureSchema)
      .min(1, "Add at least one feature")
      .max(10, "Maximum 10 features allowed"),
    packages: z
      .array(PackageSchema)
      .min(1, "Add at least one package")
      .max(3, "Maximum 3 packages allowed"),
    images: z
      .array(z.object({ file: z.instanceof(File), isPrimary: z.boolean() }))
      .min(1, "Add at least one image")
      .max(8, "Maximum 8 images allowed"),
  })
  .refine(
    (data) => {
      const firstPackageInclusionsCount =
        data.packages[0].featureInclusions.length;
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === firstPackageInclusionsCount
      );
    },
    { message: "All packages must have the same number of feature inclusions" }
  )
  .refine(
    (data) => {
      for (
        let featureIndex = 0;
        featureIndex < data.features.length;
        featureIndex++
      ) {
        const isIncludedInAnyPackage = data.packages.some(
          (pkg) => pkg.featureInclusions[featureIndex] === true
        );
        if (!isIncludedInAnyPackage) return false;
      }
      return true;
    },
    {
      message: "Each feature must be included in at least one package",
      path: ["features"],
    }
  )
  .refine(
    (data) => {
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === data.features.length
      );
    },
    {
      message: "Number of feature inclusions must match number of features",
      path: ["packages"],
    }
  );

// Reusable schema for updating gig features
const UpdateFeatureSchema = z.object({
  id: z.string().uuid().optional(),
  tempId: z.string().optional(),
  label: z
    .string()
    .min(1, "Feature label is required")
    .max(100, "Feature label must be at most 100 characters"),
});

// Reusable schema for updating gig packages
const UpdatePackageSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .min(3, "Package title is required")
    .max(50, "Package title must be at most 50 characters"),
  deliveryTime: z
    .number()
    .int()
    .positive("Delivery time must be a positive number"),
  price: z.number().positive("Price must be a positive number"),
  revisions: z
    .number()
    .int()
    .min(0, "Revisions must be 0 or more")
    .max(100, "Revisions must be at most 100"),
  featureInclusions: z.array(z.boolean()),
});

// Schema for updating an existing gig
export const UpdateGigFormSchema = z
  .object({
    id: z.string().uuid(),
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be at most 100 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(5000, "Description must be at most 5000 characters"),
    categoryId: z.string().uuid(),
    tags: z
      .array(z.object({ id: z.string().uuid() }))
      .min(1, "Please select at least one tag")
      .max(10, "Maximum 10 tags allowed"),
    features: z
      .array(UpdateFeatureSchema)
      .min(1, "Add at least one feature")
      .max(10, "Maximum 10 features allowed"),
    packages: z
      .array(UpdatePackageSchema)
      .min(1, "Add at least one package")
      .max(3, "Maximum 3 packages allowed"),
    images: z
      .array(
        z.object({
          id: z.string().uuid().optional(),
          url: z.string().url("Must be a valid URL"),
        })
      )
      .min(1, "Add at least one image")
      .max(8, "Maximum 8 images allowed"),
  })
  .refine(
    (data) => {
      const firstPackageInclusionsCount =
        data.packages[0].featureInclusions.length;
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === firstPackageInclusionsCount
      );
    },
    { message: "All packages must have the same number of feature inclusions" }
  )
  .refine(
    (data) => {
      for (
        let featureIndex = 0;
        featureIndex < data.features.length;
        featureIndex++
      ) {
        const isIncludedInAnyPackage = data.packages.some(
          (pkg) => pkg.featureInclusions[featureIndex] === true
        );
        if (!isIncludedInAnyPackage) return false;
      }
      return true;
    },
    {
      message: "Each feature must be included in at least one package",
      path: ["features"],
    }
  )
  .refine(
    (data) => {
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === data.features.length
      );
    },
    {
      message: "Number of feature inclusions must match number of features",
      path: ["packages"],
    }
  );

// --- Profile and Communication Schemas ---

// Reusable schema for user skills
const SkillSchema = z.object({
  id: z.string().uuid().optional(),
  level: z.number().min(1).max(5, "Skill level must be between 1 and 5"),
  skillId: z.string().uuid(),
});

// Reusable schema for social links
const SocialLinkSchema = z.object({
  id: z.string().uuid().optional(),
  url: z.string().url("Must be a valid URL"),
  type: z.enum([
    "WEBSITE",
    "GITHUB",
    "LINKEDIN",
    "INSTAGRAM",
    "FACEBOOK",
    "TIKTOK",
    "YOUTUBE",
    "DISCORD",
    "TELEGRAM",
    "WHATSAPP",
    "EMAIL",
  ]),
});

// Reusable schema for portfolio items
const PortfolioItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long"),
  url: z.string().url("Must be a valid URL"),
  images: z.array(
    z.object({
      id: z.string().uuid().optional(),
      url: z.string().url("Must be a valid URL"),
      isPrimary: z.boolean(),
    })
  ),
});

// Schema for updating user profile
export const UpdateProfileFormSchema = z.object({
  username: z.string(),
  avatar: z.string(),
  banner: z.string(),
  headline: z.string(),
  bio: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  skills: z.array(SkillSchema),
  socialLinks: z.array(SocialLinkSchema),
  portfolioItems: z.array(PortfolioItemSchema),
  featuredBadge: z.string().uuid(),
});

// Schema for contacting a seller
export const ContactSellerFormSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipientId: z.string().min(1, "Recipient ID is required"),
});

// Schema for sending a message (ensures at least text or attachments are provided)
export const SendMessageFormSchema = z
  .object({
    attachments: z.instanceof(File).array().optional(),
    text: z.string().optional(),
  })
  .refine(
    (data) => data.text || (data.attachments && data.attachments.length > 0),
    {
      message: "Message must have either text or attachments",
    }
  );

// --- KYC Schema ---

// Schema for KYC verification
export const KycFormSchema = z.object({
  id: z.instanceof(File),
  selfie: z.instanceof(File),
});
