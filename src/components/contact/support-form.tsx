"use client";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SupportRequestSchema } from "@/lib/schemas/contact";
import ContactForm from "./contact-form";
import { createContactMessage } from "@/lib/actions/contact";

interface SupportFormProps {
  isAuth: boolean;
  email?: string;
}

const SupportForm = ({ isAuth, email = undefined }: SupportFormProps) => {
  return (
    <ContactForm
      action={createContactMessage}
      schema={SupportRequestSchema}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
        type: "SUPPORT_REQUEST",
        subject: "",
        description: "",
      }}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <HelpCircle className="size-4" />
                  Subject
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Brief description of your issue"
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Give us a quick summary of what you need help with
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MessageCircle className="size-4" />
                  Description
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Please provide detailed information about your support request..."
                    rows={6}
                    className="h-[150px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Include any error messages, steps you&apos;ve tried, or
                  relevant details
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

export default SupportForm;
