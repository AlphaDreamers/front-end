import { z } from "zod";
import { COUNTRIES, CountryValue } from "./countries";
import { COMMON_PASSWORDS } from "./common-passwords";

export const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signInFormDefaultValues: z.infer<typeof SignInFormSchema> = {
  email: "",
  password: "",
};

export const SignUpFormSchema = z
  .object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .refine((val) => !COMMON_PASSWORDS.includes(val), {
        message: "Password is too common",
      }),
    confirmPassword: z.string(),
    country: z.enum(
      COUNTRIES.map((country) => country.value) as [
        CountryValue,
        ...CountryValue[],
      ]
    ),
    biometricHash: z.string(),
  })
  .refine(
    (schema) => {
      return schema.password === schema.confirmPassword;
    },
    {
      message: "Passwords do not match",
    }
  );

export const SignUpFormDefaultValues: z.infer<typeof SignUpFormSchema> = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: COUNTRIES[0].value,
  biometricHash: "",
};

export const CreateGigFormSchema = z.object({
  title: z.string(),
  description: z.string(),
  categoryId: z.string().uuid(),
  tags: z.array(
    z.object({
      label: z.string(),
    })
  ),
  images: z.array(
    z.object({
      url: z.string(),
      isPrimary: z.boolean().optional(),
      sortOrder: z.number(),
    })
  ),
  packages: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      price: z.number().positive(),
      deliveryTime: z.number().positive(),
      revisions: z.number().positive().optional(),
      features: z.array(
        z.object({
          title: z.string(),
          included: z.boolean().default(true),
        })
      ),
    })
  ),
});

export const CreateGigFormDefaultValues: z.infer<typeof CreateGigFormSchema> = {
  title: "",
  description: "",
  categoryId: "",
  tags: [],
  images: [],
  packages: [
    {
      title: "",
      description: "",
      price: 0,
      deliveryTime: 0,
      revisions: 0,
      features: [
        {
          title: "",
          included: true,
        },
      ],
    },
  ],
};

export const EditGigFormSchema = z.object({
  id: z.string().uuid(), // The ID of the gig being edited
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().uuid(),
  tags: z.array(
    z.object({
      id: z.string().uuid().optional(), // Optional ID for new tags
      label: z.string().min(1, "Tag label is required"),
    })
  ),
  images: z.array(
    z.object({
      id: z.string().uuid().optional(), // Optional ID for new images
      url: z.string().min(1, "Image URL is required"),
      isPrimary: z.boolean().default(false),
      sortOrder: z.number(),
    })
  ),
  packages: z.array(
    z.object({
      id: z.string().uuid().optional(), // Optional ID for new packages
      title: z.string().min(1, "Package title is required"),
      description: z.string().min(1, "Package description is required"),
      price: z.number().positive("Price must be positive"),
      deliveryTime: z.number().positive("Delivery time must be positive"),
      revisions: z.number().positive("Revisions must be positive").optional(),
      features: z.array(
        z.object({
          id: z.string().uuid().optional(), // Optional ID for new features
          title: z.string().min(1, "Feature title is required"),
          included: z.boolean().default(true),
        })
      ),
    })
  ),
});
