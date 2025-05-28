import { z } from "zod";

export const CreateNewWalletFormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ImportWalletFormSchema = z
  .object({
    mnemonic: z.string().min(12, "Mnemonic must be at least 12 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpFormSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
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

export const ResetPasswordFormSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

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
      .array(
        z.object({
          label: z
            .string()
            .min(1, "Feature label is required")
            .max(100, "Feature label must be at most 100 characters"),
        })
      )
      .min(1, "Add at least one feature")
      .max(10, "Maximum 10 features allowed"),
    packages: z
      .array(
        z.object({
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
        })
      )
      .min(1, "Add at least one package")
      .max(3, "Maximum 3 packages allowed")
      .refine(
        (packages) => {
          // Verify all packages have the same number of feature inclusions
          const firstPackageInclusionsCount =
            packages[0].featureInclusions.length;
          return packages.every(
            (pkg) =>
              pkg.featureInclusions.length === firstPackageInclusionsCount
          );
        },
        {
          message:
            "All packages must have the same number of feature inclusions",
        }
      ),
    images: z
      .array(
        z.object({
          file: z.instanceof(File),
          isPrimary: z.boolean(),
        })
      )
      .min(1, "Add at least one image")
      .max(8, "Maximum 8 images allowed"),
  })
  .refine(
    (data) => {
      // Ensure each feature is included in at least one package
      for (
        let featureIndex = 0;
        featureIndex < data.features.length;
        featureIndex++
      ) {
        // Check if any package includes this feature
        const isIncludedInAnyPackage = data.packages.some(
          (pkg) => pkg.featureInclusions[featureIndex] === true
        );

        if (!isIncludedInAnyPackage) {
          return false;
        }
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
      // Ensure that each package has exactly the same number of feature inclusions as there are features
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === data.features.length
      );
    },
    {
      message: "Number of feature inclusions must match number of features",
      path: ["packages"],
    }
  );

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
      .array(
        z.object({
          id: z.string().uuid().optional(),
          tempId: z.string().optional(), // For new features that need a temporary reference
          label: z
            .string()
            .min(1, "Feature label is required")
            .max(100, "Feature label must be at most 100 characters"),
        })
      )
      .min(1, "Add at least one feature")
      .max(10, "Maximum 10 features allowed")
      .refine(
        (features) => {
          // Ensure that every new feature (without an id) has a tempId
          return features.every((feature) => feature.id || feature.tempId);
        },
        {
          message: "Every new feature must have a temporary ID",
        }
      ),
    packages: z
      .array(
        z.object({
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
        })
      )
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
      // Verify all packages have the same number of feature inclusions
      const firstPackageInclusionsCount =
        data.packages[0].featureInclusions.length;
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === firstPackageInclusionsCount
      );
    },
    {
      message: "All packages must have the same number of feature inclusions",
    }
  )
  .refine(
    (data) => {
      // Ensure each feature is included in at least one package
      for (
        let featureIndex = 0;
        featureIndex < data.features.length;
        featureIndex++
      ) {
        // Check if any package includes this feature
        const isIncludedInAnyPackage = data.packages.some(
          (pkg) => pkg.featureInclusions[featureIndex] === true
        );

        if (!isIncludedInAnyPackage) {
          return false;
        }
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
      // Ensure that each package has exactly the same number of feature inclusions as there are features
      return data.packages.every(
        (pkg) => pkg.featureInclusions.length === data.features.length
      );
    },
    {
      message: "Number of feature inclusions must match number of features",
      path: ["packages"],
    }
  );

export const ContactSellerFormSchema = z.object({
  message: z.string().min(1, "Message is required"),
  recipientId: z.string().min(1, "Recipient ID is required"),
});

export const UpdateProfileFormSchema = z.object({
  username: z.string(),
  avatar: z.string(),
  banner: z.string(),
  headline: z.string(),
  bio: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  skills: z.array(
    z.object({
      id: z.string().uuid().optional(),
      level: z.number().min(1).max(5, "Skill level must be between 1 and 5"),
      skillId: z.string().uuid(),
    })
  ),
  socialLinks: z.array(
    z.object({
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
    })
  ),
  portfolioItems: z.array(
    z.object({
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
    })
  ),
  featuredBadge: z.string().uuid(),
});

export const KycFormSchema = z.object({
  id: z.instanceof(File),
  selfie: z.instanceof(File),
});

export const SendMessageFormSchema = z.object({
  attachments: z.instanceof(File).array().optional(),
  text: z.string().optional(),
});
