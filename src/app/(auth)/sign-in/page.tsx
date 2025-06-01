"use client";

import Link from "next/link";
import { Mail, ArrowRight, Key, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import { SignInFormSchema } from "@/lib/schemas";
import { signIn } from "@/lib/actions";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback-url") || "/";
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInFormSchema>) => {
    toast.promise(async () => signIn(values), {
      loading: "Signing in...",
      success: () => {
        push(callbackUrl);

        return "Signed in successfully";
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
      <CardHeader className="text-center">
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl className="relative">
                    <div>
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
                  <FormDescription className="sr-only">
                    This will be your public username
                  </FormDescription>
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <div className="text-center w-full text-sm text-muted-foreground leading-[0.5]">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "inline p-0 m-0",
              })
            )}
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
