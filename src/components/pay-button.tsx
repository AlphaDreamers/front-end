"use client";

import { useState } from "react";
import { Coins, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { createStripeCheckoutSession } from "@/lib/actions/stripe";
import { useWallets } from "@/lib/store/wallet";
import { toast } from "sonner";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import PasswordInput from "./password-input";

interface PayButtonProps {
  order: {
    id: string;
    package: { price: number; title: string; gig: { title: string } };
  };
}

export default function PayButton({ order }: PayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { performTransaction, getSolToUsdRate } = useWallets();
  const { push } = useRouter();

  const priceInLamports = BigInt(
    Math.round(order.package.price * LAMPORTS_PER_SOL)
  );

  const totalInLamports = priceInLamports;

  const total = Number(totalInLamports) / LAMPORTS_PER_SOL;

  const usdRate = getSolToUsdRate();

  const totalInUsd: number | "N/A" = usdRate ? total * usdRate : "N/A";

  const handleStripePayment = async () => {
    if (isLoading) return;
    setIsLoading(true);
    toast.promise(
      async () => {
        if (totalInUsd === "N/A") {
          throw new Error("Unable to fetch USD rate for SOL payment.");
        }
        return await createStripeCheckoutSession(order.id, totalInUsd);
      },
      {
        loading: "Initiating payment...",
        success: ({ checkoutUrl }) => {
          if (checkoutUrl) {
            push(checkoutUrl);
          }
          setIsLoading(false);
          return "Redirecting to payment gateway...";
        },
        error: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Payment initiation failed";
          setIsLoading(false);
          return message;
        },
      }
    );
  };

  const handleSolanaPayment = async () => {
    if (isLoading) return;
    setIsLoading(false);
    toast.promise(
      async () => {
        await performTransaction(password, order.id);
        //const res = await performTransaction(password, order.id);
        //if (res.success === false) {
        //  throw new Error(res.error || "Transaction failed");
        //}
      },
      {
        loading: "Processing Solana payment...",
        success: () => {
          push(`/dashboard/orders/${order.id}/success`);
          setIsLoading(false);
          return "Payment successful!";
        },
        error: (error) => {
          const message =
            error instanceof Error ? error.message : "Transaction failed";
          setIsLoading(false);
          return message;
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex-1" disabled={isLoading}>
            <Coins />
            Pay with Solana
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Solana Payment</DialogTitle>
            <DialogDescription>
              Pay {total} SOL for <br />#{order.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Breakdown (Requirement 1) */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex justify-between">
                <span>
                  {order.package.gig.title} - {order.package.title}
                </span>
                <span>{order.package.price} SOL</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>{total} SOL</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Wallet Password</Label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your wallet password"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSolanaPayment} disabled={isLoading}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex-1" disabled={isLoading}>
            <CreditCard />
            Pay with Card
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Solana Payment</DialogTitle>
            <DialogDescription>
              Pay {totalInUsd} USD for <br />#{order.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Breakdown (Requirement 1) */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex justify-between">
                <span>
                  {order.package.gig.title} - {order.package.title}
                </span>
                <span>{totalInUsd} USD</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>{totalInUsd} USD</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleStripePayment}
              disabled={isLoading || totalInUsd === "N/A"}
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
