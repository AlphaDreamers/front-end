import { MessageCircle, MessageSquare } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FeedbackContentSchema } from "@/lib/schemas/contact";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import { me } from "@/lib/actions/auth";
import ContactForm from "@/components/contact/contact-form";

const FEEDBACK_CATEGORY_LABELS = {
  GENERAL: "General Feedback",
  FEATURE_REQUEST: "Feature Request",
  BUG_REPORT: "Bug Report",
  UI_UX: "User Interface/Experience",
};

export default async function ContactPage() {
  const user = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Share Your Feedback"
      description="We value your input! Please share your feedback to help us improve the BlueFrog marketplace experience."
    >
      <ContactForm
        schema={FeedbackContentSchema}
        isAuth={isAuth}
        defaultValues={{
          guestEmail: user?.email || undefined,
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
    </ContactPageTemplate>
  );
}
