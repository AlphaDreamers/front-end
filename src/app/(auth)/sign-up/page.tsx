"use client";

import Link from "next/link";
import { Mail, User, ArrowRight, Loader2, Key, UserCircle } from "lucide-react";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { signUp } from "@/lib/actions";
import {
  PASSWORD_SCHEMA_CONDITIONS_COUNT,
  PasswordSchema,
  SignUpFormSchema,
} from "@/lib/schemas";
import PasswordInput from "@/components/password-input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function SignUpPage() {
  const searchParams = useSearchParams();

  const [passwordStrength, setPasswordStrength] = useState(0);

  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpFormSchema>) => {
    toast.promise(async () => signUp(values), {
      loading: "Creating account...",
      success: () => {
        const params = new URLSearchParams(searchParams);

        params.set("email", values.email);

        push("/verify-email?" + params.toString());

        return "Account created! Check your email to verify your account.";
      },
      error: (err) => {
        const ms =
          err instanceof Error
            ? err.message
            : "An error occurred. Please try again.";

        form.setError("root", {
          message: ms,
        });

        return ms;
      },
    });
  };

  const isLoading = form.formState.isSubmitting;

  const getPasswordStrength = (password: string) => {
    const result = PasswordSchema.safeParse(password);
    const errorCount = result.success ? 0 : result.error.errors.length;
    return (
      ((PASSWORD_SCHEMA_CONDITIONS_COUNT - errorCount) /
        PASSWORD_SCHEMA_CONDITIONS_COUNT) *
      100
    );
  };

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Create an account
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Join our freelance marketplace with crypto payments
        </p>
      </div>

      <Card>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl className="relative">
                        <div>
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="John"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl className="relative">
                        <div>
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Doe"
                            className="pl-10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl className="relative">
                      <div>
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder="johndoe"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
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
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordStrength(
                              getPasswordStrength(e.target.value)
                            );
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      <div className="flex items-center gap-2">
                        <Progress value={passwordStrength} />
                        <span>{passwordStrength.toFixed(1)}%</span>
                      </div>
                      <span>Password strength</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
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

      <div className="mt-4 text-center text-xs text-muted-foreground max-w-3/4 mx-auto">
        <div>
          <UserCircle className="size-5 stroke-[1.125] inline-flex mr-2" />
          By signing up, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "inline p-0 m-0 text-xs",
              })
            )}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className={cn(
              buttonVariants({
                variant: "link",
                className: "inline p-0 m-0 text-xs",
              })
            )}
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </main>
  );
}
