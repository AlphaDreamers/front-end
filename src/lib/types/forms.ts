// src/lib/types/forms.ts
import { MediaType } from "@prisma/client";
import { z } from "zod";

// Base media item types that align with Prisma schema
export type ExistingMediaItem = {
  type: "existing";
  id: string;
  url: string;
  mediaType: MediaType;
  order?: number;
};

export type NewMediaItem = {
  type: "new";
  file: File;
  tempId: string;
  mediaType: MediaType;
  order?: number;
};

export type MediaItem = ExistingMediaItem | NewMediaItem;

// Feature types
export type Feature = {
  id?: string; // undefined for new features
  title: string;
};

// Package types
export type Package = {
  id?: string; // undefined for new packages
  title: string;
  deliveryTime: number;
  price: number;
  revisions: number;
  featureInclusions: boolean[];
};

// Validation schemas
const MAX_FILE_SIZES: Record<MediaType, number> = {
  [MediaType.IMAGE]: 5 * 1024 * 1024, // 5MB
  [MediaType.VIDEO]: 100 * 1024 * 1024, // 100MB
  [MediaType.AUDIO]: 20 * 1024 * 1024, // 20MB
  [MediaType.DOCUMENT]: 10 * 1024 * 1024, // 10MB
  [MediaType.OTHER]: 10 * 1024 * 1024, // 10MB
};

const ACCEPTED_TYPES: Record<MediaType, string[]> = {
  [MediaType.IMAGE]: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  [MediaType.VIDEO]: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ],
  [MediaType.AUDIO]: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
  [MediaType.DOCUMENT]: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  [MediaType.OTHER]: ["*/*"],
};

// Media validation helper
export const validateMediaFile = (
  file: File,
  mediaType: MediaType
): { valid: boolean; error?: string } => {
  const maxSize = MAX_FILE_SIZES[mediaType];
  const acceptedTypes = ACCEPTED_TYPES[mediaType];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
    };
  }

  if (!acceptedTypes.includes("*/*") && !acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Accepted: ${acceptedTypes.join(", ")}`,
    };
  }

  return { valid: true };
};

// Detect media type from file
export const detectMediaType = (file: File): MediaType => {
  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) return MediaType.IMAGE;
  if (type.startsWith("video/")) return MediaType.VIDEO;
  if (type.startsWith("audio/")) return MediaType.AUDIO;
  if (
    type === "application/pdf" ||
    type === "application/msword" ||
    type.includes("document") ||
    type === "text/plain"
  ) {
    return MediaType.DOCUMENT;
  }

  return MediaType.OTHER;
};

// Generate temp ID for new items
export const generateTempId = () =>
  `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Common form validation schemas
export const MediaItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("existing"),
    id: z.string(),
    url: z.string(),
    mediaType: z.nativeEnum(MediaType),
    order: z.number().optional(),
  }),
  z.object({
    type: z.literal("new"),
    file: z.instanceof(File),
    tempId: z.string(),
    mediaType: z.nativeEnum(MediaType),
    order: z.number().optional(),
  }),
]);

export const FeatureSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(2, "Feature must be at least 2 characters")
    .max(50, "Feature must be at most 50 characters"),
});

export const PackageSchema = z.object({
  id: z.string().optional(),
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
    .positive("Price must be a positive number")
    .max(10000, "Price must be at most 10,000 SOL"),
  revisions: z
    .number()
    .int("Revisions must be a whole number")
    .min(-1, "Use -1 for unlimited revisions")
    .max(100, "Maximum 100 revisions"),
  featureInclusions: z.array(z.boolean()),
});

// Shared Gig form schema (for both create and edit)
export const GigFormSchema = z.object({
  id: z.string().optional(), // Only present for edit
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
    .array(z.string())
    .min(1, "Select at least one tag")
    .max(5, "Maximum 5 tags allowed"),
  features: z
    .array(FeatureSchema)
    .min(1, "Add at least one feature")
    .max(10, "Maximum 10 features allowed"),
  packages: z
    .array(PackageSchema)
    .min(1, "Add at least one package")
    .max(3, "Maximum 3 packages allowed")
    .refine(
      (packages) => {
        const prices = packages.map((p) => p.price);
        return prices.every((price, i) => i === 0 || price > prices[i - 1]);
      },
      { message: "Package prices must increase from left to right" }
    ),
  media: z
    .array(MediaItemSchema)
    .min(1, "Upload at least one media file")
    .max(10, "Maximum 10 media files allowed")
    .refine(
      (media) => {
        return (
          media.some((item) => item.mediaType === MediaType.IMAGE) &&
          //check size
          media
            .filter((item) => item.mediaType === MediaType.IMAGE)
            .every((item) => {
              if (item.type === "existing") {
                // Assume existing images are already validated
                return true;
              }
              // For new images, check file type and size
              const file = item.file;
              const isAcceptedType =
                file.type === "image/png" ||
                file.type === "image/jpeg" ||
                file.type === "image/jpg";
              const isAcceptedSize = file.size <= 5 * 1024 * 1024;
              return isAcceptedType && isAcceptedSize;
            })
        );
      },
      {
        message:
          "At least one image is required for the gig in PNG or JPG format and no more then 5 mb size",
      }
    ),
});
