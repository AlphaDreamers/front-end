"use client";

import { encode, decode } from "bs58";
import type React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Key,
  Loader2,
  Shield,
  AlertTriangle,
  Eye,
  Copy,
  EyeOff,
  Check,
  LucideIcon,
  Download,
  UserPlus,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Keypair } from "@solana/web3.js";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CreateNewWalletFormSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    (schema) => {
      return schema.password === schema.confirmPassword;
    },
    {
      message: "Passwords do not match",
    }
  );

const createNewWalletFormDefaultValues: z.infer<
  typeof CreateNewWalletFormSchema
> = {
  password: "",
  confirmPassword: "",
};

const ImportWalletFormSchema = z
  .object({
    mnemonic: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    (schema) => {
      return schema.password === schema.confirmPassword;
    },
    {
      message: "Passwords do not match",
    }
  );

const importWalletFormDefaultValues: z.infer<typeof ImportWalletFormSchema> = {
  mnemonic: "",
  password: "",
  confirmPassword: "",
};

export default function Wallet() {
  const router = useRouter();

  const [data, setData] = useState<{
    solana: string;
    mnemonic: string;
  } | null>(null);

  const createForm = useForm({
    resolver: zodResolver(CreateNewWalletFormSchema),
    defaultValues: createNewWalletFormDefaultValues,
  });

  const onCreateSubmit = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => {
    toast.promise(
      async () => {
        const keyPair = Keypair.generate();
        localStorage.setItem(
          "wallet_key",
          JSON.stringify({
            publicKeyBase58: keyPair.publicKey.toBase58(),
            secretKeyBase58: encode(keyPair.secretKey),
          })
        );

        return {
          solana: keyPair.publicKey.toBase58(),
          mnemonic: encode(keyPair.secretKey),
        };
      },
      {
        loading: "Creating wallet...",
        success: (data) => {
          setData(data);

          return "Wallet created successfully!";
        },
        error: (error) => `Error creating wallet: ${error}`,
      }
    );
  };

  const importForm = useForm({
    resolver: zodResolver(ImportWalletFormSchema),
    defaultValues: importWalletFormDefaultValues,
  });

  const onImportSubmit = async (
    values: z.infer<typeof ImportWalletFormSchema>
  ) => {
    toast.promise(
      async () => {
        const importSecretKeyBase58 = values.mnemonic;
        const importedKeypair = Keypair.fromSecretKey(
          decode(importSecretKeyBase58)
        );
        localStorage.setItem(
          "wallet_key",
          JSON.stringify({
            publicKeyBase58: importedKeypair.publicKey.toBase58(),
            secretKeyBase58: encode(importedKeypair.secretKey),
          })
        );

        return {
          solana: importedKeypair.publicKey.toBase58(),
          mnemonic: importSecretKeyBase58,
        };
      },
      {
        loading: "Importing wallet...",
        success: (data) => {
          setData(data);

          return "Wallet imported successfully!";
        },
        error: (error) => `Error importing wallet: ${error}`,
      }
    );
  };

  const isLoading =
    createForm.formState.isSubmitting || importForm.formState.isSubmitting;

  return (
    <main className="max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight"> Wallet Setup</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create or import your Ethereum wallet
        </p>
      </div>

      <Tabs defaultValue="create">
        <TabsList className="w-full">
          <TabsTrigger value="create" disabled={isLoading || data !== null}>
            <UserPlus size={16} className="text-primary mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger value="import" disabled={isLoading || data !== null}>
            <Download size={16} className="text-primary mr-2" />
            Import
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent>
            <TabsContent value="create" className="space-y-2 mb-4">
              {data === null ? (
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
                    <div className="space-y-4">
                      <FormField
                        control={createForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Lock size={16} className="text-primary" />
                              Password
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
                      <FormField
                        control={createForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Lock size={16} className="text-primary" />
                              Confirm Password
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

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={16} />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Key size={16} className="mr-2" />
                            Create Wallet
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <Alert className="bg-amber-50">
                    <AlertTriangle size={24} className="text-amber-500" />
                    <AlertTitle>Important Security Notice</AlertTitle>
                    <AlertDescription>
                      Your recovery phrase is the only way to restore your
                      wallet. Write it down and keep it in a secure location.
                    </AlertDescription>
                  </Alert>

                  <HiddenField
                    label="Recovery Phrase"
                    icon={Key}
                    value={data?.mnemonic}
                    variant={1}
                  />

                  <HiddenField
                    label="Solana Address"
                    icon={Key}
                    value={data?.solana}
                    variant={3}
                  />

                  <Button
                    className="w-full mt-4"
                    onClick={() => router.push("/dashboard")}
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="import">
              {data === null ? (
                <Form {...importForm}>
                  <form
                    onSubmit={importForm.handleSubmit(onImportSubmit)}
                    className="space-y-2 mb-4"
                  >
                    <FormField
                      control={importForm.control}
                      name="mnemonic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Lock size={16} className="text-primary" />
                            Mnemonic
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your mnemonic"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={importForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Lock size={16} className="text-primary" />
                            Password
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
                    <FormField
                      control={importForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Lock size={16} className="text-primary" />
                            Confirm Password
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={16} />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Download size={16} className="mr-2" />
                          Import Wallet
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <Alert className="bg-amber-50">
                    <AlertTriangle size={24} className="text-amber-500" />
                    <AlertTitle>Important Security Notice</AlertTitle>
                    <AlertDescription>
                      Your recovery phrase is the only way to restore your
                      wallet. Write it down and keep it in a secure location.
                    </AlertDescription>
                  </Alert>

                  <HiddenField
                    label="Recovery Phrase"
                    icon={Key}
                    value={data.mnemonic}
                    variant={1}
                  />

                  <HiddenField
                    label="Solana Address"
                    icon={Key}
                    value={data.solana}
                    variant={3}
                  />

                  <Button
                    className="w-full mt-4"
                    onClick={() => router.push("/dashboard")}
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <div className="mt-4 flex items-center gap-2 justify-center text-sm text-muted-foreground">
        <Shield size={16} />
        Secure verification with end-to-end encryption
      </div>
    </main>
  );
}
interface HiddenFieldProps {
  label: string;
  value: string;
  icon: LucideIcon;
  variant?: 1 | 2 | 3 | 4 | 5;
}

const HiddenField = ({
  label,
  value,
  icon: Icon,
  variant = 2,
}: HiddenFieldProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          <Icon
            size={16}
            className={cn({
              "text-blue-500": variant === 1,
              "text-purple-500": variant === 2,
              "text-green-500": variant === 3,
              "text-amber-500": variant === 4,
              "text-red-500": variant === 5,
            })}
          />
          {label}
        </Label>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(value);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {isCopied ? (
              <Check size={16} className="text-primary" />
            ) : (
              <Copy size={16} />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div
          className={cn(
            "p-2 bg-accent rounded font-mono text-sm flex-1 text-wrap",
            {
              "text-blue-500": variant === 1,
              "text-purple-500": variant === 2,
              "text-green-500": variant === 3,
              "text-amber-500": variant === 4,
              "text-red-500": variant === 5,
            }
          )}
        >
          {isVisible ? value : "••••••••••••••••••••••••"}
        </div>
      </div>
    </div>
  );
};
