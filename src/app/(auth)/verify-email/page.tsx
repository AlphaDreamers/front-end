"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { resendVerificationEmail, verifyEmail } from "@/lib/actions";
import { VerifyEmailFormSchema } from "@/lib/schemas";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const callbackUrl = searchParams.get("callback-url") || "/";

  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(VerifyEmailFormSchema),
    defaultValues: {
      code: "",
      email,
    },
  });

  const onSubmit = async (values: z.infer<typeof VerifyEmailFormSchema>) => {
    toast.promise(async () => verifyEmail(values), {
      loading: "Veryfying...",
      success: () => {
        push(callbackUrl);

        return "Email verified successfully!";
      },
      error: (err) => {
        const ms =
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.";

        form.setError("root", {
          message: ms,
        });

        return ms;
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  const onResendCode = async () => {
    toast.promise(
      async () => {
        await resendVerificationEmail(email);
      },
      {
        loading: "Resending code...",
        success: () => {
          return "Verification code resent!";
        },
        error: (err) => {
          const ms =
            err instanceof Error
              ? err.message
              : "An error occurred. Please try again.";

          form.setError("root", {
            message: ms,
          });

          return ms;
        },
      }
    );
  };

  return (
    <Card className="animate-slideUp">
      <CardHeader className="text-center">
        <CardTitle>Verify your email</CardTitle>
        <CardDescription className="text-center">
          We&apos;ve sent a verification code to your email
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-fit mx-auto">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-12" />
                        <InputOTPSlot index={1} className="size-12" />
                        <InputOTPSlot index={2} className="size-12" />
                        <InputOTPSlot index={3} className="size-12" />
                        <InputOTPSlot index={4} className="size-12" />
                        <InputOTPSlot index={5} className="size-12" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify email
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <div className="text-center w-full text-sm text-muted-foreground leading-[0.5]">
          Didn&apos;t receive an email?
          <br />
          Check your spam folder or{" "}
          <Button
            onClick={onResendCode}
            disabled={isLoading}
            variant="link"
            className="inline p-0 m-0"
          >
            Resend code
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
