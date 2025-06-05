"use client";
import { MessageCircle } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { GeneralContentSchema } from "@/lib/schemas/contact";
import ContactForm from "./contact-form";

interface GeneralFormProps {
  isAuth: boolean;
  email?: string;
}

const GeneralForm = ({ isAuth, email = undefined }: GeneralFormProps) => {
  return (
    <ContactForm
      schema={GeneralContentSchema}
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
                  <MessageCircle className="size-4" />
                  Subject
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Briefly describe your inquiry"
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Provide a short summary of your question or request
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
                  Your Message
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="How can we help you today?"
                    rows={5}
                    className="h-[100px] resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Ask us anything about BlueFrog marketplace
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

export default GeneralForm;
