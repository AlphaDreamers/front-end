"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { VerifyResetPasswordCodeFormSchema } from "@/lib/schemas";
import { useCountdown } from "@/hooks/use-countdown";
import AuthCard from "@/components/templates/auth-card";
import {
  resendPasswordResetCode,
  verifyPasswordResetCode,
} from "@/lib/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VerifyPasswordResetCode() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const form = useForm({
    resolver: zodResolver(VerifyResetPasswordCodeFormSchema),
    defaultValues: {
      email,
      code: "",
    },
  });
  const onSubmit = async (
    values: z.infer<typeof VerifyResetPasswordCodeFormSchema>
  ) =>
    toast.promise(async () => verifyPasswordResetCode(values), {
      loading: "Verifying code...",
      success: () => {
        const params = new URLSearchParams(searchParams);
        params.set("email", email);
        params.set("code", values.code);
        push(`/reset-password?${params.toString()}`);
        return "Code verified successfully! You can now reset your password.";
      },
      error: (error) => {
        const ms =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        form.setError("code", { message: ms });
        return ms;
      },
    });
  const isLoading = form.formState.isSubmitting;
  const { timeLeft, isActive, start } = useCountdown(60);

  const handleResend = async () => {
    if (isActive) {
      toast.error(
        `Please wait ${timeLeft} seconds before resending the code again.`
      );
      return;
    }

    start();

    toast.promise(async () => await resendPasswordResetCode(email), {
      loading: "Resending reset code...",
      success: () => {
        form.reset();
        return "New code sent to your email!";
      },
      error: (error) => {
        const ms =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        return ms;
      },
    });
  };

  return (
    <AuthCard
      title="Verify Reset Code"
      description="Enter the 6-digit code sent to your email"
      footer={
        <div className="text-center">
          <span>Didn&apos;t receive the code? Check your spam folder or</span>
          <Button
            variant="link"
            className="inline w-fit h-fit p-0 m-0"
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend code {isActive ? `(${timeLeft}s)` : ""}
          </Button>
        </div>
      }
      cardFooter={
        <>
          <span>Wrong email? </span>
          <Link
            href="/forgot-password"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "inline w-fit h-fit p-0 m-0",
              })
            )}
          >
            Go back and edit
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 items-center">
                <FormLabel className="text-center text-lg font-semibold">
                  Enter the 6-digit code below
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="size-12" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify Code
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
