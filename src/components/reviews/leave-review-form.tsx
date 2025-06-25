"use client";

import { useRouter } from "next/navigation";
import { Star, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Rating from "@/components/rating";
import AuthCard from "@/components/templates/auth-card";
import { leaveReview } from "@/lib/actions/review";
import FormInput from "../forms/form-input";
import FormTextarea from "../forms/form-textarea";

const schema = z.object({
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Please provide more details (minimum 10 characters)")
    .max(500, "Description must be less than 500 characters"),
  orderId: z.string().min(1, "Order ID is required"),
});

interface LeaveReviewFormProps {
  orderId: string;
}

export default function LeaveReviewForm({ orderId }: LeaveReviewFormProps) {
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      title: "",
      description: "",
      orderId,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) =>
    toast.promise(
      async () => {
        await leaveReview({
          rating: data.rating,
          title: data.title,
          description: data.description,
          orderId: data.orderId,
        });
      },
      {
        loading: "Submitting your review...",
        success: () => {
          push("/");
          return "Review submitted successfully!";
        },
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          form.setError("root", { message: ms });
          return ms;
        },
      }
    );

  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Leave a Review"
      description="Share your experience with this seller and help build trust in the BlueFrog community."
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Star className="size-4" />
                  Your Rating
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Rating
                    onClick={(value) => {
                      field.onChange(value);
                    }}
                    rating={field.value}
                    size={32}
                  />
                </FormControl>
                <FormDescription>
                  Rate your experience with this seller
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormInput
            control={form.control}
            name="title"
            label="Review Title"
            placeholder="Enter a brief title for your review"
            description="A short summary of your experience"
            required
            icon={Star}
          />

          <FormTextarea
            control={form.control}
            name="description"
            icon={Star}
            label="Review Description"
            placeholder="Share your detailed experience with this seller"
            description="Provide as much detail as possible to help others"
            required
          />

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full mt-4">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing & Submitting...
              </>
            ) : (
              <>
                Submit Review
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
