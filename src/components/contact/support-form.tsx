"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AlertTriangle, HelpCircle, MessageCircle } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

import { PRIORITY_LABELS } from "@/lib/schemas/contact";
import { SupportContentSchema } from "@/lib/schemas/contact";
import ContactForm from "./contact-form";

interface SupportFormProps {
  isAuth: boolean;
  email?: string;
}

const SupportForm = ({ isAuth, email = undefined }: SupportFormProps) => {
  return (
    <ContactForm
      schema={SupportContentSchema}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  Priority Level
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Help us prioritize your request appropriately
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
