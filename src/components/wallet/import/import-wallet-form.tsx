// src/components/wallet/import/import-wallet-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Key, Lock, Wallet, ArrowRight, AlertCircle } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FormInput from "@/components/auth/form-fields";
import { useAuthForm } from "@/hooks/use-auth-state";
import { ImportWalletFormSchema } from "@/lib/schemas";
import { calculatePasswordStrength } from "@/lib/utils";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";

interface ImportWalletFormProps {
  onSubmit: (values: z.infer<typeof ImportWalletFormSchema>) => Promise<void>;
}

export default function ImportWalletForm({ onSubmit }: ImportWalletFormProps) {
  const { isLoading, handleSubmit } =
    useAuthForm<z.infer<typeof ImportWalletFormSchema>>();
  const [showMnemonic, setShowMnemonic] = useState(false);

  const form = useForm({
    resolver: zodResolver(ImportWalletFormSchema),
    defaultValues: {
      mnemonic: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = calculatePasswordStrength(password);

  const handleFormSubmit = (values: z.infer<typeof ImportWalletFormSchema>) => {
    handleSubmit(onSubmit, values, {
      successMessage: "Wallet validated successfully!",
      onError: (error) => {
        form.setError("root", { message: error.message });
      },
    });
  };

  // Helper function to format mnemonic input
  const handleMnemonicChange = (value: string) => {
    // Remove extra spaces and normalize
    const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();

    form.setValue("mnemonic", normalized);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enter your 12-24 word recovery phrase exactly as it was given to
            you. Make sure there are no extra spaces or typos.
          </AlertDescription>
        </Alert>

        <FormField
          control={form.control}
          name="mnemonic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Recovery Phrase
                  <span className="text-destructive">*</span>
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="h-auto p-0 text-xs"
                >
                  {showMnemonic ? "Hide" : "Show"}
                </Button>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your 12-24 word recovery phrase"
                  className="min-h-[100px] font-mono text-sm"
                  onChange={(e) => handleMnemonicChange(e.target.value)}
                  style={
                    {
                      WebkitTextSecurity: showMnemonic ? "none" : "disc",
                      fontFamily: showMnemonic ? "monospace" : "inherit",
                    } as React.CSSProperties
                  }
                />
              </FormControl>
              <FormDescription>
                Enter all words separated by spaces, in the exact order
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormInput
          control={form.control}
          name="name"
          label="Wallet Name"
          placeholder="Imported Wallet"
          icon={Wallet}
          description="Choose a name to identify this wallet"
          required
        />

        <div className="space-y-2">
          <FormInput
            control={form.control}
            name="password"
            label="New Password"
            type="password"
            placeholder="Create a password for this device"
            icon={Lock}
            description="This password will encrypt your wallet locally"
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
          icon={Lock}
          required
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || passwordStrength < 50}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Validating wallet...
            </>
          ) : (
            <>
              Import Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
