"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Shield, ChevronLeft } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn, encryptPrivateKey } from "@/lib/utils";
import { createWallet } from "@/lib/actions/wallet";
import AuthCard from "@/components/templates/auth-card";
import StepIndicator from "@/components/forms/step-indicator";
import WalletDetailsForm from "@/components/wallet/create/wallet-details-form";
import RecoveryPhraseDisplay from "@/components/wallet/create/recovery-phrase-display";
import VerifyMnemonicForm from "@/components/wallet/create/verify-mneumonics-form";
import { z } from "zod";
import {
  CreateNewWalletFormSchema,
  MneumonicsVerificationFormSchema,
} from "@/lib/schemas";
import Link from "next/link";

const STEP_TITLES = {
  1: "Set up your wallet",
  2: "Save your recovery phrase",
  3: "Verify your recovery phrase",
};

const STEP_DESCRIPTIONS = {
  1: "Choose a name and secure password for your new wallet",
  2: "Write down these words in order. You'll need them to recover your wallet",
  3: "Confirm you've saved your recovery phrase correctly",
};

type WalletCreationStep = 1 | 2 | 3;

interface WalletData {
  publicKey: string;
  mnemonic: string[];
  name: string;
  encryptedWalletData: Awaited<ReturnType<typeof encryptPrivateKey>>;
}

export default function CreateWalletPage() {
  const router = useRouter();
  const [step, setStep] = useState<WalletCreationStep>(1);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleCreateWallet = async (
    values: z.infer<typeof CreateNewWalletFormSchema>
  ) => {
    const mnemonic = generateMnemonic(128);
    const seed = await mnemonicToSeed(mnemonic); // BIP39 seed

    const { key } = derivePath("m/44'/501'/0'/0'", seed.toString("hex"));
    const keypair = Keypair.fromSeed(key.slice(0, 32)); // ✅ FIXED

    const encryptedWalletData = await encryptPrivateKey(
      keypair.secretKey,
      values.password
    );

    const data: WalletData = {
      publicKey: keypair.publicKey.toBase58(),
      mnemonic: mnemonic.split(" "),
      name: values.name,
      encryptedWalletData,
    };

    setWalletData(data);
    setStep(2);
  };

  const handleVerifyMnemonic = async (
    values: z.infer<typeof MneumonicsVerificationFormSchema>
  ) => {
    if (!walletData) {
      throw new Error("Wallet data missing");
    }

    const isValid = values.mnemonic.every(
      (word, i) => word === walletData.mnemonic[i]
    );

    if (!isValid) {
      throw new Error("Recovery phrase doesn't match. Please try again.");
    }

    // Store encrypted wallet data
    localStorage.setItem(
      `wallet_data_${walletData.publicKey}`,
      JSON.stringify(walletData.encryptedWalletData)
    );

    // Create wallet in database
    await createWallet(walletData.publicKey, walletData.name);

    router.push("/wallets");
  };

  const canGoBack = step > 1 && step < 3; // Can't go back from verification

  return (
    <AuthCard
      title={STEP_TITLES[step]}
      description={STEP_DESCRIPTIONS[step]}
      footer={
        <>
          <StepIndicator steps={3} currentStep={step} className="w-full" />

          {step === 1 && (
            <div className="w-full text-center">
              <span className="text-sm text-muted-foreground">
                Already have a wallet?{" "}
              </span>
              <Link
                href="/import-wallet"
                className={cn(
                  buttonVariants({
                    variant: "link",
                  }),
                  "text-sm font-medium p-0 h-auto"
                )}
              >
                Import existing wallet
              </Link>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Your keys are encrypted and stored locally</span>
          </div>
        </>
      }
    >
      {/* Navigation header for steps 2 and 3 */}
      {canGoBack && (
        <div className="mb-4 -mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((step - 1) as WalletCreationStep)}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}

      {/* Step content */}
      {step === 1 && <WalletDetailsForm onSubmit={handleCreateWallet} />}

      {step === 2 && walletData && (
        <RecoveryPhraseDisplay
          mnemonic={walletData.mnemonic}
          publicKey={walletData.publicKey}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && walletData && (
        <VerifyMnemonicForm
          onSubmit={handleVerifyMnemonic}
          mnemonic={walletData.mnemonic}
        />
      )}
    </AuthCard>
  );
}
