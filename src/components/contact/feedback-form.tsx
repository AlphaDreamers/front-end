"use client";
import { FeedbackSchema } from "@/lib/schemas/contact";
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
import { createContactMessage } from "@/lib/actions/contact";

interface FeedbackFormProps {
  isAuth: boolean;
  email?: string;
}

const FeedbackForm = ({ isAuth, email }: FeedbackFormProps) => {
  return (
    <ContactForm
      action={createContactMessage}
      schema={FeedbackSchema}
      isAuth={isAuth}
      defaultValues={{
        type: "FEEDBACK",
        guestEmail: email,
        feedbackType: "GENERAL",
        message: "",
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="feedbackType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Feedback Type
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General Feedback</SelectItem>
                      <SelectItem value="FEATURE_REQUEST">
                        Feature Request
                      </SelectItem>
                      <SelectItem value="UI_UX">UI/UX Feedback</SelectItem>
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
