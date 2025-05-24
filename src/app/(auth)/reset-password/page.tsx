"use client";

import { ArrowRight, Key, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ResetPasswordFormSchema } from "@/lib/schemas";
import { resetPassword } from "@/lib/actions";
import { PasswordInput } from "@/components/password-input";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordFormSchema>) => {
    toast.promise(async () => resetPassword(values), {
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

  return (
    <Card className="animate-slideUp">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-primary-foreground">
          Set new password
        </CardTitle>
        <CardDescription className="text-center text-primary">
          Create a new password for your account
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl className="relative">
                    <div>
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <PasswordInput
                        {...field}
                        placeholder="********"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl className="relative">
                    <div>
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        {...field}
                        placeholder="********"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Resetting password...
                </>
              ) : (
                <>
                  Reset password
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <div className="text-center w-full text-sm text-muted-foreground leading-[0.5]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "inline p-0 m-0",
              })
            )}
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
