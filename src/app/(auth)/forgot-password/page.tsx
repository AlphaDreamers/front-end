"use client";

import { Mail, ArrowRight, Loader2, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { ForgotPasswordFormSchema } from "@/lib/schemas";
import { forgotPassword } from "@/lib/actions";

export default function ForgotPasswordPage() {
  const form = useForm({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: { email: string }) => {
    toast.promise(async () => forgotPassword(values), {
      loading: "Sending reset link...",
      success: () => {
        return "Reset link sent successfully";
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

  return (
    <main className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Forgot Password
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your email address to receive a link to reset your password. If
          you don&apos;t receive an email, please check your spam folder or try
          again later.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Mail size={16} className="inline mr-2" />
                      Email
                      <span className="text-xs text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the email address associated with your account. We
                      will send you a link to reset your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    Resetting password...
                    <Loader2 className="animate-spin mr-2" />
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>
          Your data is secure. We will never share your information with third
          parties.
        </span>
      </div>
    </main>
  );
}
