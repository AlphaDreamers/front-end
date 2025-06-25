import { z } from "zod";

const BaseContactSchema = z.object({
  guestEmail: z.string().email("Please enter a valid email address").optional(),
});

export const TestimonialSchema = z
  .object({
    type: z.literal("TESTIMONIAL"),
    rating: z
      .number()
      .int("Rating must be an integer")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
  })
  .merge(BaseContactSchema);

export const BugReportSchema = z
  .object({
    type: z.literal("BUG_REPORT"),
    stepsToReproduce: z.string().min(1, "Steps to reproduce are required"),
    expectedBehavior: z.string().min(1, "Expected behavior is required"),
    actualBehavior: z.string().min(1, "Actual behavior is required"),
  })
  .merge(BaseContactSchema);

export const CertificateRequestSchema = z
  .object({
    type: z.literal("CERTIFICATE_REQUEST"),
    applyingForId: z.string().uuid("Invalid badge ID"),
    certificateUrl: z.string().url("Please provide a valid certificate URL"),
  })
  .merge(BaseContactSchema);

export const SupportRequestSchema = z
  .object({
    type: z.literal("SUPPORT_REQUEST"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().min(1, "Description is required"),
  })
  .merge(BaseContactSchema);

export const FeedbackSchema = z
  .object({
    type: z.literal("FEEDBACK"),
    feedbackType: z.enum(["GENERAL", "FEATURE_REQUEST", "UI_UX"]),
    message: z.string().optional(),
  })
  .merge(BaseContactSchema);

export const ContactMessageSchema = z.discriminatedUnion("type", [
  TestimonialSchema,
  BugReportSchema,
  CertificateRequestSchema,
  SupportRequestSchema,
  FeedbackSchema,
]);
