"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Shield } from "lucide-react";

import { encryptPrivateKey } from "@/lib/utils";
import { createWallet } from "@/lib/actions";
import WalletDetailsForm from "@/components/wallet/create/wallet-details-form";
import RecoveryPhraseDisplay from "@/components/wallet/create/recovery-phrase-display";
import VerifyMnemonicForm from "@/components/wallet/create/verify-mneumonics-form";
import StepIndicator from "@/components/step-indicator";

export default function CreateWalletPage() {
  const { push } = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [walletData, setWalletData] = useState<{
    publicKey: string;
    mnemonic: string[];
    name: string;
    encryptedWalletData: Awaited<ReturnType<typeof encryptPrivateKey>>;
  } | null>(null);

  // Handle wallet creation
  const handleCreateWallet = async (values: {
    name: string;
    password: string;
  }) => {
    toast.promise(
      async () => {
        const mnemonic = generateMnemonic(128);
        const seed = await mnemonicToSeed(mnemonic);
        const derivedSeed = derivePath(
          "m/44'/501'/0'/0'",
          seed.toString("hex")
        ).key;
        const keypair = Keypair.fromSeed(derivedSeed);
        const encryptedWalletData = await encryptPrivateKey(
          keypair.secretKey,
          values.password
        );

        return {
          publicKey: keypair.publicKey.toBase58(),
          mnemonic: mnemonic.split(" "),
          name: values.name,
          encryptedWalletData,
        };
      },
      {
        loading: "Creating wallet...",
        success: (data) => {
          setWalletData(data);
          setStep(2);
          return "Wallet generated successfully!";
        },
        error: (error) => error.message || "Failed to create wallet",
      }
    );
  };

  const handleVerifyMnemonic = async (values: { mnemonic: string[] }) => {
    if (!walletData) throw new Error("Wallet data missing.");

    toast.promise(
      async () => {
        const isValid = values.mnemonic.every(
          (word, i) => word === walletData.mnemonic[i]
        );
        if (!isValid) throw new Error("Mnemonic words do not match.");

        localStorage.setItem(
          `wallet_data_${walletData.publicKey}`,
          JSON.stringify(walletData)
        );
        await createWallet({
          publicKey: walletData.publicKey,
          name: walletData.name,
        });
        return "Mnemonic verified successfully!";
      },
      {
        loading: "Verifying mnemonic...",
        success: (message) => {
          push("/dashboard/wallets");
          return message;
        },
        error: (error) => error.message || "Failed to verify mnemonic",
      }
    );
  };

  return (
    <main className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <StepIndicator steps={3} currentStep={step} className="mb-4" />
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Create a New Wallet
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Generate a secure wallet for your Solana assets, protected by a
          password and recovery phrase.
        </p>
      </div>

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

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Shield size={16} />
        <span>Secured with end-to-end encryption</span>
      </div>
    </main>
  );
}
