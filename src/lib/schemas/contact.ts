import { z } from "zod";

export const BaseContactSchema = z.object({
  guestEmail: z.string().email("Please enter a valid email address").optional(),
});

// Individual content schemas for each message type
export const TestimonialContentSchema = z
  .object({
    rating: z
      .number()
      .int("Rating must be a whole number")
      .min(1, "Please provide a rating")
      .max(5, "Rating cannot exceed 5 stars"),
    content: z
      .string()
      .min(10, "Testimonial must be at least 10 characters")
      .max(1000, "Testimonial must be at most 1000 characters"),
  })
  .merge(BaseContactSchema);

export const ComplaintContentSchema = z
  .object({
    orderId: z
      .string()
      .min(1, "Order ID is required")
      .max(50, "Order ID is too long")
      .regex(
        /^[A-Z0-9\-_]+$/i,
        "Order ID can only contain letters, numbers, hyphens, and underscores"
      ),
    description: z
      .string()
      .min(20, "Please provide a detailed description (at least 20 characters)")
      .max(2000, "Description must be at most 2000 characters"),
  })
  .merge(BaseContactSchema);

export const SupportContentSchema = z
  .object({
    subject: z
      .string()
      .min(1, "Subject is required")
      .max(100, "Subject must be at most 100 characters"),
    description: z
      .string()
      .min(10, "Please provide more details (at least 10 characters)")
      .max(2000, "Description must be at most 2000 characters"),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  })
  .merge(BaseContactSchema);

export const FeedbackContentSchema = z
  .object({
    message: z
      .string()
      .min(5, "Please provide more details (at least 5 characters)")
      .max(1500, "Message must be at most 1500 characters"),
    category: z
      .enum(["GENERAL", "FEATURE_REQUEST", "BUG_REPORT", "UI_UX"])
      .default("GENERAL"),
  })
  .merge(BaseContactSchema);

export const GeneralContentSchema = z
  .object({
    subject: z
      .string()
      .max(100, "Subject must be at most 100 characters")
      .optional(),
    message: z
      .string()
      .min(5, "Please provide more details (at least 5 characters)")
      .max(1500, "Message must be at most 1500 characters"),
  })
  .merge(BaseContactSchema);
