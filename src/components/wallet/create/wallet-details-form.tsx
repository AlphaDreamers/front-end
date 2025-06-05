"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Lock, ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CreateNewWalletFormSchema } from "@/lib/schemas";
import { calculatePasswordStrength } from "@/lib/utils";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import PasswordInput from "@/components/password-input";

interface WalletDetailsFormProps {
  onSubmit: (
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => Promise<void>;
}

export default function WalletDetailsForm({
  onSubmit: handleNextStep,
}: WalletDetailsFormProps) {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const form = useForm({
    resolver: zodResolver(CreateNewWalletFormSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof CreateNewWalletFormSchema>) =>
    toast.promise(async () => handleNextStep(values), {
      loading: "Creating wallet...",
      success: () => "Wallet generated successfully!",
      error: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        form.setError("root", { message });
        return message;
      },
    });
  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Wallet className="size-4" />
                Wallet Name
                <span className="text-xs text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="My Solana Wallet" />
              </FormControl>
              <FormDescription>
                This name will help you identify your wallet
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
                  Wallet Password
                  <span className="text-xs text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-1">
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
                <FormDescription>
                  This password encrypts your wallet on this device
                </FormDescription>
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
                Confirm Password
                <span className="text-xs text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Re-enter your password"
                />
              </FormControl>
              <FormDescription>
                Please re-enter your password to confirm
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Creating wallet...
            </>
          ) : (
            <>
              Create Wallet
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
