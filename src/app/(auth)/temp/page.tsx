"use client";

import type React from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Lock,
  Key,
  Loader2,
  Shield,
  Server,
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
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
import { COMMON_PASSWORDS } from "@/lib/common-passwords";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const CreateNewWalletFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .refine((val) => !COMMON_PASSWORDS.includes(val), {
        message: "Password is too common",
      }),
    confirmPassword: z.string(),
    storageOption: z.enum(["self", "rely"]),
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
  storageOption: "self",
};

const ImportWalletFormSchema = z
  .object({
    mnemonic: z.string(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      )
      .refine((val) => !COMMON_PASSWORDS.includes(val), {
        message: "Password is too common",
      }),
    confirmPassword: z.string(),
    storageOption: z.enum(["self", "rely"]),
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
  storageOption: "self",
};

export default function Wallet() {
  const router = useRouter();

  const [securityLevel, setSecurityLevel] = useState(0);
  const [data, setData] = useState<{
    ethereum: string;
    solana: string;
    mnemonic: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createForm = useForm({
    resolver: zodResolver(CreateNewWalletFormSchema),
    defaultValues: createNewWalletFormDefaultValues,
  });

  const onCreateSubmit = async (
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => {
    setIsLoading(true);

    toast.promise(
      async () => {
        try {
          // 1. Create Ethereum wallet
          const ethWallet = ethers.Wallet.createRandom();
          const mnemonic = ethWallet.mnemonic?.phrase || "";

          // 2. Generate Solana wallet from same mnemonic
          const seed = await bip39.mnemonicToSeed(mnemonic);
          const seedBuffer = Buffer.from(seed).slice(0, 32);
          const solKeypair = Keypair.fromSeed(seedBuffer);
          const solanaPublicKey = solKeypair.publicKey.toString();

          // Set the data state with all required information
          setData({
            ethereum: ethWallet.address,
            solana: solanaPublicKey,
            mnemonic: mnemonic,
          });

          // 3. Handle storage option
          if (values.storageOption === "rely") {
            const response = await fetch(
              "http://localhost:8085/api/auth/wallet",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ mnemonic }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to store recovery phrase.");
            }
          }

          // 4. Save publicKey locally
          localStorage.setItem(
            "solanaWallet",
            JSON.stringify({ publicKey: solanaPublicKey })
          );

          router.push("/dashboard");
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: "Creating wallet...",
        success: "Wallet created successfully!",
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
    setIsLoading(true);

    toast.promise(
      async () => {
        try {
          const ethWallet = ethers.Wallet.fromPhrase(values.mnemonic);

          const seed = await bip39.mnemonicToSeed(values.mnemonic);
          const seedBuffer = Buffer.from(seed).slice(0, 32);
          const solKeypair = Keypair.fromSeed(seedBuffer);
          const solanaPublicKey = solKeypair.publicKey.toString();

          // Set the data state with all required information
          setData({
            ethereum: ethWallet.address,
            solana: solanaPublicKey,
            mnemonic: values.mnemonic,
          });

          // Handle storage option
          if (values.storageOption === "rely") {
            const response = await fetch(
              "http://localhost:8085/api/auth/wallet",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ mnemonic: values.mnemonic }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to store recovery phrase.");
            }
          }

          localStorage.setItem(
            "solanaWallet",
            JSON.stringify({ publicKey: solanaPublicKey })
          );

          router.push("/dashboard");
        } catch (err) {
          importForm.setError("mnemonic", {
            type: "manual",
            message: "Invalid mnemonic phrase",
          });
          throw err;
        } finally {
          setIsLoading(false);
        }
      },
      {
        loading: "Importing wallet...",
        success: "Wallet imported successfully!",
        error: (error) => `Error importing wallet: ${error}`,
      }
    );
  };
  const validateSecurityLevel = (password: string) => {
    let level = 0;

    if (!password || password.length === 0) {
      setSecurityLevel(0);
      return;
    }

    if (password.length >= 8 && password.length <= 32) level++;
    if (/[a-z]/.test(password)) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password)) level++;
    if (/[^A-Za-z0-9]/.test(password)) level++;
    if (!COMMON_PASSWORDS.includes(password)) level++;

    setSecurityLevel(level);
  };

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
                                onChange={(e) => {
                                  validateSecurityLevel(e.target.value);
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            <FormDescription className="mb-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span>Password Security</span>
                                  <span>
                                    {
                                      [
                                        "Very Weak",
                                        "Weak",
                                        "Moderate",
                                        "Strong",
                                        "Very Strong",
                                        "Excellent",
                                        "Excellent",
                                        "Excellent",
                                      ][Math.min(securityLevel, 7)]
                                    }
                                  </span>
                                </div>
                                <Progress
                                  max={8}
                                  value={securityLevel * 12.5}
                                />
                              </div>
                            </FormDescription>
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

                      <FormField
                        control={createForm.control}
                        name="storageOption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <Lock size={16} className="text-primary" />
                              Storage Preference
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormItem>
                                  <Card className="py-2.5 rounded-sm">
                                    <CardContent className="flex items-center space-x-3 px-2">
                                      <FormControl>
                                        <RadioGroupItem value="self" />
                                      </FormControl>
                                      <div className="flex flex-col gap-2">
                                        <FormLabel>
                                          <Shield
                                            size={16}
                                            className="text-chart-1"
                                          />
                                          Self-custody
                                        </FormLabel>

                                        <FormDescription className="text-xs">
                                          I&apos;ll manage my own recovery
                                          phrase. I understand I&apos;m fully
                                          responsible for keeping it safe.
                                        </FormDescription>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </FormItem>
                                <FormItem>
                                  <Card className="py-3 rounded-sm">
                                    <CardContent className="flex items-center space-x-3 px-2">
                                      <FormControl>
                                        <RadioGroupItem value="rely" />
                                      </FormControl>
                                      <div className="flex flex-col gap-2">
                                        <FormLabel>
                                          <Server
                                            size={16}
                                            className="text-chart-3"
                                          />
                                          Service-managed
                                        </FormLabel>

                                        <FormDescription className="text-xs">
                                          Store my recovery phrase with the
                                          service. The phrase will be encrypted
                                          and stored securely.
                                        </FormDescription>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </FormItem>
                              </RadioGroup>
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

                  <Separator />

                  <HiddenField
                    label="Ethereum Address"
                    icon={Key}
                    value={data?.ethereum}
                    variant={2}
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
                              onChange={(e) => {
                                validateSecurityLevel(e.target.value);
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormDescription className="mb-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs">
                                <span>Password Security</span>
                                <span>
                                  {
                                    [
                                      "Very Weak",
                                      "Weak",
                                      "Moderate",
                                      "Strong",
                                      "Very Strong",
                                      "Excellent",
                                      "Excellent",
                                      "Excellent",
                                    ][Math.min(securityLevel, 7)]
                                  }
                                </span>
                              </div>
                              <Progress max={8} value={securityLevel * 12.5} />
                            </div>
                          </FormDescription>
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

                    <FormField
                      control={importForm.control}
                      name="storageOption"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <Lock size={16} className="text-primary" />
                            Storage Preference
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormItem>
                                <Card className="py-2.5 rounded-sm">
                                  <CardContent className="flex items-center space-x-3 px-2">
                                    <FormControl>
                                      <RadioGroupItem value="self" />
                                    </FormControl>
                                    <div className="flex flex-col gap-2">
                                      <FormLabel>
                                        <Shield
                                          size={16}
                                          className="text-chart-1"
                                        />
                                        Self-custody
                                      </FormLabel>

                                      <FormDescription className="text-xs">
                                        I&apos;ll manage my own recovery phrase.
                                        I understand I&apos;m fully responsible
                                        for keeping it safe.
                                      </FormDescription>
                                    </div>
                                  </CardContent>
                                </Card>
                              </FormItem>
                              <FormItem>
                                <Card className="py-3 rounded-sm">
                                  <CardContent className="flex items-center space-x-3 px-2">
                                    <FormControl>
                                      <RadioGroupItem value="rely" />
                                    </FormControl>
                                    <div className="flex flex-col gap-2">
                                      <FormLabel>
                                        <Server
                                          size={16}
                                          className="text-chart-3"
                                        />
                                        Service-managed
                                      </FormLabel>

                                      <FormDescription className="text-xs">
                                        Store my recovery phrase with the
                                        service. The phrase will be encrypted
                                        and stored securely.
                                      </FormDescription>
                                    </div>
                                  </CardContent>
                                </Card>
                              </FormItem>
                            </RadioGroup>
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

                  <Separator />

                  <HiddenField
                    label="Ethereum Address"
                    icon={Key}
                    value={data.ethereum}
                    variant={2}
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
          className={cn("p-2 bg-accent rounded font-mono text-sm flex-1", {
            "text-blue-500": variant === 1,
            "text-purple-500": variant === 2,
            "text-green-500": variant === 3,
            "text-amber-500": variant === 4,
            "text-red-500": variant === 5,
          })}
        >
          {isVisible ? value : "••••••••••••••••••••••••"}
        </div>
      </div>
    </div>
  );
};
