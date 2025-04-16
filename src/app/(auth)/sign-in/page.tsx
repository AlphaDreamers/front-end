"use client";

import type React from "react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const formSchemaDefaultValues: z.infer<typeof formSchema> = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formSchemaDefaultValues,
  });

  const onSubmit = (formValues: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    toast.promise(
      async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formValues),
            }
          );

          if (!res.ok) {
            throw new Error("Login failed");
          }

          const data = await res.json();

          if (!data.user_account_wallet) {
            console.log(data);

            push("/key");
          } else {
            push("/sign-up");
          }
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (error) => {
          return `Login failed: ${error}`;
        },
      }
    );
  };

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight"> Welcome back</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to access your secure wallet
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> Login</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-2 mb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Mail size={16} className="text-primary" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Lock size={16} className="text-primary" />
                        Password
                      </span>

                      <Link
                        href="/forgot-password"
                        className={cn(
                          buttonVariants({
                            variant: "link",
                          }),
                          "inline-flex h-fit p-0 text-xs m-0"
                        )}
                      >
                        Forgot password?
                      </Link>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="*********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-4 flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Lock size={16} />
        Secure verification with end-to-end encryption
      </div>
    </main>
  );
}
