"use client";

import { useState } from "react";
import { AlertCircle, Coins, CreditCard } from "lucide-react";

import { Button } from "./ui/button";
import { useWallets } from "./wallet/wallet-provider";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import PasswordInput from "./password-input";
import { useRouter } from "next/navigation";
import { createStripeCheckoutSession } from "@/lib/actions/stripe";

interface SolanaBuyButtonProps {
  orderId: string;
}

const SolanaBuyButton = ({ orderId }: SolanaBuyButtonProps) => {
  const { performTransaction } = useWallets();
  const [password, setPassword] = useState("");
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const { checkoutUrl } = await createStripeCheckoutSession(orderId);

      if (checkoutUrl) {
        push(checkoutUrl);
      }
    } catch (error) {
      console.error("Error processing Stripe payment:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="flex items-center gap-2 w-full">
        <DialogTrigger asChild>
          <Button className="flex-1 justify-start">
            <Coins />
            Pay with Solana
          </Button>
        </DialogTrigger>
        <Button
          variant="secondary"
          className="flex-1 justify-start"
          onClick={handleStripePayment}
          disabled={isLoading}
        >
          <CreditCard />
          Pay with Stripe
        </Button>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment for Order {orderId}</DialogTitle>
          <DialogDescription>
            Please enter your password to confirm the transaction. This will
            initiate the payment process using your main wallet.
          </DialogDescription>
        </DialogHeader>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm the transaction"
        />
        <DialogFooter>
          <Button
            onClick={() => {
              performTransaction(password, orderId);
            }}
          >
            Confirm Payment
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/wallets">Set Main Wallet</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SolanaBuyButton;
