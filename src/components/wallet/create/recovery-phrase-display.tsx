"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowRight, CheckCircle, Key } from "lucide-react";

import HiddenField from "@/components/hidden-field";

interface RecoveryPhraseDisplayProps {
  mnemonic: string[];
  publicKey: string;
  onNext: () => void;
}

const RecoveryPhraseDisplay = ({
  mnemonic,
  publicKey,
  onNext,
}: RecoveryPhraseDisplayProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          Wallet Created Successfully!
        </CardTitle>
        <CardDescription>
          Save your recovery information securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Security Information</AlertTitle>
          <AlertDescription>
            Store your recovery phrase offline and never share it.
          </AlertDescription>
        </Alert>
        <HiddenField
          label="Recovery Phrase"
          value={mnemonic.join(" ")}
          variant={1}
          icon={Key}
        />
        <HiddenField
          label="Solana Wallet Address"
          value={publicKey}
          variant={3}
          icon={Key}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onNext}>
          Verify Recovery Phrase
          <ArrowRight className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
export default RecoveryPhraseDisplay;
