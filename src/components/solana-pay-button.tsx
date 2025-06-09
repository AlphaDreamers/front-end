"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import {
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
import { confirmPayment } from "@/lib/actions/order";

interface SolanaBuyButtonProps {
  recipient: string;
  orderId: string;
  numberOfSol: number;
}

const SolanaBuyButton = ({
  orderId,
  numberOfSol,
  recipient,
}: SolanaBuyButtonProps) => {
  const [keypair, setKeypair] = useState<Keypair | null>(null);
  const { connection } = useConnection();

  // Load the keypair from localStorage when the component mounts
  useEffect(() => {
    const stored = localStorage.getItem("wallet_key");
    if (!stored) {
      console.error("Wallet not found in localStorage");
      return;
    }

    const { secretKeyBase58 } = JSON.parse(stored);
    try {
      const secretKey = decode(secretKeyBase58); // Decode the base58-encoded secret key
      const walletKeypair = Keypair.fromSecretKey(secretKey);
      setKeypair(walletKeypair);
    } catch (error) {
      console.error("Failed to create keypair from stored keys", error);
    }
  }, []);

  // Function to send SOL
  const sendSol = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!keypair) {
      console.error("Wallet not connected or keypair not loaded");
      return;
    }

    try {
      // Create the recipient's public key
      const recipientPubKey = new PublicKey(recipient);

      // Create a new transaction
      const transaction = new Transaction();

      // Create the transfer instruction
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: recipientPubKey,
        lamports: numberOfSol * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      // Get the latest blockhash and set the fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = keypair.publicKey;

      // Sign and send the transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );

      console.log("Transaction successful! Signature:", signature);

      // Confirm the payment (e.g., update order status)
      await confirmPayment(orderId);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return (
    <Button onClick={sendSol} className="justify-start">
      <AlertCircle />
      Pay
    </Button>
  );
};

export default SolanaBuyButton;
