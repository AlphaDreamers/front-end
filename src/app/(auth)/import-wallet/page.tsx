"use client";

import { useState } from "react";
import {
  Lock,
  Key,
  Loader2,
  Shield,
  AlertTriangle,
  Download,
  LockKeyhole,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Keypair } from "@solana/web3.js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import HiddenField from "@/components/hidden-field";
import PasswordInput from "@/components/password-input";
import PasswordStrengthIndicator from "@/components/password-strength-indicator";
import {
  encryptPrivateKey,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from "@/lib/utils";
import { addWallet } from "@/lib/actions";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { ImportWalletFormSchema } from "@/lib/schemas";

export default function ImportWalletPage() {
  const [walletData, setWalletData] = useState<{
    publicKey: string;
    mnemonic: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(ImportWalletFormSchema),
    defaultValues: {
      mnemonic: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ImportWalletFormSchema>) =>
    toast.promise(
      async () => {
        if (!bip39.validateMnemonic(values.mnemonic.trim())) {
          throw new Error(
            "Invalid mnemonic phrase. Please check your seed phrase and try again."
          );
        }

        const seed = await bip39.mnemonicToSeed(values.mnemonic.trim());

        const derivedSeed = derivePath(
          "m/44'/501'/0'/0'",
          seed.toString("hex")
        ).key;

        const keypair = Keypair.fromSeed(derivedSeed);

        const walletData = await encryptPrivateKey(
          keypair.secretKey,
          values.password
        );

        localStorage.setItem("wallet_data", JSON.stringify(walletData));

        await addWallet(keypair.publicKey.toBase58());

        return {
          publicKey: keypair.publicKey.toBase58(),
          mnemonic: values.mnemonic.trim(),
        };
      },
      {
        loading: "Importing wallet...",
        success: (walletData) => {
          setWalletData(walletData);

          return "Wallet imported successfully!";
        },
        error: (error) =>
          error instanceof Error ? error.message : "Failed to import wallet",
      }
    );

  const isLoading = form.formState.isSubmitting;

  const { strength: passwordStrength } = usePasswordStrength(
    form.watch("password")
  );

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Import Solana Wallet
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use your secret recovery phrase to import an existing Solana wallet.
          Ensure you have the correct phrase before proceeding.
        </p>
      </div>

      {walletData === null ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="mnemonic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Key size={16} />
                        Recovery Phrase
                        <span className="text-xs text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your secret recovery phrase"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the secret phrase you received when creating your
                        wallet.
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
                        <LockKeyhole size={16} />
                        New Wallet Password
                        <span className="text-xs text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••••••" {...field} />
                      </FormControl>
                      <PasswordStrengthIndicator
                        strength={passwordStrength}
                        color={getPasswordStrengthColor(passwordStrength)}
                        label={getPasswordStrengthLabel(passwordStrength)}
                      />
                      <FormDescription>
                        Create a new password to encrypt your wallet on this
                        device.
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
                        <Lock size={16} />
                        Confirm Password
                        <span className="text-xs text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Re-enter your password to confirm it matches.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Importing Wallet...
                    </>
                  ) : (
                    <>
                      <Download />
                      Import Wallet
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      ) : (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="inline h-6 w-6 text-green-600" />
              Wallet Created Successfully!
            </CardTitle>
            <CardDescription>
              Your wallet has been generated. Please save your recovery
              information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle />
              <AlertTitle>Critical Security Information</AlertTitle>
              <AlertDescription>
                Your recovery phrase is the only way to restore access to your
                wallet. Store it securely offline and never share it with
                anyone.
              </AlertDescription>
            </Alert>

            <HiddenField
              label="Recovery Phrase"
              icon={Key}
              value={walletData.mnemonic}
              variant={1}
            />

            <HiddenField
              label="Solana Wallet Address"
              icon={Key}
              value={walletData.publicKey}
              variant={3}
            />
          </CardContent>

          <CardFooter>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({}), "w-full")}
            >
              Continue to Dashboard
              <ArrowRight />
            </Link>
          </CardFooter>
        </Card>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield size={16} />
        <span>Secured with end-to-end encryption</span>
      </div>
    </main>
  );
}
