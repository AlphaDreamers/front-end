"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Star, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

const schema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters long")
    .max(500, "Comment must be less than 500 characters"),
  orderId: z.string().min(1, "Order ID is required"),
});

export default function ReviewPage({
  params,
}: {
  params: Promise<{
    orderId: string;
  }>;
}) {
  const { push } = useRouter();
  const { orderId } = use(params);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
      comment: "",
      orderId,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) =>
    toast.promise(
      async () => {
        console.log("Submitting review:", data);
      },
      {
        loading: "Submitting your review...",
        success: () => {
          push("/dashboard");
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

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Star className="size-4" />
                  Your Comment
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your experience working with this seller..."
                    className="resize-none h-[150px]"
                  />
                </FormControl>
                <FormDescription>
                  Help others by sharing your experience with this seller
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
