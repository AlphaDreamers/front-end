"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Loader2, LockKeyhole } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { usePasswordStrength } from "@/hooks/use-password-strength";
import { CreateNewWalletFormSchema } from "@/lib/schemas";
import {
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from "@/lib/utils";
import PasswordInput from "@/components/password-input";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import { z } from "zod";

interface WalletDetailsFormProps {
  onSubmit: (values: z.infer<typeof CreateNewWalletFormSchema>) => void;
}

const WalletDetailsForm = ({ onSubmit }: WalletDetailsFormProps) => {
  const form = useForm({
    resolver: zodResolver(CreateNewWalletFormSchema),
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;
  const { strength } = usePasswordStrength(form.watch("password"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Key size={16} className="inline mr-2" />
                    Wallet Name{" "}
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="My Solana Wallet" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a recognizable wallet name.
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
                  <FormLabel>
                    <LockKeyhole size={16} className="inline mr-2" />
                    Password <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="••••••••••••" {...field} />
                  </FormControl>
                  <PasswordStrengthIndicator
                    strength={strength}
                    color={getPasswordStrengthColor(strength)}
                    label={getPasswordStrengthLabel(strength)}
                  />
                  <FormDescription>
                    Choose a strong, memorable password.
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
                  <FormLabel>
                    <LockKeyhole size={16} className="inline mr-2" />
                    Confirm Password{" "}
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Re-enter your password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Creating Wallet...
                </>
              ) : (
                <>
                  <Key className="mr-2" />
                  Create Wallet
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
export default WalletDetailsForm;
