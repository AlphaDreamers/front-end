"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2, Key, AlertCircle } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { MneumonicsVerificationSchema } from "@/lib/schemas";
import { useMemo } from "react";

interface VerifyMnemonicFormProps {
  onSubmit: (values: { mnemonic: string[] }) => void;
  mnemonic: string[];
}

const SelectedWords = ({
  words,
  onRemove,
}: {
  words: string[];
  onRemove: (index: number) => void;
}) => {
  return (
    <div className="p-4 border-2 border-dashed rounded-lg bg-muted/20">
      <div className="text-sm font-medium text-muted-foreground mb-3">
        Your selected phrase:
      </div>
      {words.length === 0 ? (
        <div className="text-center text-muted-foreground/60">
          Click words below to build your recovery phrase
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <Button
              size="sm"
              key={`selected-${index}`}
              onClick={(e) => {
                e.preventDefault();
                onRemove(index);
              }}
            >
              {word}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component for selecting available words
function WordSelector({
  words,
  onSelect,
}: {
  words: string[];
  onSelect: (word: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {words.map((word, index) => (
        <Button
          variant="outline"
          size="sm"
          key={`available-${word}-${index}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect(word);
          }}
        >
          {word}
        </Button>
      ))}
    </div>
  );
}

export function VerifyMnemonicForm({
  onSubmit,
  mnemonic,
}: VerifyMnemonicFormProps) {
  const form = useForm({
    resolver: zodResolver(MneumonicsVerificationSchema),
    defaultValues: { mnemonic: [] },
  });

  const isLoading = form.formState.isSubmitting;

  const shuffledMneumonics = useMemo(() => {
    return mnemonic.sort(() => Math.random() - 0.5);
  }, [mnemonic]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            <FormField
              control={form.control}
              name="mnemonic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Shield size={16} className="inline mr-2" />
                    Verify Your Recovery Phrase{" "}
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <SelectedWords
                        words={field.value}
                        onRemove={(index) =>
                          field.onChange(
                            field.value.filter((_, i) => i !== index)
                          )
                        }
                      />
                      <WordSelector
                        words={shuffledMneumonics.filter(
                          (word) => !field.value.includes(word)
                        )}
                        onSelect={(word) =>
                          field.onChange([...field.value, word])
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        Select words in the exact order of your recovery phrase.
                        Remove mistakes by clicking them above.
                      </AlertDescription>
                    </Alert>
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
                  <Loader2 className="animate-spin mr-2" />
                  Verifying Mnemonic...
                </>
              ) : (
                <>
                  <Key className="mr-2" />
                  Verify Mnemonic
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
export default VerifyMnemonicForm;
