import { z } from "zod";

export const BaseContactSchema = z.object({
  guestEmail: z.string().email("Please enter a valid email address").optional(),
});

export const TestimonialContentSchema = z
  .object({
    type: z.literal("TESTIMONIAL"),
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
    type: z.literal("COMPLAINT"),
    orderId: z
      .string()
      .min(1, "Order ID is required")
      .max(50, "Order ID is too long"),
    description: z
      .string()
      .min(20, "Please provide a detailed description (at least 20 characters)")
      .max(2000, "Description must be at most 2000 characters"),
  })
  .merge(BaseContactSchema);

export const SupportContentSchema = z
  .object({
    type: z.literal("SUPPORT"),
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
    type: z.literal("FEEDBACK"),
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
    type: z.literal("GENERAL_INQUIRY"),
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

export const ContactMessageSchema = z.discriminatedUnion("type", [
  TestimonialContentSchema,
  ComplaintContentSchema,
  SupportContentSchema,
  FeedbackContentSchema,
  GeneralContentSchema,
]);

export type ContactMessageData = z.infer<typeof ContactMessageSchema>;
export type TestimonialData = z.infer<typeof TestimonialContentSchema>;
export type ComplaintData = z.infer<typeof ComplaintContentSchema>;
export type SupportData = z.infer<typeof SupportContentSchema>;
export type FeedbackData = z.infer<typeof FeedbackContentSchema>;
export type GeneralData = z.infer<typeof GeneralContentSchema>;

export const MESSAGE_TYPE_CONFIG = {
  TESTIMONIAL: {
    label: "Share Your Experience",
    description: "Tell others about your positive experience with BlueFrog",
    requiresAuth: true,
    schema: TestimonialContentSchema,
    route: "/contact/testimonial",
    icon: "Star" as const,
    color: "text-yellow-500" as const,
    bgColor: "bg-yellow-500/10" as const,
    borderColor: "border-yellow-500/20" as const,
  },
  COMPLAINT: {
    label: "Report an Issue",
    description: "Report problems with orders or user behavior",
    requiresAuth: true,
    schema: ComplaintContentSchema,
    route: "/contact/complaint",
    icon: "AlertTriangle" as const,
    color: "text-red-500" as const,
    bgColor: "bg-red-500/10" as const,
    borderColor: "border-red-500/20" as const,
  },
  SUPPORT: {
    label: "Get Technical Support",
    description: "Get help with technical issues or account problems",
    requiresAuth: false,
    schema: SupportContentSchema,
    route: "/contact/support",
    icon: "HelpCircle" as const,
    color: "text-blue-500" as const,
    bgColor: "bg-blue-500/10" as const,
    borderColor: "border-blue-500/20" as const,
  },
  FEEDBACK: {
    label: "Share Feedback",
    description: "Help us improve the platform with your suggestions",
    requiresAuth: false,
    schema: FeedbackContentSchema,
    route: "/contact/feedback",
    icon: "MessageSquare" as const,
    color: "text-green-500" as const,
    bgColor: "bg-green-500/10" as const,
    borderColor: "border-green-500/20" as const,
  },
  GENERAL_INQUIRY: {
    label: "General Question",
    description: "Ask questions or get general information",
    requiresAuth: false,
    schema: GeneralContentSchema,
    route: "/contact/general",
    icon: "Mail" as const,
    color: "text-purple-500" as const,
    bgColor: "bg-purple-500/10" as const,
    borderColor: "border-purple-500/20" as const,
  },
} as const;

export function getConfigForType<T extends keyof typeof MESSAGE_TYPE_CONFIG>(
  type: T
): (typeof MESSAGE_TYPE_CONFIG)[T] {
  return MESSAGE_TYPE_CONFIG[type];
}

export function validateMessageType(
  type: string
): type is keyof typeof MESSAGE_TYPE_CONFIG {
  return type in MESSAGE_TYPE_CONFIG;
}

export const PRIORITY_LABELS = {
  LOW: "Low Priority",
  NORMAL: "Normal Priority",
  HIGH: "High Priority",
  URGENT: "Urgent - Immediate Attention Needed",
} as const;

export const FEEDBACK_CATEGORY_LABELS = {
  GENERAL: "General Feedback",
  FEATURE_REQUEST: "Feature Request",
  BUG_REPORT: "Bug Report",
  UI_UX: "User Interface/Experience Feedback",
} as const;

export const getMessageTypeLabel = (
  type: keyof typeof MESSAGE_TYPE_CONFIG
): string => {
  return MESSAGE_TYPE_CONFIG[type].label;
};

export const getPriorityLabel = (
  priority: keyof typeof PRIORITY_LABELS
): string => {
  return PRIORITY_LABELS[priority];
};

export const getFeedbackCategoryLabel = (
  category: keyof typeof FEEDBACK_CATEGORY_LABELS
): string => {
  return FEEDBACK_CATEGORY_LABELS[category];
};
