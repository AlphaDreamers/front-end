"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AuthCard from "@/components/templates/auth-card";
import { ForgotPasswordFormSchema } from "@/lib/schemas";
import { forgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ForgotPasswordFormSchema>) =>
    toast.promise(async () => forgotPassword(values), {
      loading: "Sending reset code...",
      success: () => {
        const params = new URLSearchParams(searchParams);
        params.set("email", values.email);
        push(`/verify-reset-code?${params.toString()}`);
        return "Reset code sent! Please check your email.";
      },
      error: (error) => {
        const ms =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        form.setError("root", { message: ms });
        return ms;
      },
    });
  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Forgot your password?"
      description="No worries, we'll send you reset instructions"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email address
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Sending reset code...
              </>
            ) : (
              <>
                Send reset code
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
