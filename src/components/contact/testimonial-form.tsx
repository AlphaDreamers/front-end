"use client";

import { MessageCircle, Star } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { TestimonialContentSchema } from "@/lib/schemas/contact";
import { sendTestimonialMessage } from "@/lib/actions/contact";
import ContactForm from "./contact-form";
import Rating from "../rating";

interface TestimonialFormProps {
  isAuth: boolean;
  email?: string;
}

const TestimonialForm = ({ isAuth, email }: TestimonialFormProps) => {
  return (
    <ContactForm
      schema={TestimonialContentSchema}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
        rating: 0,
        content: "",
      }}
      action={sendTestimonialMessage}
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
  );
};

export default TestimonialForm;
