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
  AtSign,
  KeyRound,
  Loader2,
  MapPin,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { calculatePasswordStrength, cn } from "@/lib/utils";
import { SignUpFormSchema } from "@/lib/schemas";
import { signUp } from "@/lib/actions/auth";
import AuthCard from "@/components/templates/auth-card";
import PasswordInput from "@/components/password-input";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import { COUNTRIES } from "@/lib/data/countries";

export default function SignUpPage() {
  const [passwordStrength, setPasswordStrength] = useState(0);
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
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof SignUpFormSchema>) =>
    toast.promise(async () => signUp(values), {
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
    });
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
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="size-4" />
                    First name
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="size-4" />
                    Last name
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" />
                  </FormControl>
                  <FormDescription />
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
                <FormLabel className="flex items-center gap-2">
                  <AtSign className="size-4" />
                  Username
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="johndoe" />
                </FormControl>
                <FormDescription>
                  This will be your public display name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    placeholder="john@example.com"
                  />
                </FormControl>
                <FormDescription>
                  We&apos;ll send you a verification email
                </FormDescription>
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
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="size-4" />
                    Password
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <PasswordInput
                        {...field}
                        placeholder="Create a strong password"
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordStrength(
                            calculatePasswordStrength(e.target.value)
                          );
                        }}
                      />
                      <PasswordStrengthIndicator strength={passwordStrength} />
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <KeyRound className="size-4" />
                  Confirm password
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Re-enter your password" />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  <MapPin className="size-4" />
                  Country
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? COUNTRIES.find(
                              (country) => country.code === field.value
                            )?.label
                          : "Select country"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search country..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No countries found.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.map((country) => (
                            <CommandItem
                              value={country.label}
                              key={country.code}
                              onSelect={() => {
                                form.setValue("country", country.code);
                              }}
                            >
                              {country.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  country.code === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This helps us provide localized content and services
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
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
