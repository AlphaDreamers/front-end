"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface WithdrawTabProps {
  balance: number;
}

export default function WithdrawTab({ balance }: WithdrawTabProps) {
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState("");

  // Network fee (fixed for demo)
  const networkFee = 0.000005;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
      setError("");
    }
  };

  const handleMaxAmount = () => {
    // Set max amount (balance - fee)
    const maxAmount = Math.max(0, balance - networkFee);
    setAmount(maxAmount.toFixed(6));
  };

  const validateForm = () => {
    if (!destinationAddress) {
      setError("Destination address is required");
      return false;
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    const amountValue = Number.parseFloat(amount);
    if (amountValue + networkFee > balance) {
      setError("Insufficient balance for this withdrawal");
      return false;
    }

    return true;
  };

  const handleWithdraw = () => {
    if (!validateForm()) return;

    setShowConfirmation(true);
  };

  const confirmWithdraw = () => {
    setIsWithdrawing(true);

    // Simulate withdrawal process
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowConfirmation(false);
      setDestinationAddress("");
      setAmount("");

      toast.success(
        JSON.stringify({
          title: "Withdrawal Successful",
          description: `${amount} SOL has been sent to the destination address`,
        })
      );
    }, 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Withdraw SOL</CardTitle>
          <CardDescription>
            Send SOL from your wallet to another address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination-address">Destination Address</Label>
              <Input
                id="destination-address"
                placeholder="Enter Solana wallet address"
                value={destinationAddress}
                onChange={(e) => {
                  setDestinationAddress(e.target.value);
                  setError("");
                }}
                className="bg-[#1A1A1A] border-primary/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount (SOL)</Label>
                <span className="text-sm text-muted-foreground">
                  Available: {balance.toFixed(6)} SOL
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  placeholder="0.0"
                  value={amount}
                  onChange={handleAmountChange}
                  className="bg-[#1A1A1A] border-primary/20"
                />
                <Button
                  variant="outline"
                  className="border-primary hover:bg-primary/20 hover:text-primary"
                  onClick={handleMaxAmount}
                >
                  Max
                </Button>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network Fee:</span>
                <span>{networkFee.toFixed(6)} SOL</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>
                  {amount
                    ? (Number.parseFloat(amount) + networkFee).toFixed(6)
                    : networkFee.toFixed(6)}{" "}
                  SOL
                </span>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500">Important</p>
                <p className="text-muted-foreground mt-1">
                  Double-check the destination address before confirming.
                  Transactions cannot be reversed once confirmed.
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 transition-all"
              onClick={handleWithdraw}
            >
              Withdraw SOL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-[#121212] border-primary/20">
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Please review the details of your withdrawal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{amount} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Fee:</span>
                <span>{networkFee.toFixed(6)} SOL</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span>Total:</span>
                <span className="text-primary">
                  {(Number.parseFloat(amount) + networkFee).toFixed(6)} SOL
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-muted-foreground">
                Destination Address:
              </span>
              <div className="bg-[#1A1A1A] p-2 rounded-md border border-primary/20 font-mono text-sm break-all">
                {destinationAddress}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-500">Warning</p>
                <p className="text-muted-foreground mt-1">
                  This action cannot be undone. Once confirmed, the SOL will be
                  sent to the destination address.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isWithdrawing}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmWithdraw}
              disabled={isWithdrawing}
              className="sm:w-auto w-full bg-primary hover:bg-primary/90 transition-all"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Withdrawal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
