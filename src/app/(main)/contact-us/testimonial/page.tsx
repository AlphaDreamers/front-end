import { MessageCircle, Star } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { TestimonialContentSchema } from "@/lib/schemas/contact";
import Rating from "@/components/rating";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import ContactForm from "@/components/contact/contact-form";
import { me } from "@/lib/actions/auth";

export default async function TestimonialContactPage() {
  const user = await me();

  const isAuth = !!user?.isVerified;

  return (
    <ContactPageTemplate
      title="Share Your Experience"
      description="We'd love to hear about your positive experience with BlueFrog marketplace. Please fill out the form below to share your testimonial."
    >
      <ContactForm
        schema={TestimonialContentSchema}
        isAuth={isAuth}
        defaultValues={{
          guestEmail: user?.email || undefined,
        }}
      >
        {(form) => (
          <>
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
                      onClick={(rating) => field.onChange(rating)}
                      rating={field.value}
                      size={24}
                    />
                  </FormControl>
                  <FormDescription>
                    Rate your experience with BlueFrog marketplace
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageCircle className="size-4" />
                    Your Experience
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your positive experience with BlueFrog marketplace..."
                      rows={5}
                      className="h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Tell other users about your experience with our platform
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </ContactForm>
    </ContactPageTemplate>
  );
}
