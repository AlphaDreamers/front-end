// src/components/wallet/import/import-wallet-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Key,
  Lock,
  Wallet,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
import { ImportWalletFormSchema } from "@/lib/schemas";
import { calculatePasswordStrength } from "@/lib/utils";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/password-input";
import { toast } from "sonner";

interface ImportWalletFormProps {
  onSubmit: (values: z.infer<typeof ImportWalletFormSchema>) => Promise<void>;
}

export default function ImportWalletForm({ onSubmit }: ImportWalletFormProps) {
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
  const onFormSubmit = async (values: z.infer<typeof ImportWalletFormSchema>) =>
    toast.promise(async () => onSubmit(values), {
      loading: "Validating wallet...",
      success: "Wallet validated successfully!",
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
  const password = form.watch("password");
  const passwordStrength = calculatePasswordStrength(password);

  // Helper function to format mnemonic input
  const handleMnemonicChange = (value: string) => {
    // Remove extra spaces and normalize
    const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();

    form.setValue("mnemonic", normalized);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet Name
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Imported Wallet" />
              </FormControl>
              <FormDescription>
                Choose a name to identify this wallet
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                New Password
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="flex flex-col gap-1">
                  <PasswordInput
                    {...field}
                    placeholder="Create a password for this device"
                  />
                  <PasswordStrengthIndicator strength={passwordStrength} />
                </div>
              </FormControl>
              <FormDescription>
                This password will encrypt your wallet locally
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
              <FormLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password
                <span className="text-destructive">*</span>
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
              Validating wallet...
            </>
          ) : (
            <>
              Import Wallet
              <ArrowRight />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
