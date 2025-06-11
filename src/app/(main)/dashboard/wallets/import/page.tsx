// src/app/(auth)/import-wallet/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mnemonicToSeed, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Shield, ChevronLeft, CheckCircle } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { encryptPrivateKey } from "@/lib/utils";
import { createWallet } from "@/lib/actions/wallet";
import { ImportWalletFormSchema } from "@/lib/schemas";
import AuthCard from "@/components/templates/auth-card";
import StepIndicator from "@/components/forms/step-indicator";
import ImportWalletForm from "@/components/wallet/import/import-wallet-form";
import WalletPreview from "@/components/wallet/import/wallet-preview";

const STEP_TITLES = {
  1: "Import your wallet",
  2: "Confirm wallet details",
};

const STEP_DESCRIPTIONS = {
  1: "Enter your secret recovery phrase and set a password",
  2: "Review your wallet information before importing",
};

type ImportWalletStep = 1 | 2;

interface ImportedWalletData {
  publicKey: string;
  name: string;
  encryptedWalletData: Awaited<ReturnType<typeof encryptPrivateKey>>;
}

export default function ImportWalletPage() {
  const router = useRouter();
  const [step, setStep] = useState<ImportWalletStep>(1);
  const [walletData, setWalletData] = useState<ImportedWalletData | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImportWallet = async (
    values: z.infer<typeof ImportWalletFormSchema>
  ) => {
    // Validate mnemonic
    if (!validateMnemonic(values.mnemonic.trim())) {
      throw new Error(
        "Invalid recovery phrase. Please check your words and try again."
      );
    }

    // Derive keypair from mnemonic
    const seed = await mnemonicToSeed(values.mnemonic.trim());
    const derivedSeed = derivePath(
      "m/44'/501'/0'/0'",
      seed.toString("hex")
    ).key;
    const keypair = Keypair.fromSeed(derivedSeed);

    // Encrypt the private key
    const encryptedWalletData = await encryptPrivateKey(
      keypair.secretKey,
      values.password
    );

    const data: ImportedWalletData = {
      publicKey: keypair.publicKey.toBase58(),
      name: values.name,
      encryptedWalletData,
    };

    setWalletData(data);
    setStep(2);
  };

  const handleConfirmImport = async () => {
    if (!walletData) {
      throw new Error("Wallet data missing");
    }

    // Store encrypted wallet data in localStorage
    localStorage.setItem(
      `wallet_data_${walletData.publicKey}`,
      JSON.stringify(walletData.encryptedWalletData)
    );

    await createWallet({
      publicKey: walletData.publicKey,
      name: walletData.name,
    });

    setIsSuccess(true);

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/wallets");
    }, 2000);
  };

  // Success state
  if (isSuccess) {
    return (
      <AuthCard
        title="Wallet Imported Successfully!"
        description="Your wallet is ready to use"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your wallet "{walletData?.name}" has been imported and encrypted.
            </p>
            <p className="text-xs text-muted-foreground">
              Redirecting to your wallets...
            </p>
          </div>

          <Button
            onClick={() => router.push("/wallets")}
            className="w-full"
            variant="outline"
          >
            Go to Wallets
          </Button>
        </div>
      </AuthCard>
    );
  }

  const canGoBack = step === 2;

  return (
    <AuthCard
      title={STEP_TITLES[step]}
      description={STEP_DESCRIPTIONS[step]}
      footer={
        <>
          <StepIndicator steps={2} currentStep={step} className="w-full" />

          {step === 1 && (
            <div className="w-full text-center">
              <span className="text-sm text-muted-foreground">
                Don't have a wallet?{" "}
              </span>
              <Button
                variant="link"
                onClick={() => router.push("/create-wallet")}
                className="text-sm font-medium p-0 h-auto"
              >
                Create new wallet
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your keys are encrypted and stored locally</span>
          </div>
        </>
      }
    >
      {/* Navigation header for step 2 */}
      {canGoBack && (
        <div className="mb-4 -mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      {/* Step content */}
      {step === 1 && <ImportWalletForm onSubmit={handleImportWallet} />}

      {step === 2 && walletData && (
        <WalletPreview
          publicKey={walletData.publicKey}
          name={walletData.name}
          onConfirm={handleConfirmImport}
        />
      )}
    </AuthCard>
  );
}
