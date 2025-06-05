import { MessageCircle } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { GeneralContentSchema } from "@/lib/schemas/contact";
import { me } from "@/lib/actions/auth";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import ContactForm from "@/components/contact/contact-form";

export default async function ContactPage() {
  const user = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Contact Us"
      description="We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you with your BlueFrog marketplace experience."
    >
      <ContactForm
        schema={GeneralContentSchema}
        isAuth={isAuth}
        defaultValues={{
          guestEmail: user?.email || undefined,
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
    </ContactPageTemplate>
  );
}
