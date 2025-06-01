// src/components/wallet/create/wallet-details-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wallet, Lock, ArrowRight, KeyRound } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { CreateNewWalletFormSchema } from "@/lib/schemas";
import { calculatePasswordStrength } from "@/lib/utils";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";

interface WalletDetailsFormProps {
  onSubmit: (
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => Promise<void>;
}

export default function WalletDetailsForm({
  onSubmit,
}: WalletDetailsFormProps) {
  const { isLoading, handleSubmit } =
    useAuthForm<z.infer<typeof CreateNewWalletFormSchema>>();

  const form = useForm({
    resolver: zodResolver(CreateNewWalletFormSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = calculatePasswordStrength(password);

  const handleFormSubmit = (
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => {
    handleSubmit(onSubmit, values, {
      successMessage: "Wallet generated successfully!",
      onError: (error) => {
        form.setError("root", { message: error.message });
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormInput
          control={form.control}
          name="name"
          label="Wallet Name"
          placeholder="My Solana Wallet"
          icon={Wallet}
          description="Choose a name to identify this wallet"
          required
        />

        <div className="space-y-2">
          <FormInput
            control={form.control}
            name="password"
            label="Wallet Password"
            type="password"
            placeholder="Create a strong password"
            icon={Lock}
            description="This password encrypts your wallet on this device"
            required
          />

          {password && (
            <PasswordStrengthIndicator
              strength={passwordStrength}
              color={
                passwordStrength < 50
                  ? "text-red-500"
                  : passwordStrength < 75
                    ? "text-amber-500"
                    : "text-green-500"
              }
              label={
                passwordStrength < 50
                  ? "Weak"
                  : passwordStrength < 75
                    ? "Good"
                    : "Strong"
              }
            />
          )}
        </div>

        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          icon={KeyRound}
          required
        />

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Creating wallet...
            </>
          ) : (
            <>
              Create Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
