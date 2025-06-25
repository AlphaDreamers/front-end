"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { SignInFormSchema } from "@/lib/schemas";
import AuthCard from "@/components/templates/auth-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FormInput from "@/components/forms/form-input";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof SignInFormSchema>) =>
    toast.promise(
      async () => {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (res?.error) {
          throw new Error("Invalid email or password");
        }
      },
      {
        loading: "Signing in...",
        success: () => {
          const params = new URLSearchParams(searchParams);
          const callbackUrl = params.get("callback-url") || "/dashboard";
          params.delete("callback-url");
          params.delete("error");
          push(`${callbackUrl}?${params.toString()}`);
          return "Welcome back!";
        },
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          return ms;
        },
      }
    );
  const isLoading = form.formState.isSubmitting;

  const err = searchParams.get("error");

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
      footer={
        <div>
          <span className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/sign-up"
            className="text-sm font-medium text-primary hover:underline"
          >
            Create one
          </Link>
        </div>
      }
      cardFooter={
        <>
          By signing in, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="underline hover:text-primary"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
        </>
      }
    >
      {err && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle />
          <AlertTitle>
            {err === "unauthorized"
              ? "You must be logged in"
              : err === "token-expired"
                ? "Session expired"
                : "Error"}
          </AlertTitle>
          <AlertDescription>
            {err === "unauthorized"
              ? "You must be logged in to access this page."
              : err === "token-expired"
                ? "Your session has expired. Please sign in again."
                : "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            type="email"
            icon={Mail}
            name="email"
            label="Email address"
            control={form.control}
            required
            placeholder="name@example.com"
          />

          <FormInput
            type="password"
            icon={Lock}
            name="password"
            label="Password"
            control={form.control}
            required
            placeholder="Enter your password"
          >
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline ml-auto"
            >
              Forgot password?
            </Link>
          </FormInput>

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
