"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff, Download, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecoveryPhraseDisplayProps {
  mnemonic: string[];
  publicKey: string;
  onNext: () => void;
}

export default function RecoveryPhraseDisplay({
  mnemonic,
  publicKey,
  onNext,
}: RecoveryPhraseDisplayProps) {
  const [showPhrase, setShowPhrase] = useState(false);
  const [copied, setCopied] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = `Blue Frog Wallet Recovery Information
Generated: ${new Date().toLocaleString()}

Wallet Address: ${publicKey}

Recovery Phrase:
${mnemonic.join(" ")}

IMPORTANT: 
- Keep this file secure and offline
- Never share your recovery phrase
- This is the only way to recover your wallet
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-recovery-${publicKey.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg">
        <h4 className="font-medium text-amber-700 dark:text-amber-400">
          Before continuing, ensure you have:
        </h4>
        <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
          <li>✓ Written down all 12 words in order</li>
          <li>✓ Stored them in a secure location</li>
          <li>✓ Made a backup copy</li>
          <li>✓ Never stored them digitally or online</li>
        </ul>
      </div>

      {/* Recovery phrase display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Your Recovery Phrase</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPhrase(!showPhrase)}
            >
              {showPhrase ? (
                <>
                  <EyeOff className="mr-1 h-3 w-3" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="mr-1 h-3 w-3" />
                  Show
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              disabled={!showPhrase}
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
            <Button size="sm" variant="outline" onClick={handleDownload}>
              <Download className="mr-1 h-3 w-3" />
              Save
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-3 gap-2 p-4 rounded-lg border-2 transition-all",
            showPhrase ? "border-primary/50 bg-muted/50" : "border-muted"
          )}
        >
          {mnemonic.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded bg-background"
            >
              <span className="text-xs text-muted-foreground w-5">
                {index + 1}.
              </span>
              <span
                className={cn(
                  "font-mono text-sm",
                  !showPhrase && "blur-sm select-none"
                )}
              >
                {showPhrase ? word : "•••••"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet address preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Wallet Address</h3>
        <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs break-all">
          {publicKey}
        </div>
      </div>

      {/* Acknowledgment checkbox */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5"
          />
          <span className="text-sm text-muted-foreground">
            I have safely stored my recovery phrase and understand that losing
            it means losing access to my wallet permanently.
          </span>
        </label>
      </div>

      <Button
        onClick={onNext}
        className="w-full"
        size="lg"
        disabled={!acknowledged}
      >
        Continue to Verification
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
