"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

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

interface SolanaBuyButtonProps {
  orderId: string;
}

const SolanaBuyButton = ({ orderId }: SolanaBuyButtonProps) => {
  const { performTransaction } = useWallets();
  const [password, setPassword] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="justify-start">
          <AlertCircle />
          Pay
        </Button>
      </DialogTrigger>
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
