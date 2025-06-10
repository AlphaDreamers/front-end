import { z } from "zod";
import COMMON_PASSWORDS from "./data/common-passwords";
import { COUNTRIES } from "./data/countries";

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
    email: z.string().email("Please enter a valid email address"),
    password: PasswordSchema,
    confirmPassword: z.string(),
    country: z.enum(
      COUNTRIES.map((country) => country.code) as [string, ...string[]],
      {
        message: "Please select a valid country",
      }
    ),
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
  });

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
// Schema for creating a new gig
export const CreateGigFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-.,!?'"]+$/,
      "Title can only contain letters, numbers, spaces, and basic punctuation"
    ),

  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be at most 5000 characters"),

  categoryId: z.string().min(1, "Please select a category"),

  tags: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    )
    .min(1, "Select at least one tag")
    .max(5, "Maximum 5 tags allowed"),

  features: z
    .array(
      z.object({
        label: z
          .string()
          .min(2, "Feature must be at least 2 characters")
          .max(50, "Feature must be at most 50 characters"),
      })
    )
    .min(1, "Add at least one feature")
    .max(10, "Maximum 10 features allowed"),

  packages: z
    .array(
      z.object({
        title: z
          .string()
          .min(2, "Package name must be at least 2 characters")
          .max(30, "Package name must be at most 30 characters"),
        deliveryTime: z
          .number()
          .int("Delivery time must be a whole number")
          .min(1, "Delivery time must be at least 1 day")
          .max(90, "Delivery time must be at most 90 days"),
        price: z
          .number()
          .min(5, "Price must be at least $5")
          .max(10000, "Price must be at most $10,000"),
        revisions: z
          .number()
          .int("Revisions must be a whole number")
          .min(-1, "Use -1 for unlimited revisions")
          .max(100, "Maximum 100 revisions"),
        featureInclusions: z.array(z.boolean()),
      })
    )
    .min(1, "Add at least one package")
    .max(3, "Maximum 3 packages allowed")
    .refine(
      (packages) => {
        // Ensure packages have ascending prices
        const prices = packages.map((p) => p.price);
        return prices.every((price, i) => i === 0 || price > prices[i - 1]);
      },
      { message: "Package prices must increase from left to right" }
    ),

  images: z
    .array(
      z.object({
        file: z.instanceof(File),
        isPrimary: z.boolean(),
      })
    )
    .min(1, "Upload at least one image")
    .max(8, "Maximum 8 images allowed")
    .refine((images) => images.some((img) => img.isPrimary), {
      message: "Please select a primary image",
    })
    .refine(
      (images) => {
        return images.every((img) => {
          const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return validTypes.includes(img.file.type);
        });
      },
      { message: "Only JPEG, PNG, and WebP images are allowed" }
    )
    .refine(
      (images) => {
        return images.every((img) => img.file.size <= 5 * 1024 * 1024);
      },
      { message: "Each image must be less than 5MB" }
    ),
});

// Reusable schema for updating gig features
// Add this to your existing schemas.ts file

// Enhanced schema for editing gigs that handles both existing and new data
export const EditGigFormSchema = z
  .object({
    // The gig ID is required for editing
    id: z.string().uuid("Invalid gig ID"),

    // Basic gig information
    title: z
      .string()
      .min(10, "Title must be at least 10 characters")
      .max(80, "Title must be at most 80 characters")
      .regex(
        /^[a-zA-Z0-9\s\-.,!?'"]+$/,
        "Title can only contain letters, numbers, spaces, and basic punctuation"
      ),

    description: z
      .string()
      .min(50, "Description must be at least 50 characters")
      .max(5000, "Description must be at most 5000 characters"),

    categoryId: z.string().uuid("Please select a valid category"),

    // Tags - for editing, we only need the IDs since tags are selected from existing ones
    tags: z
      .array(z.string().uuid("Invalid tag ID"))
      .min(1, "Select at least one tag")
      .max(5, "Maximum 5 tags allowed"),

    // Features can be existing (with ID) or new (with tempId for tracking)
    features: z
      .array(
        z.object({
          id: z.string().uuid().optional(), // Existing features have database IDs
          tempId: z.string().optional(), // New features get temporary IDs for tracking
          label: z
            .string()
            .min(2, "Feature must be at least 2 characters")
            .max(50, "Feature must be at most 50 characters"),
        })
      )
      .min(1, "Add at least one feature")
      .max(10, "Maximum 10 features allowed"),

    // Packages can also be existing or new
    packages: z
      .array(
        z.object({
          id: z.string().uuid().optional(), // Existing packages have database IDs
          tempId: z.string().optional(), // New packages get temporary IDs
          title: z
            .string()
            .min(2, "Package name must be at least 2 characters")
            .max(30, "Package name must be at most 30 characters"),
          deliveryTime: z
            .number()
            .int("Delivery time must be a whole number")
            .min(1, "Delivery time must be at least 1 day")
            .max(90, "Delivery time must be at most 90 days"),
          price: z
            .number()
            .min(5, "Price must be at least $5")
            .max(10000, "Price must be at most $10,000"),
          revisions: z
            .number()
            .int("Revisions must be a whole number")
            .min(-1, "Use -1 for unlimited revisions")
            .max(100, "Maximum 100 revisions"),
          featureInclusions: z.array(z.boolean()),
        })
      )
      .min(1, "Add at least one package")
      .max(3, "Maximum 3 packages allowed")
      .refine(
        (packages) => {
          // Ensure packages have ascending prices
          const prices = packages.map((p) => p.price);
          return prices.every((price, i) => i === 0 || price > prices[i - 1]);
        },
        { message: "Package prices must increase from left to right" }
      ),

    // Images can be existing (URL only) or new (File object)
    images: z
      .array(
        z.discriminatedUnion("type", [
          // Existing images from the database
          z.object({
            type: z.literal("existing"),
            id: z.string().uuid(),
            url: z.string().url("Must be a valid URL"),
            isPrimary: z.boolean(),
          }),
          // New images being uploaded
          z.object({
            type: z.literal("new"),
            file: z.instanceof(File),
            isPrimary: z.boolean(),
            tempId: z.string(), // For tracking in the UI
          }),
        ])
      )
      .min(1, "Upload at least one image")
      .max(8, "Maximum 8 images allowed")
      .refine((images) => images.some((img) => img.isPrimary), {
        message: "Please select a primary image",
      })
      .refine(
        (images) => {
          // Validate file types for new images
          return images.every((img) => {
            if (img.type === "new") {
              const validTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
              ];
              return validTypes.includes(img.file.type);
            }
            return true; // Existing images are already validated
          });
        },
        { message: "Only JPEG, PNG, and WebP images are allowed" }
      )
      .refine(
        (images) => {
          // Validate file sizes for new images
          return images.every((img) => {
            if (img.type === "new") {
              return img.file.size <= 5 * 1024 * 1024; // 5MB limit
            }
            return true; // Existing images don't need size validation
          });
        },
        { message: "Each image must be less than 5MB" }
      ),
  })
  .refine(
    (data) => {
      // Ensure all packages have the same number of feature inclusions as features
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === data.features.length
      );
    },
    {
      message: "Package features must match the number of gig features",
      path: ["packages"],
    }
  );

// --- Profile and Communication Schemas ---

// Reusable schema for user skills

// Schema for updating user profile
import { SocialLinkType } from "@prisma/client";

// Enhanced schema for updating profile that handles both existing and new items
export const UpdateProfileFormSchema = z.object({
  // Basic information
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
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
    .optional()
    .nullable(),

  bio: z
    .string()
    .max(1000, "Bio must be at most 1000 characters")
    .optional()
    .nullable(),

  // Avatar and banner can be existing (URL) or new (File)
  avatar: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("existing"),
        url: z.string().url(),
      }),
      z.object({
        type: z.literal("new"),
        file: z.instanceof(File),
        tempId: z.string(),
      }),
    ])
    .nullable(),

  banner: z
    .discriminatedUnion("type", [
      z.object({
        type: z.literal("existing"),
        url: z.string().url(),
      }),
      z.object({
        type: z.literal("new"),
        file: z.instanceof(File),
        tempId: z.string(),
      }),
    ])
    .nullable(),

  // Skills array
  skills: z.array(
    z.object({
      id: z.string().uuid().optional(), // Existing skills have IDs
      tempId: z.string().optional(), // New skills get temp IDs
      skillId: z.string().uuid(), // The skill reference
      label: z.string(), // For display purposes
      level: z.number().min(1).max(5),
    })
  ),

  // Social links
  socialLinks: z
    .array(
      z.object({
        id: z.string().uuid().optional(), // Existing links have IDs
        tempId: z.string().optional(), // New links get temp IDs
        type: z.nativeEnum(SocialLinkType),
        url: z.string().min(1, "URL is required"),
      })
    )
    .refine(
      (links) => {
        // Ensure no duplicate social link types
        const types = links.map((link) => link.type);
        return types.length === new Set(types).size;
      },
      { message: "Each social platform can only be added once" }
    ),

  // Portfolio items
  portfolioItems: z.array(
    z.object({
      id: z.string().uuid().optional(), // Existing items have IDs
      tempId: z.string().optional(), // New items get temp IDs
      title: z.string().min(1, "Title is required").max(100),
      description: z.string().max(500).optional(),
      url: z.string().url().optional().or(z.literal("")),
      images: z
        .array(
          z.discriminatedUnion("type", [
            // Existing images
            z.object({
              type: z.literal("existing"),
              id: z.string().uuid(),
              url: z.string().url(),
              isPrimary: z.boolean(),
            }),
            // New images
            z.object({
              type: z.literal("new"),
              file: z.instanceof(File),
              isPrimary: z.boolean(),
              tempId: z.string(),
            }),
          ])
        )
        .min(1, "At least one image is required")
        .refine((images) => images.some((img) => img.isPrimary), {
          message: "One image must be marked as primary",
        }),
    })
  ),

  // Featured badge
  featuredBadgeId: z.string().uuid().nullable(),
});

export type UpdateProfileFormData = z.infer<typeof UpdateProfileFormSchema>;

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
