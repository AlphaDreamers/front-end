"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
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
import { VerifyResetPasswordCodeFormSchema } from "@/lib/schemas";
import { Shield, Clock } from "lucide-react";
import { useAuthForm } from "@/hooks/use-auth-state";
import { useCountdown } from "@/hooks/use-countdown";
import { AuthCard } from "@/components/auth/auth-card";
import {
  resendPasswordResetCode,
  verifyPasswordResetCode,
} from "@/lib/actions";

export default function VerifyPasswordResetCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { isLoading, handleSubmit } = useAuthForm();
  const { timeLeft, isActive, start } = useCountdown(60);

  const form = useForm({
    resolver: zodResolver(VerifyResetPasswordCodeFormSchema),
    defaultValues: {
      email,
      code: "",
    },
  });

  const onSubmit = (
    values: z.infer<typeof VerifyResetPasswordCodeFormSchema>
  ) => {
    handleSubmit(verifyPasswordResetCode, values, {
      successMessage: "Code verified successfully",
      successRedirect: `/reset-password?email=${email}&code=${values.code}`,
      onError: (error) => {
        form.setError("code", { message: error.message });
      },
    });
  };

  const handleResend = async () => {
    if (isActive) return;

    start();
    await handleSubmit(resendPasswordResetCode, email, {
      successMessage: "New code sent to your email",
    });
  };

  return (
    <AuthCard
      title="Verify Reset Code"
      description="Enter the 6-digit code sent to your email"
      footer={
        <div className="w-full space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Code expires in 24 hours</span>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Didn't receive the code?{" "}
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={handleResend}
              disabled={isActive || isLoading}
              className="p-0"
            >
              {isActive ? `Resend in ${timeLeft}s` : "Resend code"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your information is secure and encrypted</span>
          </div>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={isLoading}
                    className="justify-center"
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="h-12 w-12" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
