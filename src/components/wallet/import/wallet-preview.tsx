"use client";

import { useState } from "react";
import { Copy, Check, Wallet, AlertTriangle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface WalletPreviewProps {
  publicKey: string;
  name: string;
  onConfirm: () => Promise<void>;
}

export default function WalletPreview({
  publicKey,
  name,
  onConfirm,
}: WalletPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async () =>
    toast.promise(
      async () => {
        setIsLoading(true);
        await onConfirm();
      },
      {
        loading: "Importing wallet...",
        success: () => {
          setIsLoading(false);
          return "Wallet imported successfully!";
        },
        error: (error) => {
          setIsLoading(false);
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          return message;
        },
      }
    );

  return (
    <div className="space-y-6">
      <Alert className="border-green-500/50 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>Wallet found!</strong> Review the details below before
          importing.
        </AlertDescription>
      </Alert>

      {/* Wallet Name */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Wallet Name
        </h3>
        <div className="p-3 rounded-lg bg-muted/50 font-medium">{name}</div>
      </div>

      {/* Wallet Address */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Wallet Address</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="h-7 text-xs"
          >
            {copied ? (
              <>
                <Check className="mr-1 h-3 w-3 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" />
                Copy
              </>
            )}
          </Button>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs break-all">
          {publicKey}
        </div>
      </div>

      {/* Security Notice */}
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-sm">
          <strong>Important:</strong> Make sure this is the correct wallet
          address. Once imported, your private key will be encrypted and stored
          locally on this device.
        </AlertDescription>
      </Alert>

      {/* Confirmation Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onSubmit}
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Importing wallet...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Import
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By importing this wallet, you confirm that you have securely stored
          your recovery phrase and understand the risks.
        </p>
      </div>
    </div>
  );
}
