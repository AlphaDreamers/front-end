"use client";

import { Key, Loader2, LockKeyhole, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ResetPasswordFormSchema } from "@/lib/schemas";
import { resetPassword } from "@/lib/actions";
import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from "@/lib/utils";
import PasswordInput from "@/components/password-input";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import { usePasswordStrength } from "@/hooks/use-password-strength";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? undefined;
  const code = searchParams.get("code") ?? undefined;

  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      email,
      code,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    toast.promise(async () => await resetPassword(values), {
      loading: "Resetting password...",
      success: () => {
        push("/sign-in");

        return "Password reset successfully";
      },
      error: (err) => {
        const ms = err instanceof Error ? err.message : "Something went wrong";
        form.setError("root", {
          type: "custom",
          message: ms,
        });
        return ms;
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  const { strength: passwordStrength } = usePasswordStrength(
    form.watch("newPassword")
  );

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Reset Password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your new password below to reset your account password. Make
          sure to choose a strong password that you can remember.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <Card>
            <CardContent>
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LockKeyhole size={16} className="inline mr-2" />
                      Password{" "}
                      <span className="text-xs text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••••••" {...field} />
                    </FormControl>
                    <PasswordStrengthIndicator
                      strength={passwordStrength}
                      color={getPasswordStrengthColor(passwordStrength)}
                      label={getPasswordStrengthLabel(passwordStrength)}
                    />
                    <FormDescription>
                      Choose a strong, memorable password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <LockKeyhole size={16} className="inline mr-2" />
                      Confirm Password{" "}
                      <span className="text-xs text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Re-enter your password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    <Key className="mr-2" />
                    Reset Password
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield size={16} />
        <span>Secured with end-to-end encryption</span>
      </div>
    </main>
  );
}
