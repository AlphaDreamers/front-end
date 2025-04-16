"use client";

import type React from "react";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Lock, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";

const VerificationSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

const verificationSchemaDefaultValues: z.infer<typeof VerificationSchema> = {
  email: "",
  code: "",
};

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{
    email: string;
  }>;
}) {
  const { email } = use(searchParams);
  const { push } = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Submit verification code
  const handleSubmit = async (values: z.infer<typeof VerificationSchema>) => {
    setIsLoading(true);

    toast.promise(
      async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(values),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Verification failed");
          }

          push("/sign-in");

          return response.json();
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: <Loader2 className="animate-spin" />,
        success: (data) => {
          return "message" in data ? data.message : "Verification successful";
        },
        error: (data) => {
          return "message" in data
            ? data.message
            : "Verification failed. Please try again.";
        },
      }
    );
  };

  // Resend verification code
  const handleResend = async () => {
    setIsLoading(true);

    toast.promise(
      async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-code`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!res.ok) {
            throw new Error("Failed to resend verification code");
          }

          push("/sign-in");

          return res.json();
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: <Loader2 className="animate-spin" />,
        success: () => {
          return "Verification code resent successfully";
        },
        error: () => {
          return "Failed to resend verification code. Please try again.";
        },
      }
    );
  };

  const form = useForm({
    resolver: zodResolver(VerificationSchema),
    defaultValues: {
      ...verificationSchemaDefaultValues,
      email: email || "",
    },
  });

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {" "}
          Verify Your Account
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Code</CardTitle>
          <CardDescription>
            We&apos;ve sent a 6-digit code to your email address
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="flex justify-center items-center">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center mb-8">
                    <FormLabel>One-Time Password</FormLabel>

                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot className="size-14" index={0} />
                          <InputOTPSlot className="size-14" index={1} />
                          <InputOTPSlot className="size-14" index={2} />
                          <InputOTPSlot className="size-14" index={3} />
                          <InputOTPSlot className="size-14" index={4} />
                          <InputOTPSlot className="size-14" index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Verify Account
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Didnt receive a code? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className={cn(
                    buttonVariants({
                      variant: "link",
                    }),
                    "inline px-1 py-0"
                  )}
                  disabled={isLoading}
                >
                  resend code
                </button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-4 flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Lock size={16} />
        Secure verification with end-to-end encryption
      </div>
    </main>
  );
}
