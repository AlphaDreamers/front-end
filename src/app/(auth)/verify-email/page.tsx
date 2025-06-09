"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
import { cn } from "@/lib/utils";

import { useCountdown } from "@/hooks/use-countdown";
import { verifyEmail, resendVerificationEmail } from "@/lib/actions/auth";
import { VerifyEmailFormSchema } from "@/lib/schemas";
import AuthCard from "@/components/templates/auth-card";

export default function VerifyEmailPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const form = useForm({
    resolver: zodResolver(VerifyEmailFormSchema),
    defaultValues: {
      code: "",
      email,
    },
  });
  const onSubmit = async (values: z.infer<typeof VerifyEmailFormSchema>) =>
    toast.promise(async () => verifyEmail(values), {
      loading: "Verifying email...",
      success: () => {
        const params = new URLSearchParams(searchParams);
        params.delete("email");
        push(`/sign-in?${params.toString()}`);
        return "Email verified successfully! Welcome aboard!";
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

    toast.promise(async () => await resendVerificationEmail(email), {
      loading: "Resending verification code...",
      success: () => {
        form.reset();
        return "Verification code resent successfully!";
      },
      error: (error) => {
        const ms =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while resending the code.";
        form.setError("root", { message: ms });
        return ms;
      },
    });
  };

  return (
    <AuthCard
      title="Verify your email"
      description={`We've sent a verification code to ${email}`}
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
            href="/sign-up"
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
                Verify email
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
