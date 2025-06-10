"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { decode } from "bs58"; // Import bs58 for decoding the secret key
import { AlertCircle } from "lucide-react";

import { Button } from "./ui/button";
import { useWallets } from "./wallet/wallet-provider";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface SolanaBuyButtonProps {
  recipient: string;
  orderId: string;
  numberOfSol: number;
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
        <Textarea
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password to confirm the transaction"
          rows={4}
          className="mb-4"
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
