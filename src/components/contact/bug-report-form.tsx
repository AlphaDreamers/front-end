"use client";
import { BugReportSchema } from "@/lib/schemas/contact";
import ContactForm from "./contact-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Bug, Info } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { createContactMessage } from "@/lib/actions/contact";

interface BugReportFormProps {
  isAuth: boolean;
  email?: string;
}

const BugReportForm = ({ isAuth, email }: BugReportFormProps) => {
  return (
    <ContactForm
      action={createContactMessage}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
        type: "BUG_REPORT",
        stepsToReproduce: "",
        expectedBehavior: "",
        actualBehavior: "",
      }}
      schema={BugReportSchema}
    >
      {(form) => (
        <>
          <FormField
            control={form.control}
            name="stepsToReproduce"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Bug className="size-4" />
                  Steps to Reproduce
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="1. Go to...\n2. Click on...\n3. Notice that..."
                    rows={5}
                    className="h-[100px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Provide step-by-step instructions to reproduce the bug
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedBehavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Info className="size-4" />
                  Expected Behavior
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What did you expect to happen?"
                    rows={3}
                    className="h-[75px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Describe what you expected to happen
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="actualBehavior"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Info className="size-4" />
                  Actual Behavior
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What actually happened instead?"
                    rows={3}
                    className="h-[75px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Describe what actually happened
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

export default BugReportForm;
