// src/app/(auth)/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthCard } from "@/components/auth/auth-card";
import { FormInput } from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { ResetPasswordFormSchema } from "@/lib/schemas";
import { resetPassword } from "@/lib/actions";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || undefined;
  const code = searchParams.get("code") || undefined;

  const { isLoading, handleSubmit } = useAuthForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email,
      code,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const password = form.watch("newPassword");
  const { strength } = usePasswordStrength(password);

  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    await handleSubmit(resetPassword, values, {
      onError: (error) => {
        form.setError("root", { message: error.message });
      },
    });

    // Show success state instead of immediate redirect
    setIsSuccess(true);

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/sign-in");
    }, 3000);
  };

  // Success state UI
  if (isSuccess) {
    return (
      <AuthCard
        title="Password reset successful!"
        description="Your password has been updated"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            You can now sign in with your new password.
            <br />
            Redirecting to sign in page...
          </p>

          <Button
            onClick={() => router.push("/sign-in")}
            className="w-full"
            variant="outline"
          >
            Go to Sign In
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Choose a new password for your account"
      footer={
        <div className="w-full space-y-4">
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Choose a strong password that you haven't used before
            </AlertDescription>
          </Alert>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Remember your password?{" "}
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => router.push("/sign-in")}
              className="p-0 h-auto font-medium"
            >
              Sign in instead
            </Button>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form error */}
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Hidden fields for email and code if they come from URL */}
          {email && code && (
            <Alert>
              <AlertDescription>
                Resetting password for: <strong>{email}</strong>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <FormInput
              control={form.control}
              name="newPassword"
              label="New password"
              type="password"
              placeholder="Enter your new password"
              icon={Lock}
              required
            />

            {/* Live password strength feedback */}
            {password && (
              <PasswordStrengthIndicator
                strength={strength}
                color={
                  strength < 50
                    ? "text-red-500"
                    : strength < 75
                      ? "text-amber-500"
                      : "text-green-500"
                }
                label={
                  strength < 50 ? "Weak" : strength < 75 ? "Good" : "Strong"
                }
              />
            )}
          </div>

          <FormInput
            control={form.control}
            name="confirmNewPassword"
            label="Confirm new password"
            type="password"
            placeholder="Re-enter your new password"
            icon={Lock}
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || strength < 50}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Resetting password...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
