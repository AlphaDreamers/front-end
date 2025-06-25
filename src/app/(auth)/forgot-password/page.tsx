"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import AuthCard from "@/components/templates/auth-card";
import { ForgotPasswordFormSchema } from "@/lib/schemas";
import { forgotPassword } from "@/lib/actions/auth";
import FormInput from "@/components/forms/form-input";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ForgotPasswordFormSchema>) => {
    if (isLoading) return;
    toast.promise(
      async () => {
        const res = await forgotPassword({
          email: values.email,
        });
        if (res.success === false) {
          throw new Error(res.error || "Failed to send reset code");
        }
      },
      {
        loading: "Sending reset code...",
        success: () => {
          const params = new URLSearchParams(searchParams);
          params.set("email", values.email);
          return "Reset code sent! Please check your email for instructions.";
        },
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          return ms;
        },
      }
    );
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Forgot your password?"
      description="No worries, we'll send you reset instructions"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            type="email"
            icon={Mail}
            name="email"
            label="Email"
            control={form.control}
            required
            placeholder="Enter your email address"
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
