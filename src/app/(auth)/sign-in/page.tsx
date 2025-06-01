// src/app/(auth)/sign-in/page.tsx
"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { SignInFormSchema } from "@/lib/schemas";
import { signIn } from "@/lib/actions/auth";

export default function SignInPage() {
  const { isLoading, handleSubmit, searchParams } =
    useAuthForm<z.infer<typeof SignInFormSchema>>();
  const callbackUrl = searchParams.get("callback-url") || "/dashboard";

  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignInFormSchema>) => {
    handleSubmit(signIn, values, {
      successMessage: "Welcome back!",
      successRedirect: callbackUrl,
      onError: (error) => {
        // Set form-level error for invalid credentials
        form.setError("root", {
          type: "manual",
          message: error.message,
        });
      },
    });
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue"
      footer={
        <>
          {/* Primary footer action */}
          <div className="w-full text-center">
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

          {/* Divider */}
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Alternative sign-in methods (future implementation) */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled className="w-full">
              <img src="/google.svg" alt="Google" className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" disabled className="w-full">
              <img src="/github.svg" alt="GitHub" className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* Security notice */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </p>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form-level error display */}
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            required
          />

          <div className="space-y-2">
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              required
            />

            {/* Forgot password link aligned to the right */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
