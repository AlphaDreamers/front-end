"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { ResetPasswordFormSchema } from "@/lib/schemas";
import { resetPassword } from "@/lib/actions/auth";
import AuthCard from "@/components/templates/auth-card";
import FormInput from "@/components/forms/form-input";

export default function ResetPasswordPage() {
  const { push } = useRouter();

  const searchParams = useSearchParams();

  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    toast.promise(
      async () =>
        resetPassword({
          email: searchParams.get("email") || undefined,
          code: searchParams.get("code") || undefined,
          newPassword: values.newPassword,
        }),
      {
        loading: "Resetting password...",
        success: () => {
          push("/sign-in");

          return "Password reset successful! You can now sign in with your new password.";
        },
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          form.setError("root", { message: ms });
          return ms;
        },
      }
    );
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Reset your password"
      description="Choose a new password for your account"
      footer={
        <>
          <span>Remember your password?</span>
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "link",
              }),
              "py-0 px-1 m-0 h-fit w-fit font-medium inline"
            )}
          >
            Sign in
          </Link>
          instead
        </>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput
            control={form.control}
            type="password-with-indicator"
            icon={Lock}
            name="newPassword"
            label="New Password"
            placeholder="Enter your new password"
            required
          />

          <FormInput
            control={form.control}
            type="password-confirmation"
            icon={Lock}
            name="confirmNewPassword"
            label="Confirm New Password"
            placeholder="Re-enter your new password"
            required
          />

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Resetting password...
              </>
            ) : (
              <>
                <span>Reset password</span>
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
