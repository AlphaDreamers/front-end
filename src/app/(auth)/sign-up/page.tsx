"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  User,
  Lock,
  ArrowRight,
  AtSign,
  KeyRound,
  Loader2,
  MapPin,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SignUpFormSchema } from "@/lib/schemas";
import { signUp } from "@/lib/actions/auth";
import AuthCard from "@/components/templates/auth-card";
import { COUNTRIES } from "@/lib/data/countries";
import FormInput from "@/components/forms/form-input";
import FormCombobox from "@/components/forms/form-combobox";

export default function SignUpPage() {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      country: COUNTRIES[0].value,
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof SignUpFormSchema>) =>
    toast.promise(
      async () =>
        signUp({
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          password: values.password,
          country: values.country,
        }),
      {
        loading: "Creating account...",
        success: () => {
          const params = new URLSearchParams(searchParams);
          params.set("email", values.email);
          push(`/verify-email?${params.toString()}`);
          return "Account created! Please check your email to verify.";
        },
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          form.setError("root", { message: ms });
          return ms;
        },
      }
    );
  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Create your account"
      description="Join the Solana services marketplace"
      footer={
        <div>
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
      }
      cardFooter={
        <>
          By creating an account, you agree to our{" "}
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name fields in a grid */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              type="text"
              icon={User}
              name="firstName"
              label="First name"
              control={form.control}
              required
              placeholder="John"
            />

            <FormInput
              type="text"
              icon={User}
              name="lastName"
              label="Last name"
              control={form.control}
              required
              placeholder="Doe"
            />
          </div>

          <FormInput
            type="text"
            icon={AtSign}
            name="username"
            label="Username"
            control={form.control}
            required
            placeholder="johndoe"
          />

          <FormInput
            type="email"
            icon={Mail}
            name="email"
            label="Email address"
            control={form.control}
            required
            placeholder="john@example.com"
          />

          <FormInput
            type="password-with-indicator"
            icon={Lock}
            name="password"
            label="Password"
            control={form.control}
            required
            placeholder="Create a strong password"
          />

          <FormInput
            type="password-confirmation"
            icon={KeyRound}
            name="confirmPassword"
            label="Confirm password"
            control={form.control}
            required
            placeholder="Re-enter your password"
          />

          <FormCombobox
            control={form.control}
            name="country"
            label="Country"
            icon={MapPin}
            required
            values={COUNTRIES}
            topic={{ singular: "country", plural: "countries" }}
            description="Select your country to help us provide localized content and services"
          />

          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight />
              </>
            )}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
