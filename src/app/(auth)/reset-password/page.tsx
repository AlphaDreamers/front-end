// src/app/(auth)/reset-password/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, KeyRound, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { calculatePasswordStrength, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { ResetPasswordFormSchema } from "@/lib/schemas";
import { resetPassword } from "@/lib/actions/auth";
import AuthCard from "@/components/templates/auth-card";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import PasswordInput from "@/components/password-input";

export default function ResetPasswordPage() {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { push } = useRouter();

  const searchParams = useSearchParams();
  const email = searchParams.get("email") || undefined;
  const code = searchParams.get("code") || undefined;
  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email,
      code,
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) =>
    toast.promise(async () => resetPassword(values), {
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
    });

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
          <div>
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="size-4" />
                    New Password
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter your new password"
                      onChange={(e) => {
                        field.onChange(e);
                        setPasswordStrength(
                          calculatePasswordStrength(e.target.value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordStrengthIndicator strength={passwordStrength} />
          </div>

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <KeyRound className="size-4" />
                  Confirm New Password
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Re-enter your new password"
                  />
                </FormControl>
                <FormDescription>
                  Please re-enter your new password to confirm.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
