// src/app/(auth)/verify-email/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Mail, Shield, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuthForm } from "@/hooks/use-auth-state";
import { useCountdown } from "@/hooks/use-countdown";
import { verifyEmail, resendVerificationEmail } from "@/lib/actions";
import { VerifyEmailFormSchema } from "@/lib/schemas";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const callbackUrl = searchParams.get("callback-url") || "/dashboard";

  const { isLoading, handleSubmit } = useAuthForm();
  const { timeLeft, isActive, start } = useCountdown(60);
  const otpRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(VerifyEmailFormSchema),
    defaultValues: {
      code: "",
      email,
    },
  });

  // Auto-focus on the OTP input when component mounts
  useEffect(() => {
    otpRef.current?.focus();
  }, []);

  const onSubmit = (values: z.infer<typeof VerifyEmailFormSchema>) => {
    handleSubmit(verifyEmail, values, {
      successMessage: "Email verified successfully! Welcome aboard!",
      successRedirect: callbackUrl,
      onError: (error) => {
        form.setError("code", {
          message: error.message.includes("expired")
            ? "This code has expired. Please request a new one."
            : "Invalid code. Please check and try again.",
        });
      },
    });
  };

  const handleResend = async () => {
    if (isActive || !email) return;

    start();
    try {
      await resendVerificationEmail(email);
      // Clear the OTP field when resending
      form.setValue("code", "");
      otpRef.current?.focus();
    } catch (error) {
      console.error("Failed to resend:", error);
    }
  };

  return (
    <AuthCard
      title="Verify your email"
      description={
        <>
          We've sent a verification code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </>
      }
      footer={
        <div className="w-full space-y-4">
          {/* Email change option */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Wrong email? </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => window.history.back()}
              className="p-0 h-auto font-medium"
            >
              Go back and edit
            </Button>
          </div>

          {/* Resend option with countdown */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code? Check your spam folder or
            </p>
            <Button
              variant={isActive ? "ghost" : "outline"}
              size="sm"
              onClick={handleResend}
              disabled={isActive || isLoading}
              className="min-w-[140px]"
            >
              {isActive ? (
                <>Resend in {timeLeft}s</>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend code
                </>
              )}
            </Button>
          </div>

          {/* Security notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>This code expires in 24 hours for your security</span>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Enter the 6-digit code below
            </p>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      ref={otpRef}
                      maxLength={6}
                      {...field}
                      disabled={isLoading}
                      className="justify-center"
                    >
                      <InputOTPGroup className="gap-2">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="h-12 w-10 text-lg"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center mt-2" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || form.watch("code").length !== 6}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                Verify email
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
