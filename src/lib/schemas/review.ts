import { z } from "zod";

export const SellerResponseSchema = z.object({
  reviewId: z.string().uuid(),
  response: z
    .string()
    .min(1, "Response cannot be empty")
    .max(1000, "Response is too long"),
});
