// src/app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthCard } from "@/components/auth/auth-card";
import { FormInput } from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { ForgotPasswordFormSchema } from "@/lib/schemas";
import { forgotPassword } from "@/lib/actions/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isLoading, handleSubmit } = useAuthForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordFormSchema>) => {
    await handleSubmit(forgotPassword, values, {
      onError: (error) => {
        // Don't reveal if email exists or not for security
        if (error.message.includes("not found")) {
          // Still show success to prevent email enumeration
          setIsSubmitted(true);
          setSubmittedEmail(values.email);
        } else {
          form.setError("email", { message: error.message });
        }
      },
    });

    setIsSubmitted(true);
    setSubmittedEmail(values.email);
  };

  // Success state - shown after form submission
  if (isSubmitted) {
    return (
      <AuthCard
        title="Check your email"
        description="We've sent you a password reset code"
      >
        <div className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              We've sent a 6-digit code to <strong>{submittedEmail}</strong>
              <br />
              Please check your inbox and spam folder.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={() =>
                router.push(
                  `/verify-reset-code?email=${encodeURIComponent(submittedEmail)}`
                )
              }
              className="w-full"
              size="lg"
            >
              Enter reset code
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              className="w-full"
            >
              Try a different email
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Didn't receive the email? Please wait a few minutes and check your
            spam folder.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="No worries, we'll send you reset instructions"
      footer={
        <div className="w-full space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/sign-in")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              For security reasons, we'll send a reset code whether or not an
              account exists with this email.
            </AlertDescription>
          </Alert>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            description="Enter the email associated with your account"
            required
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Sending reset code...
              </>
            ) : (
              <>
                Send reset code
                <Mail className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
