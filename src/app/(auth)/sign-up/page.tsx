// src/app/(auth)/sign-up/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  User,
  Lock,
  ArrowRight,
  Check,
  X,
  AtSign,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import AuthCard from "@/components/auth/auth-card";
import FormInput from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { SignUpFormSchema } from "@/lib/schemas";
import { signUp } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

// Password requirement component for better UX
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <X className="h-3 w-3 text-muted-foreground" />
      )}
      <span className={cn("text-muted-foreground", met && "text-foreground")}>
        {text}
      </span>
    </div>
  );
}

export default function SignUpPage() {
  const { isLoading, handleSubmit } =
    useAuthForm<z.infer<typeof SignUpFormSchema>>();
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const { strength } = usePasswordStrength(password);

  // Check individual password requirements for display
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const onSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
    handleSubmit(signUp, values, {
      successMessage: "Account created! Please check your email to verify.",
      successRedirect: `/verify-email?email=${encodeURIComponent(values.email)}`,
      onError: (error) => {
        // Handle specific error cases
        if (error.message.includes("already registered")) {
          form.setError("email", { message: error.message });
        } else {
          form.setError("root", { message: error.message });
        }
      },
    });
  };

  return (
    <AuthCard
      title="Create your account"
      description="Join the Solana services marketplace"
      footer={
        <>
          <div className="w-full text-center">
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
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
          {/* Form-level error */}
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Name fields in a grid */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="firstName"
              label="First name"
              placeholder="John"
              icon={User}
              required
            />
            <FormInput
              control={form.control}
              name="lastName"
              label="Last name"
              placeholder="Doe"
              icon={User}
              required
            />
          </div>

          <FormInput
            control={form.control}
            name="username"
            label="Username"
            placeholder="johndoe"
            icon={AtSign}
            description="This will be your public display name"
            required
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
            required
          />

          <div className="space-y-2">
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={Lock}
              required
              onFocus={() => setShowPasswordRequirements(true)}
            />

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress value={strength} className="h-2" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {strength}% strong
                  </span>
                </div>

                {/* Password requirements checklist */}
                {showPasswordRequirements && (
                  <div className="rounded-md bg-muted/50 p-3 space-y-1">
                    <PasswordRequirement
                      met={passwordChecks.length}
                      text="At least 8 characters"
                    />
                    <PasswordRequirement
                      met={passwordChecks.uppercase}
                      text="One uppercase letter"
                    />
                    <PasswordRequirement
                      met={passwordChecks.lowercase}
                      text="One lowercase letter"
                    />
                    <PasswordRequirement
                      met={passwordChecks.number}
                      text="One number"
                    />
                    <PasswordRequirement
                      met={passwordChecks.special}
                      text="One special character"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <FormInput
            control={form.control}
            name="confirmPassword"
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            icon={KeyRound}
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
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
