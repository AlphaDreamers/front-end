"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z, ZodTypeAny } from "zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ContactFormProps<TSchema extends ZodTypeAny> {
  isAuth: boolean;
  schema: TSchema;
  children?: (form: UseFormReturn<z.infer<TSchema>>) => React.ReactNode;
  defaultValues?: z.infer<TSchema>;
  action: (values: z.infer<TSchema>) => Promise<void>; // Make this required
}

const ContactForm = <TSchema extends ZodTypeAny>({
  isAuth,
  schema,
  children = () => null,
  defaultValues,
  action,
}: ContactFormProps<TSchema>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof schema>) =>
    toast.promise(async () => action(values), {
      loading: "Sending your message...",
      success: () => {
        router.push("/contact-us/success");
        return "Message sent successfully! We'll get back to you soon.";
      },
      error: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        form.setError("root", { message: errorMessage });
        return errorMessage;
      },
    });

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {!isAuth && (
          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Your Email
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="your.email@example.com"
                    type="email"
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll use this to respond to your message
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {children(form)}

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full mt-4">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
