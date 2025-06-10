"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import { signIn } from "@/lib/actions/auth";
import { SignInFormSchema } from "@/lib/schemas";
import AuthCard from "@/components/templates/auth-card";
import PasswordInput from "@/components/password-input";
import { Alert, AlertTitle } from "@/components/ui/alert";

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
    toast.promise(async () => signIn(values), {
      loading: "Signing in...",
      success: () => {
        const params = new URLSearchParams(searchParams);
        const callbackUrl = params.get("callback-url") || "/";
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
        form.setError("root", { message: ms });
        return ms;
      },
    });
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
          <AlertTitle>{err}</AlertTitle>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email address
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="size-4" />
                      Password
                      <span className="text-xs text-destructive">*</span>
                    </div>

                    <Link
                      href="/forgot-password"
                      className="text-xs hover:text-primary transition-colors duration-300 text-muted-foreground"
                    >
                      Forgot your password?
                    </Link>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
