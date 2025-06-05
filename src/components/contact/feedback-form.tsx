"use client";

import { FeedbackContentSchema } from "@/lib/schemas/contact";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { MessageCircle, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import ContactForm from "./contact-form";
import { FEEDBACK_CATEGORY_LABELS } from "@/lib/schemas/contact";

interface FeedbackFormProps {
  isAuth: boolean;
  email?: string;
}

const FeedbackForm = ({ isAuth, email }: FeedbackFormProps) => {
  return (
    <ContactForm
      schema={FeedbackContentSchema}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Feedback Category
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FEEDBACK_CATEGORY_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Help us categorize your feedback for the right team
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageCircle className="size-4" />
                  Your Feedback
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share your thoughts and suggestions..."
                    rows={5}
                    className="h-[100px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Your feedback helps us improve the platform for everyone
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

export default FeedbackForm;
