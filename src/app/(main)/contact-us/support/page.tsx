import { MessageCircle, AlertTriangle, HelpCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";

import { SupportContentSchema } from "@/lib/schemas/contact";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import ContactForm from "@/components/contact/contact-form";
import { me } from "@/lib/actions/auth";

export default async function SupportContactPage() {
  const user = await me();

  const isAuth = !!user?.isVerified;
  return (
    <ContactPageTemplate
      title="Get Technical Support"
      description="Need help with your account or technical issues? Our support team is here to assist you. Please fill out the form below to get started."
    >
      <ContactForm
        schema={SupportContentSchema}
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
                        {Object.entries(PRIORITY_LABELS).map(
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
    </ContactPageTemplate>
  );
}
