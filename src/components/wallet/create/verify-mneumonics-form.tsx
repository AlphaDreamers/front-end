"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, RefreshCw, CheckCircle } from "lucide-react";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { MneumonicsVerificationFormSchema } from "@/lib/schemas";
import { toast } from "sonner";

interface VerifyMnemonicFormProps {
  onSubmit: (values: { mnemonic: string[] }) => Promise<void>;
  mnemonic: string[];
}

export default function VerifyMnemonicForm({
  onSubmit,
  mnemonic,
}: VerifyMnemonicFormProps) {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [verificationIndices, setVerificationIndices] = useState<number[]>([]);

  const form = useForm({
    resolver: zodResolver(MneumonicsVerificationFormSchema),
    defaultValues: { mnemonic: [] },
  });
  const onFormSubmit = async (
    values: z.infer<typeof MneumonicsVerificationFormSchema>
  ) =>
    toast.promise(
      async () => {
        const isValid = verificationIndices.every(
          (index, i) => selectedWords[i] === mnemonic[index]
        );

        if (!isValid) {
          form.setError("mnemonic", {
            message:
              "The words don't match the correct positions. Please try again.",
          });
          return;
        }
        onSubmit(values);
      },
      {
        loading: "Verifying mnemonic...",
        success: () => "Mnemonic verified successfully!",
        error: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          form.setError("root", { message });
          return message;
        },
      }
    );
  const isLoading = form.formState.isSubmitting;

  // Initialize with random subset verification (more user-friendly)
  useEffect(() => {
    // Pick 4 random positions to verify
    const indices = Array.from({ length: mnemonic.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .sort((a, b) => a - b);

    setVerificationIndices(indices);

    // Create shuffled words from only the positions we're verifying
    const wordsToVerify = indices.map((i) => mnemonic[i]);
    setShuffledWords([...wordsToVerify].sort(() => Math.random() - 0.5));
  }, [mnemonic]);

  const handleWordClick = (word: string, isSelected: boolean) => {
    if (isSelected) {
      // Remove word
      setSelectedWords((prev) => prev.filter((w) => w !== word));
    } else {
      // Add word
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <Alert>
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            Select the words in positions{" "}
            {verificationIndices.map((i) => i + 1).join(", ")}
            from your recovery phrase in the correct order.
          </AlertDescription>
        </Alert>

        {/* Selected words display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Your Selection</h3>
            {selectedWords.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={handleReset}
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {verificationIndices.map((index, i) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                  selectedWords[i]
                    ? "border-primary bg-primary/10"
                    : "border-dashed border-muted-foreground/50"
                )}
              >
                <span className="text-sm text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="font-mono text-sm font-medium">
                  {selectedWords[i] || "Select word"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Word selection grid */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Available Words</h3>
          <div className="grid grid-cols-2 gap-2">
            {shuffledWords.map((word, index) => {
              const isSelected = selectedWords.includes(word);
              return (
                <Button
                  key={`${word}-${index}`}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleWordClick(word, isSelected)}
                  disabled={isSelected}
                  className={cn(
                    "justify-start font-mono",
                    isSelected && "opacity-50"
                  )}
                >
                  {isSelected && <CheckCircle className="mr-2 h-3 w-3" />}
                  {word}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Error display */}
        {form.formState.errors.mnemonic && (
          <Alert variant="destructive">
            <AlertDescription>
              {form.formState.errors.mnemonic.message}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={
            isLoading || selectedWords.length !== verificationIndices.length
          }
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Creating wallet...
            </>
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Complete Setup
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
